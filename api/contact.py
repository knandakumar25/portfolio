import json
import os

import psycopg2
from django.conf import settings
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def contact_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not name or not email or not subject or not message:
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    try:
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            raise Exception('DATABASE_URL not set')

        with psycopg2.connect(db_url) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    'INSERT INTO contact_messages (name, email, subject, message) VALUES (%s, %s, %s, %s)',
                    (name, email, subject, message),
                )

        try:
            _send_email(name, email, subject, message)
        except Exception as exc:
            print(f'Email send failed: {exc}')

        return JsonResponse({'status': 'success', 'message': 'Message sent successfully!'})
    except Exception as exc:
        return JsonResponse({'error': str(exc)}, status=500)


def _send_email(name, email, subject, message):
    gmail_email = getattr(settings, 'EMAIL_HOST_USER', '')
    gmail_password = getattr(settings, 'EMAIL_HOST_PASSWORD', '')

    if not gmail_email or not gmail_password:
        raise Exception('Gmail credentials not configured')

    body = (
        'You have a new message from your portfolio contact form:\n\n'
        f'Name: {name}\n'
        f'Email: {email}\n'
        f'Subject: {subject}\n'
        'Message:\n'
        f'{message}\n'
    )

    email_message = EmailMessage(
        subject=subject,
        body=body,
        from_email=gmail_email,
        to=[gmail_email],
        reply_to=[email],
    )
    email_message.send(fail_silently=False)
