from langchain import hub
from langchain_community.vectorstores import FAISS
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os
from langchain.prompts import PromptTemplate


class CreateDocument:
    def __init__(self):
        from langchain_community.document_loaders import DirectoryLoader

        self.loader = DirectoryLoader("static/bio")

    def create_documents(self):
        load_dotenv()
        self.embeddings = OpenAIEmbeddings()
        docs = self.loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        splits = text_splitter.split_documents(docs)

        docsearch = FAISS.from_documents(splits, self.embeddings)
        docsearch.save_local("faiss_index")


class RAGChain:
    def __init__(self):
        load_dotenv()
        self.embeddings = OpenAIEmbeddings()
        self.vectorstore = FAISS.load_local("faiss_index", self.embeddings)
        self.retriever = self.vectorstore.as_retriever()
        self.prompt = ""
        # self.prompt = hub.pull("rlm/rag-prompt")
        print(self.prompt)
        self.llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

    def format_docs(self, docs):
        """Format a list of documents."""
        return "\n\n".join(doc.page_content for doc in docs)

    def run_rag_chain(self, query):
        prompt_template = """You are a AI assistant dedicated to Jeevan. Ensure all the rules are followed.
        1. All responses should be kept professional.
        2. All information should be relavent and concise.
        3. The response should be short 2-3 lines unless user asks for a detailed explaination.
        4. If any information is not provided in the context, let the user know that you do not have information on that and it would be better to contact me directly. Also provide them with contact information.
        

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


def main(question):
    rag_chain_instance = RAGChain()

    query = question
    result = rag_chain_instance.run_rag_chain(query)

    if result is not None:
        print(result)
    else:
        print("An error occurred during execution.")


if __name__ == "__main__":
    doc = CreateDocument()
    doc.create_documents()
    # while True:
    #     question = str(input("Enter a Question:"))
    #     main(question)
