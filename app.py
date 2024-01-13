from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

app = FastAPI()

# Mount the 'static' directory for serving static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup Jinja2 templates
templates = Jinja2Templates(directory="templates")


# Define a route to render the template
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):  # Add request parameter
    data = {
        "title": "Fast API Template Rendering",
        "content": "This is a fast API for rendering templates!",
    }
    return templates.TemplateResponse("index.html", {"request": request, "data": data})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
