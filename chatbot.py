from langchain import hub
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os
from langchain.prompts import PromptTemplate


# The `CreateDocument` class is responsible for creating documents by loading text files from a
# directory, splitting them into chunks, and saving them in a FAISS index for efficient searching.
class CreateDocument:
    def __init__(self):
        """
        The function initializes an instance of the DirectoryLoader class from the
        langchain_community.document_loaders module, with a specified directory path.
        """
        from langchain_community.document_loaders import DirectoryLoader

        self.loader = DirectoryLoader("static/bio")

    def create_documents(self):
        """
        The function `create_documents` creates and saves a FAISS index for a collection of documents,
        using OpenAI embeddings and a text splitter.
        """
        load_dotenv()
        self.embeddings = OpenAIEmbeddings()
        docs = self.loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        splits = text_splitter.split_documents(docs)

        docsearch = FAISS.from_documents(splits, self.embeddings)
        docsearch.save_local("faiss_index")


# The `RAGChain` class is a Python implementation of a RAG (Retrieval-Augmented Generation) model that
# uses OpenAI's GPT-3.5-turbo for question answering and document retrieval.
class RAGChain:
    def __init__(self):
        """
        The above function initializes various components for a chatbot, including loading embeddings,
        creating a vector store, setting up a retriever, and initializing a language model.
        """
        load_dotenv()
        self.embeddings = OpenAIEmbeddings()
        self.vectorstore = FAISS.load_local("faiss_index", self.embeddings)
        self.retriever = self.vectorstore.as_retriever()
        self.prompt = ""
        # self.prompt = hub.pull("rlm/rag-prompt")
        print(self.prompt)
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

    def format_docs(self, docs):
        """
        The `format_docs` function takes a list of documents and returns a formatted string with the
        page content of each document separated by two newlines.

        :param docs: A list of documents
        :return: a string that contains the page content of each document in the list, separated by two
        newline characters.
        """
        return "\n\n".join(doc.page_content for doc in docs)

    def run_rag_chain(self, query):
        """
        The function `run_rag_chain` runs a RAG (Retrieval-Augmented Generation) chain with a given
        query.

        :param query: The query is the input question or statement that the user wants to ask or discuss
        with the AI assistant. It is the main input for the RAG chain to generate a helpful answer
        :return: The run_rag_chain function returns the result of the RAG chain execution.
        """

        prompt_template = """You are a J.A.I.D. (Jeevan's Artificial Intelligence Delegate) AI assistant designed using RAG dedicated to Jeevan. Ensure all the rules are followed.
        1. All responses should be kept professional.
        2. All information should be relavent and concise.
        3. The response should be short 2-3 lines unless user asks for a detailed explaination.
        4. If any information is not provided in the context, let the user know that you do not have information on that and it would be better to contact me directly.Also provide them with contact information.
        5. Ensure that all points are in new lines.
        

        {context}

        Question: {question}
        Helpful Answer:"""
        self.prompt = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        """Run the RAG chain with the given query."""
        rag_chain = (
            {
                "context": self.retriever | self.format_docs,
                "question": RunnablePassthrough(),
            }
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

        try:
            result = rag_chain.invoke(query)
            return result
        except Exception as e:
            print(f"Error during RAG chain execution: {e}")
            return None


# doc = CreateDocument()
# doc.create_documents()
