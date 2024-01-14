from flask import Flask, render_template, request, jsonify
import chatbot

app = Flask(__name__)


# Define a route to render the template
@app.route("/", methods=["GET"])
def read_root():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat_with_user():
    data = request.json
    user_query = data.get("message")
    rag_chain_instance = chatbot.RAGChain()
    response = rag_chain_instance.run_rag_chain(user_query)
    message = {"answer": response}
    return jsonify(message)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
