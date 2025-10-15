"""Flask application for portfolio website with RAG chatbot."""

from __future__ import annotations

import logging
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session
from flask_cors import CORS

import chatbot

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder="static")
app.secret_key = os.environ.get(
    "FLASK_SECRET_KEY", "dev-secret-key-change-in-production"
)
CORS(app)
app.config["DEBUG"] = os.environ.get("FLASK_DEBUG", "False").lower() == "true"

# Initialize RAG chain once at startup for better performance
try:
    rag_chain_instance = chatbot.RAGChain()
    logger.info("RAG chain initialized successfully")
except (ValueError, RuntimeError, OSError):
    logger.exception("Failed to initialize RAG chain")
    rag_chain_instance = None


@app.route("/", methods=["GET"])
def read_root() -> str:
    """Render the main portfolio page.

    Returns:
        Rendered HTML template for the portfolio homepage.

    """
    # Clear chat history for new sessions
    session["history"] = ""
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat_with_user():
    """Handle chat requests from users.

    Accepts a JSON payload with a "message" field, generates a response
    using the RAG chatbot, and returns the answer.

    Returns:
        JSON response with the chatbot's answer and HTTP status code.

    """
    if not rag_chain_instance:
        return jsonify({"error": "Chatbot is not available"}), 503

    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "No message provided"}), 400

    user_query = data["message"]

    # Use session-based history instead of global variable (thread-safe)
    history = session.get("history", "")

    response = rag_chain_instance.run_rag_chain(user_query, history)

    if response is None:
        return jsonify({"error": "Failed to generate response"}), 500

    # Update session history
    session["history"] = (
        f"{history}User Input: {user_query}; Bot response: {response}\n"
    )

    return jsonify({"answer": response}), 200


if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])
