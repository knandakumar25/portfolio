#!/usr/bin/env python3
"""
Portfolio AI Chat Assistant - Python Service
Utilizes the global Python 'ollama' library with process-scoped OLLAMA_MODELS.
"""

import os
import sys
import time
import subprocess
import urllib.request
from pathlib import Path

# Resolve project models directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = PROJECT_ROOT / "models"

# Set process-scoped OLLAMA_MODELS
os.environ["OLLAMA_MODELS"] = str(MODELS_DIR)

def is_ollama_running() -> bool:
    try:
        with urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=1) as resp:
            return resp.status == 200
    except Exception:
        return False

def ensure_ollama_running():
    if is_ollama_running():
        return
    env = os.environ.copy()
    env["OLLAMA_MODELS"] = str(MODELS_DIR)
    subprocess.Popen(["ollama", "serve"], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(25):
        time.sleep(1)
        if is_ollama_running():
            return
    raise RuntimeError("Could not connect to Ollama daemon on http://127.0.0.1:11434")

ensure_ollama_running()

import ollama

MODEL_NAME = "llama3.2:3b"

SYSTEM_PROMPT = """You are the AI Assistant for Karthik Nandakumar's professional portfolio.
Answer visitor questions about Karthik's background, education, skills, and projects concisely and accurately.

Key Profile Facts:
- Role: Software Engineer & Systems Researcher
- Current: Software Development & Implementation Intern at LlamaPress AI (October 2026 - Present)
- Education:
  • Master of Science in Computer Science (4.0 GPA) at Arizona State University
  • Bachelor of Science in Computer Science (Summa Cum Laude, 3.769 GPA) at North Carolina State University
- Key Projects:
  • Autonomous Cargo Router Microservice (Java 25, Apache Kafka 4.2 KRaft, O(k log k) Min-Heap)
  • WolfCafe Enterprise Platform (Spring Boot, React, RBAC)
  • Smart Home Hand Gesture CNN (TensorFlow, OpenCV)
  • Game Engines: The Broken Kingdom, Recourse, Endgame (Godot, Inkle)
- Core Skills: Java 25, Python, C++, Spring Boot, Kafka, React, Docker, Distributed Systems
- Contact: karthiknk21@gmail.com | +1 (215) 666-3741 | Cary, NC | Authorized to work in US and India
"""

def chat_interactive():
    print("=" * 60)
    print(f"Portfolio AI Assistant (Python Service - {MODEL_NAME})")
    print(f"Models Directory: {MODELS_DIR}")
    print("Type 'exit' or 'quit' to stop.\n" + "=" * 60)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ("exit", "quit"):
                print("Exiting chat service.")
                break

            messages.append({"role": "user", "content": user_input})
            print("\nAssistant: ", end="", flush=True)

            response = ollama.chat(model=MODEL_NAME, messages=messages, stream=True)
            full_response = ""
            for chunk in response:
                content = chunk.get("message", {}).get("content", "")
                print(content, end="", flush=True)
                full_response += content

            print()
            messages.append({"role": "assistant", "content": full_response})

        except KeyboardInterrupt:
            print("\nExiting.")
            break
        except Exception as e:
            print(f"\nError: {e}")

def ask_question(question: str) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": question}
    ]
    response = ollama.chat(model=MODEL_NAME, messages=messages)
    return response.get("message", {}).get("content", "")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        print(ask_question(query))
    else:
        chat_interactive()
