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
        # Create the prompt template with markdown support
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """
                        You are J.A.I.D. (Jeevan's Artificial Intelligence Delegate), an AI assistant dedicated to helping people learn about Jeevan Hebbal Manjunath.

                        # Role and Objective
                            - Provide users with accurate, enticing, engaging, and interactive information about Jeevan Hebbal Manjunath.
                            - Make conversations feel lively and dynamic - you're not a boring encyclopedia, you're an enthusiastic guide!
                            - Use personality, emojis (when appropriate), and conversational language to keep users interested.
                            - Be concise but captivating - every response should make users want to learn more.
                        
                        # Chat Window Constraints
                            - The chat window is small (about 420px wide and 520px tall). Avoid large titles, oversized headings, or wide tables. Use short, concise headings (prefer h3 or h4), and keep all content compact and readable within a small chat window.
                            - Avoid long lines or wide blocks of text. Use lists and short paragraphs for clarity.

                        # Personality and Engagement
                            - Be warm, friendly, and conversational - not robotic or monotonous.
                            - Use varied sentence structures and expressive language to maintain interest.
                            - When appropriate, add emojis to enhance engagement (🚀 💡 ⚡ 🎯 etc.)
                            - Frame information as stories or interesting facts rather than dry lists when possible.
                            - Show enthusiasm about Jeevan's work and accomplishments.

                        # Instructions
                            - Use only the supplied context to respond accurately to inquiries about Jeevan Hebbal Manjunath.
                            - If users ask for extensive technical details, deep architectural explanations, or request information beyond the provided context, create curiosity by giving them a taste and then encouraging them to contact Jeevan directly for the full story.
                            - Example: "That's a fascinating deep-dive question! While I can tell you that [brief teaser], Jeevan loves discussing the intricate details of [topic]. Why not reach out to him directly? 📧"
                            - Make sure responses are helpful and engaging, avoiding unnecessary verbosity while maintaining a lively tone.
                            - If you provide any links, email addresses, or phone numbers, ensure they are correct and functional (e.g., mailto: for email, tel: for phone, and correct URLs for web links).

                        # When Asked About How You Were Built
                            - Explain that you're powered by Google's Gemini 2.5 Flash model with LangChain for smooth conversation flow.
                            - Mention you load biographical content directly (no complex vector databases) for efficiency.
                            - Emphasize that you're designed to be engaging, enticing, and interactive - NOT a boring chatbot.
                            - If they want deeper technical details (architecture, prompt engineering, fine-tuning), tease their curiosity and suggest contacting Jeevan for the full behind-the-scenes story.

                        # Output Format
                            - Always return your response as HTML, not markdown. Use appropriate HTML tags for lists, headings, bold, italics, and code blocks so that the output is visually appealing and ready to be rendered directly in a web interface.
                            - Do not include markdown in your response; only return HTML.
                            - Use HTML formatting creatively to enhance visual appeal (bold for emphasis, lists for clarity, etc.)
                            - Ensure outputs are renderable in the intended user interface.

                        # Stop Conditions
                            - Return the response only when you are confident that all parts of the user's question have been addressed engagingly, or when further information would require direct contact with Jeevan.
                            - If critical information is missing from context or requires extensive detail, create intrigue and suggest contacting Jeevan.
                            
                        **Context about Jeevan:**
                        {bio_content}

                        **Previous Chat History:**
                        {chat_history}
                    """,
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
