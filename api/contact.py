import json
import os
import smtplib
from email import encoders
from email.parser import BytesParser
from email import policy
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from http.server import BaseHTTPRequestHandler

import psycopg2


MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024
ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.txt', '.docx'}
ALLOWED_MIME_TYPES = {
    'application/pdf',
    'image/png',
    'image/jpeg',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.command != 'POST':
            self._send_json(405, {'error': 'Method not allowed'})
            return

        content_length = int(self.headers.get('Content-Length', 0))
        raw_body = self.rfile.read(content_length)
        content_type = self.headers.get('Content-Type', '')

        if 'multipart/form-data' in content_type:
            parsed = self._parse_multipart(raw_body, content_type)
            if parsed.get('error'):
                self._send_json(400, {'error': parsed['error']})
                return

            data = parsed.get('fields', {})
            attachment = parsed.get('attachment')
        else:
            try:
                body = raw_body.decode('utf-8')
                data = json.loads(body)
                attachment = None
            except json.JSONDecodeError:
                self._send_json(400, {'error': 'Invalid JSON'})
                return
            except UnicodeDecodeError:
                self._send_json(400, {'error': 'Invalid request encoding'})
                return

        if not isinstance(data, dict):
            self._send_json(400, {'error': 'Invalid request payload'})
            return

        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not name or not email or not subject or not message:
            self._send_json(400, {'error': 'Missing required fields'})
            return

        try:
            db_url = os.environ.get('DATABASE_URL')
            if not db_url:
                raise Exception('DATABASE_URL not set')

            conn = psycopg2.connect(db_url)
            cur = conn.cursor()

            cur.execute(
                'INSERT INTO contact_messages (name, email, subject, message) VALUES (%s, %s, %s, %s)',
                (name, email, subject, message),
            )

            conn.commit()
            cur.close()
            conn.close()

            try:
                self._send_email(name, email, subject, message, attachment)
            except Exception as exc:
                print(f'Email send failed: {exc}')

            self._send_json(200, {'status': 'success', 'message': 'Message sent successfully!'})

        except Exception as exc:
            self._send_json(500, {'error': str(exc)})

    def _send_json(self, status_code, payload):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def _parse_multipart(self, raw_body, content_type):
        mime_message = b'Content-Type: ' + content_type.encode() + b'\r\nMIME-Version: 1.0\r\n\r\n' + raw_body
        parsed_message = BytesParser(policy=policy.default).parsebytes(mime_message)

        if not parsed_message.is_multipart():
            return {'error': 'Invalid multipart payload'}

        fields = {}
        attachment = None

        for part in parsed_message.iter_parts():
            disposition = part.get_content_disposition()
            if disposition != 'form-data':
                continue

            field_name = part.get_param('name', header='content-disposition')
            filename = part.get_filename()
            content = part.get_payload(decode=True) or b''

            if filename:
                if attachment is not None:
                    return {'error': 'Only one attachment is allowed'}

                safe_name = os.path.basename(filename)
                extension = os.path.splitext(safe_name)[1].lower()
                mime_type = part.get_content_type()

                if extension not in ALLOWED_EXTENSIONS or mime_type not in ALLOWED_MIME_TYPES:
                    return {'error': 'Unsupported file type'}

                if len(content) > MAX_ATTACHMENT_SIZE:
                    return {'error': 'Attachment exceeds 2 MB limit'}

                attachment = {
                    'filename': safe_name,
                    'mime_type': mime_type,
                    'content': content,
                }
            else:
                charset = part.get_content_charset() or 'utf-8'
                try:
                    value = content.decode(charset).strip()
                except UnicodeDecodeError:
                    value = content.decode('utf-8', errors='replace').strip()

                if field_name:
                    fields[field_name] = value

        return {'fields': fields, 'attachment': attachment}

    def _send_email(self, name, email, subject, message, attachment=None):
        gmail_email = os.environ.get('GMAIL_EMAIL')
        gmail_password = os.environ.get('GMAIL_APP_PASSWORD')

        if not gmail_email or not gmail_password:
            raise Exception('Gmail credentials not configured')

        msg = MIMEMultipart()
        msg['From'] = f'{name} <{gmail_email}>'
        msg['To'] = gmail_email
        msg['Reply-To'] = email
        msg['Subject'] = subject

        body = f"""
You have a new message from your portfolio contact form:

Name: {name}
Email: {email}
Subject: {subject}
Message:
{message}
        """

        msg.attach(MIMEText(body, 'plain'))

        if attachment:
            file_part = MIMEBase('application', 'octet-stream')
            file_part.set_payload(attachment['content'])
            encoders.encode_base64(file_part)
            file_part.add_header('Content-Disposition', f'attachment; filename="{attachment["filename"]}"')
            file_part.add_header('Content-Type', attachment['mime_type'])
            msg.attach(file_part)

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(gmail_email, gmail_password)
            server.send_message(msg)
