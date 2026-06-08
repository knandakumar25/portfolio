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
                except (json.JSONDecodeError, IOError) as e:
                    print(f"Error loading {filepath}: {e}")
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
        print("[DEBUG] Chat endpoint called")

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')

        try:
            data = json.loads(body)
        except json.JSONDecodeError as e:
            print(f"[DEBUG] JSON decode error: {e}")
            self.send_error(400, 'Invalid JSON')
            return

        messages = data.get('messages', [])
        print(f"[DEBUG] Messages received: {len(messages)}")

        if not messages or len(messages) == 0:
            print("[DEBUG] No messages")
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'No messages provided'}).encode())
            return

        last_message = messages[-1].get('content', '').strip()
        if not last_message:
            print("[DEBUG] Empty last message")
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Empty message'}).encode())
            return

        try:
            print("[DEBUG] Loading portfolio data")
            portfolio_data = load_portfolio_data()
            print(f"[DEBUG] Loaded {len(portfolio_data)} data files")

            api_key = os.environ.get("GEMINI_API_KEY")
            print(f"[DEBUG] API Key present: {bool(api_key)}, length: {len(api_key) if api_key else 0}")

            if not api_key:
                raise Exception('GEMINI_API_KEY environment variable not set')

            print("[DEBUG] Creating Gemini client")
            client = genai.Client(api_key=api_key)
            print("[DEBUG] Client created successfully")

            model = "gemma-4-26b-a4b-it"
            print(f"[DEBUG] Using model: {model}")

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
            print(f"[DEBUG] Formatted {len(contents)} messages")

            tools = [
                types.Tool(googleSearch=types.GoogleSearch(
                )),
            ]

            portfolio_data = load_portfolio_data()
            portfolio_context = format_portfolio_context(portfolio_data)
            print(f"[DEBUG] Portfolio context length: {len(portfolio_context)}")

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
            print("[DEBUG] Config created, starting stream")

            response_text = ""
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=generate_content_config,
            ):
                if text := chunk.text:
                    response_text += text

            print(f"[DEBUG] Received response: {len(response_text)} chars")

            if response_text:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'response': response_text}).encode())
            else:
                raise Exception('No response from AI model')

        except Exception as e:
            print(f"[DEBUG] Exception caught: {str(e)}")
            import traceback
            print(f"[DEBUG] Traceback: {traceback.format_exc()}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
