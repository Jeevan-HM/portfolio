from flask import Flask, render_template, request, jsonify
import chatbot
from dotenv import load_dotenv
import os
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app)
app.config["DEBUG"] = os.environ.get("FLASK_DEBUG")
history = ""


@app.route("/", methods=["GET"])
def read_root():
    """
    The function `read_root()` returns the rendered template "index.html".
    :return: the result of the `render_template("index.html")` function call.
    """
    global history
    history = ""
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat_with_user():
    """
    This function receives a user query, uses a RAGChain chatbot instance to generate a response, and
    returns the response as a JSON object.
    :return: The function `chat_with_user` returns a JSON response containing the answer generated by
    the RAGChain chatbot.
    """
    global history
    data = request.json
    user_query = data.get("message")
    rag_chain_instance = chatbot.RAGChain()

    response = rag_chain_instance.run_rag_chain(user_query, history)
    message = {"answer": response}
    history += "User Input: " + user_query + "; Bot response: " + response + "\n"

    return jsonify(message)


if __name__ == "__main__":
    app.run()
