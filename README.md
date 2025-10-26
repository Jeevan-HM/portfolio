# Portfolio Website with AI Chatbot

A modern, professional portfolio website featuring an intelligent chatbot powered by Google Gemini 2.5 Flash.

## 🚀 Features

- **Interactive Portfolio**: Showcase of experience, projects, and skills
- **AI-Powered Chatbot**: J.A.I.D. (Jeevan's Artificial Intelligence Delegate)
  - Uses Google Gemini 2.5 Flash model (100% FREE)
  - 60,000 requests per day limit
  - No embeddings or vector database required
  - Simple, efficient context-based generation
- **Responsive Design**: Bootstrap-based responsive layout
- **Professional Code**: Type-safe, well-documented Python code

## 🏗️ Architecture

### Simple & Efficient Design

```
User Query → Flask API → Gemini 2.5 Flash → Response
                ↓
         Direct Context Injection
         (No embeddings, No FAISS)
```

### Technology Stack

- **Backend**: Flask 3.0+
- **AI Model**: Google Gemini 2.5 Flash
- **Framework**: LangChain (minimal components)
- **Package Manager**: UV
- **Python**: 3.11+

## 📦 Installation

### Prerequisites

- Python 3.11 or higher
- UV package manager (or pip)
- Google API Key (free from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install UV (if not already installed)**
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

3. **Create virtual environment and install dependencies**
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file
   echo "GOOGLE_API_KEY=your_api_key_here" > .env
   echo "FLASK_DEBUG=False" >> .env
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   ```
   http://127.0.0.1:5000
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
FLASK_DEBUG=False
```

### Bio Content

Add biographical content to `static/bio/bio.txt`. The chatbot will automatically load and use this content to answer questions.

## 📁 Project Structure

```
portfolio/
├── app.py                      # Flask application
├── chatbot.py                  # Gemini chatbot implementation
├── pyproject.toml              # UV package configuration
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (create this)
├── static/
│   ├── bio/
│   │   └── bio.txt            # Biography content
│   ├── images/                # Image assets
│   ├── main.js                # Frontend JavaScript
│   ├── style.css              # Styles
│   └── *.min.js               # External libraries
└── templates/
    └── index.html             # Main HTML template
```

## 🤖 Chatbot Features

### J.A.I.D. (Jeevan's Artificial Intelligence Delegate)

- **Natural Conversations**: Context-aware responses using conversation history
- **Accurate Information**: Answers based on provided biographical content
- **Fallback Handling**: Politely redirects when information is not available
- **Rate Limit Friendly**: 60,000 requests per day with Google Gemini 2.5 Flash

### API Endpoint

**POST /chat**
```json
{
  "message": "What is Jeevan's experience with AI?"
}
```

Response:
```json
{
  "answer": "Jeevan has extensive experience in AI..."
}
```

## 🎯 Key Benefits

### Why Google Gemini 2.5 Flash?

1. **100% FREE**: No API costs for up to 60,000 requests/day
2. **Simple Architecture**: No embeddings or vector databases needed
3. **Fast Response**: Direct context injection for quick answers
4. **Easy Maintenance**: Minimal dependencies (9 packages)
5. **Professional Code**: Type-safe, well-documented, 0 linter errors

### Compared to Previous Architecture

| Feature | Before (OpenAI + FAISS) | After (Gemini 2.5 Flash) |
|---------|------------------------|--------------------------|
| Cost | Paid API | 100% FREE |
| Daily Limit | 1,500 embeddings | 60,000 requests |
| Dependencies | 75+ packages | 9 packages |
| Setup | Complex (FAISS index) | Simple (direct context) |
| Maintenance | Rebuild indexes | Load text files |

## 🔍 Code Quality

- **Type Safety**: Modern Python 3.10+ type hints (`str | None`)
- **Professional Standards**: Proper logging, error handling, docstrings
- **Linter Clean**: 0 errors in chatbot.py
- **Best Practices**: Specific exception handling, proper variable names

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production (Gunicorn)
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Docker (Optional)
```bash
docker build -t portfolio .
docker run -p 5000:5000 --env-file .env portfolio
```

## 📝 Dependencies

Core dependencies (9 packages):
- `flask>=3.0.3` - Web framework
- `flask-cors>=5.0.0` - CORS support
- `gunicorn>=23.0.0` - Production server
- `python-dotenv>=1.0.1` - Environment variables
- `langchain>=0.3.7` - LLM framework
- `langchain-core>=0.3.15` - Core components
- `langchain-google-genai>=2.0.5` - Google integration
- `google-generativeai>=0.8.3` - Gemini API
- `pydantic>=2.9.2` - Data validation

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code passes all linter checks
- Proper type hints are included
- Docstrings follow Google style
- No emojis in log statements

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Jeevan Hebbal Manjunath**
- LinkedIn: https://www.linkedin.com/in/jeevan-h-m
- GitHub: https://github.com/Jeevan-HM 

---

**Note**: This chatbot uses Google Gemini 2.5 Flash which is completely free for up to 60,000 requests per day. 
