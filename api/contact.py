import json
import psycopg2
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return

        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Missing required fields'}).encode())
            return

        try:
            db_url = os.environ.get('DATABASE_URL')
            if not db_url:
                raise Exception('DATABASE_URL not set')

            conn = psycopg2.connect(db_url)
            cur = conn.cursor()

            cur.execute(
                "INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s)",
                (name, email, message)
            )

            conn.commit()
            cur.close()
            conn.close()

            # Send email notification
            try:
                self._send_email(name, email, message)
            except Exception as e:
                print(f"Email send failed: {e}")

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'message': 'Message sent successfully!'}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def _send_email(self, name, email, message):
        gmail_email = os.environ.get('GMAIL_EMAIL')
        gmail_password = os.environ.get('GMAIL_APP_PASSWORD')

        if not gmail_email or not gmail_password:
            raise Exception('Gmail credentials not configured')

        msg = MIMEMultipart()
        msg['From'] = gmail_email
        msg['To'] = gmail_email
        msg['Reply-To'] = email
        msg['Subject'] = f'New Contact Form Submission from {name}'

        body = f"""
You have a new message from your portfolio contact form:

Name: {name}
Email: {email}
Message:
{message}
        """

        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(gmail_email, gmail_password)
            server.send_message(msg)
