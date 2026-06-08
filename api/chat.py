import json
import os
import glob
from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types


def load_portfolio_data():
    """Load all JSON files from src/data and subfolders."""
    portfolio_data = {}

    # Try multiple possible paths
    base_paths = [
        os.path.join(os.path.dirname(__file__), '../src/data'),
        os.path.join(os.getcwd(), 'src/data'),
        '/var/task/src/data',  # Vercel deployment path
    ]

    for base_path in base_paths:
        json_pattern = os.path.join(base_path, '**/*.json')
        files = glob.glob(json_pattern, recursive=True)

        if files:
            for filepath in files:
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        filename = os.path.basename(filepath)
                        portfolio_data[filename] = json.load(f)
                except (json.JSONDecodeError, IOError):
                    pass
            break

    return portfolio_data


def format_portfolio_context(portfolio_data):
    """Format portfolio data into a readable context string."""
    context = "Portfolio Information:\n\n"
    for filename, data in portfolio_data.items():
        context += f"## {filename}\n"
        context += json.dumps(data, indent=2)
        context += "\n\n"
    return context


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON')
            return

        messages = data.get('messages', [])

        if not messages or len(messages) == 0:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'No messages provided'}).encode())
            return

        last_message = messages[-1].get('content', '').strip()
        if not last_message:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Empty message'}).encode())
            return

        try:
            client = genai.Client(
                api_key=os.environ.get("GEMINI_API_KEY"),
            )

            model = "gemma-4-26b-a4b-it"

            contents = []
            for msg in messages:
                role = "user" if msg['role'] == "user" else "model"
                contents.append(
                    types.Content(
                        role=role,
                        parts=[
                            types.Part.from_text(text=msg['content']),
                        ],
                    )
                )

            tools = [
                types.Tool(googleSearch=types.GoogleSearch(
                )),
            ]

            portfolio_data = load_portfolio_data()
            portfolio_context = format_portfolio_context(portfolio_data)

            system_instruction = f"""You are a helpful portfolio assistant for Karthik Nandakumar's portfolio website.
You help visitors learn about the portfolio owner's experience, skills, and projects.
Be friendly, concise, and informative.

Here is the portfolio data you have access to:

{portfolio_context}

Use this information to answer questions about the portfolio owner's experience, education, projects, certifications, and game projects."""

            generate_content_config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                thinking_config=types.ThinkingConfig(
                    thinking_level="HIGH",
                ),
                tools=tools,
            )

            response_text = ""
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=generate_content_config,
            ):
                if text := chunk.text:
                    response_text += text

            if response_text:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'response': response_text}).encode())
            else:
                raise Exception('No response from AI model')

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
