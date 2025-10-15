"""
Portfolio Chatbot using Google Gemini 2.5 Flash.

This module implements a simple, efficient chatbot that uses Google's Gemini 2.5 Flash
model for generating responses. It loads biographical content directly without requiring
vector embeddings or FAISS indexing.
"""

import logging
from pathlib import Path

from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SimpleChatbot:
    """
    Simple chatbot that loads biographical content and uses Google Gemini 2.5 Flash.

    This chatbot provides an efficient question-answering system without requiring
    vector embeddings or FAISS indexing. It loads biographical content at initialization
    and includes it as context in each query to the language model.
    """

    def __init__(self, bio_dir: str = "static/bio") -> None:
        """
        Initialize the chatbot with biographical content.

        Args:
            bio_dir: Directory containing biographical text files.

        """
        self.bio_content = self._load_bio_content(bio_dir)
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.7,
        )

    def _load_bio_content(self, bio_dir: str) -> str:
        """
        Load all text files from bio directory.

        Args:
            bio_dir: Directory path containing text files.

        Returns:
            Combined content from all text files.

        """
        bio_path = Path(bio_dir)
        content_list = []

        if not bio_path.exists():
            logger.warning("Bio directory '%s' not found", bio_dir)
            return ""

        for file_path in bio_path.glob("*.txt"):
            try:
                with file_path.open(encoding="utf-8") as file_handle:
                    content_list.append(file_handle.read())
            except (OSError, ValueError) as error:
                logger.warning("Could not read %s: %s", file_path, error)

        combined_content = "\n\n".join(content_list)
        logger.info(
            "Loaded %d bio file(s), %d characters",
            len(content_list),
            len(combined_content),
        )
        return combined_content

    def chat(self, user_query: str, chat_history: str = "") -> str | None:
        """
        Generate a response to the user's query.

        Args:
            user_query: The user's question or message.
            chat_history: Previous conversation history.

        Returns:
            The chatbot's response, or None if an error occurs.

        """
        # Create the prompt template
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are J.A.I.D. (Jeevan's Artificial Intelligence Delegate), an AI assistant dedicated to helping people learn about Jeevan Hebbal Manjunath.

**Instructions:**
1. Use the context below to answer questions about Jeevan accurately and concisely.
2. Keep responses friendly, professional, and to the point.
3. If asked about information not in the context, politely suggest contacting Jeevan directly and provide contact information.
4. Be helpful and engaging in your responses.

**Context about Jeevan:**
{bio_content}

**Previous Chat History:**
{chat_history}""",
                ),
                ("human", "{user_query}"),
            ],
        )

        try:
            # Format the prompt with context
            formatted_prompt = prompt.format_messages(
                bio_content=self.bio_content,
                chat_history=chat_history if chat_history else "No previous messages",
                user_query=user_query,
            )

            # Get response from Gemini
            llm_response = self.llm.invoke(formatted_prompt)
            response_content = llm_response.content

            # Ensure we return a string
            if isinstance(response_content, str):
                return response_content
            return str(response_content)

        except (OSError, ValueError):
            logger.exception("Error during chat")
            return None


# Legacy compatibility - keep old class name
class RAGChain(SimpleChatbot):
    """Legacy class name for backward compatibility."""

    def __init__(self):
        """Initialize with default settings."""
        super().__init__()

    def run_rag_chain(self, query: str, memory: str) -> str | None:
        """
        Legacy method name for backward compatibility.

        Args:
            query: User's question.
            memory: Chat history.

        Returns:
            Chatbot response or None if error occurs.

        """
        return self.chat(query, memory)
