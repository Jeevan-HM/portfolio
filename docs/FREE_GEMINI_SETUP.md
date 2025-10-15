# 🎉 FREE Alternative: Google Gemini Setup Guide

## Why Google Gemini?

✅ **Completely FREE** with generous limits:
- 15 requests per minute
- 1500 requests per day
- 1 million tokens per day (for gemini-1.5-flash)

✅ **Perfect for global hosting** - No payment required
✅ **Easy to set up** - Just one API key
✅ **Great performance** - Comparable to GPT-3.5/4

---

## Step 1: Get Your FREE Google Gemini API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Click **"Get API Key"** or **"Create API Key"**
3. Select or create a Google Cloud project
4. Copy your API key (starts with `AIza...`)

**No credit card required!** 🎉

---

## Step 2: Update Your Dependencies

```bash
cd /Users/g1/Developer/portfolio
source .venv/bin/activate

# Uninstall OpenAI packages (no longer needed)
pip uninstall openai langchain-openai -y

# Install Google Gemini packages
pip install --upgrade pip
pip install -r requirements_updated.txt
```

Or install manually:
```bash
pip install langchain-google-genai==2.0.5
pip install google-generativeai==0.8.3
```

---

## Step 3: Update Your .env File

Replace `OPENAI_API_KEY` with `GOOGLE_API_KEY`:

```bash
# Edit your .env file
cat > .env << 'EOF'
# Google Gemini API Key (FREE!)
GOOGLE_API_KEY=your-gemini-api-key-here

# Flask settings
FLASK_SECRET_KEY=your-secret-key-for-sessions
FLASK_DEBUG=false
EOF
```

Or just add it:
```bash
echo "GOOGLE_API_KEY=your-gemini-api-key-here" >> .env
```

---

## Step 4: Recreate Your FAISS Index (IMPORTANT!)

Since we changed from OpenAI embeddings to Google embeddings, you need to recreate the FAISS index:

```bash
# In your Python environment
python -c "
from chatbot import CreateDocument
doc = CreateDocument()
doc.create_documents()
print('✅ FAISS index created with Google embeddings!')
"
```

---

## Step 5: Test Your Application

```bash
# Start the Flask app
python app.py
```

Then test the chatbot:
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Who is Jeevan?"}'
```

---

## What Changed?

### Before (OpenAI - Paid):
```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

self.embeddings = OpenAIEmbeddings()
self.llm = ChatOpenAI(model="gpt-3.5-turbo")
```

### After (Google Gemini - FREE):
```python
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
```

---

## Available FREE Models

### Gemini Models (All FREE):
- **`gemini-1.5-flash`** (default) - Fast, efficient, best for chatbots ⚡
- **`gemini-1.5-pro`** - More powerful, better reasoning 🧠
- **`gemini-pro`** - Balanced performance 🎯

### Change Model in Your Code:
```python
# In app.py or when initializing
rag_chain_instance = chatbot.RAGChain(model_name="gemini-1.5-pro")
```

---

## Rate Limits (FREE Tier)

| Model | RPM (Requests/Min) | RPD (Requests/Day) | TPD (Tokens/Day) |
|-------|-------------------|-------------------|------------------|
| gemini-1.5-flash | 15 | 1,500 | 1,000,000 |
| gemini-1.5-pro | 2 | 50 | 32,000 |

**More than enough for a portfolio chatbot!** 🚀

---

## Troubleshooting

### Error: "GOOGLE_API_KEY not found"
**Solution**: Make sure `.env` file has:
```bash
GOOGLE_API_KEY=AIza...your-key-here
```

### Error: "google.generativeai not found"
**Solution**: Install the package:
```bash
pip install google-generativeai==0.8.3
```

### Error: "FAISS index incompatible"
**Solution**: Recreate the index with Google embeddings:
```python
python -c "from chatbot import CreateDocument; CreateDocument().create_documents()"
```

### Error: "429 - Too Many Requests"
**Solution**: You hit the rate limit. Wait a minute or:
1. Use `gemini-1.5-flash` (15 RPM instead of 2)
2. Add exponential backoff in your code

---

## Cost Comparison

| Service | Free Tier | Monthly Cost (1M tokens) |
|---------|-----------|--------------------------|
| OpenAI GPT-3.5 | ❌ None | ~$2.00 |
| OpenAI GPT-4 | ❌ None | ~$30.00 |
| **Google Gemini** | ✅ **1M tokens/day FREE** | **$0.00** |

---

## Deployment to Production

### For Render/Heroku/Railway:
Add environment variable in dashboard:
```
GOOGLE_API_KEY=your-key-here
```

### For Google Cloud Run:
```yaml
# In app.yaml
env_variables:
  GOOGLE_API_KEY: "your-key-here"
```

### For Docker:
```dockerfile
# In Dockerfile
ENV GOOGLE_API_KEY=your-key-here

# Or pass at runtime
docker run -e GOOGLE_API_KEY=your-key-here your-image
```

---

## Performance Tips

1. **Use gemini-1.5-flash** for faster responses
2. **Cache frequently asked questions** to reduce API calls
3. **Implement rate limiting** on your Flask app:
   ```bash
   pip install flask-limiter
   ```

4. **Monitor your usage**: https://aistudio.google.com/app/apikey

---

## Alternative: Ollama (100% Free, Local)

If you want **completely offline** and **unlimited usage**:

### Install Ollama:
```bash
# macOS
brew install ollama

# Start Ollama server
ollama serve

# Download a model
ollama pull llama3.2
```

### Update chatbot.py:
```python
from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings

self.embeddings = OllamaEmbeddings(model="llama3.2")
self.llm = Ollama(model="llama3.2")
```

**Pros**: 100% free, unlimited, offline
**Cons**: Requires more RAM (8GB+), slower than cloud APIs

---

## Comparison: Cloud vs Local

| Feature | Google Gemini (Cloud) | Ollama (Local) |
|---------|----------------------|----------------|
| Cost | FREE (with limits) | FREE (unlimited) |
| Speed | ⚡ Fast | 🐢 Slower |
| Internet | ✅ Required | ❌ Not required |
| Setup | 🟢 Easy | 🟡 Moderate |
| RAM | N/A | 8GB+ |
| Best for | **Production hosting** | Development/testing |

---

## Recommendation

For your use case (hosting globally), **Google Gemini is the best choice**:
- ✅ FREE with generous limits
- ✅ Fast and reliable
- ✅ Easy to set up
- ✅ Perfect for portfolio chatbot traffic

---

## Next Steps

1. ✅ Get your FREE API key: https://aistudio.google.com/app/apikey
2. ✅ Update `.env` file with `GOOGLE_API_KEY`
3. ✅ Install dependencies: `pip install -r requirements_updated.txt`
4. ✅ Recreate FAISS index with Google embeddings
5. ✅ Test your app: `python app.py`
6. ✅ Deploy to your hosting platform

---

**You're now using a FREE, production-ready AI chatbot!** 🎉

No more API costs, perfect for global hosting, and great performance.

Need help? Check the logs or reach out! 🚀
