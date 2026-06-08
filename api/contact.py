import json
import psycopg2
import os

def handler(request):
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, AttributeError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON'})
        }

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing required fields: name, email, and message'})
        }

    try:
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            raise Exception('DATABASE_URL environment variable is not set')

        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s)",
            (name, email, message)
        )

        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'body': json.dumps({'status': 'success', 'message': 'Message sent successfully!'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
