from app import create_app
from config import Config

app = create_app()

if __name__ == "__main__":
    print(f"\n🚀 Website Builder API starting on http://localhost:{Config.PORT}\n")
    app.run(host="0.0.0.0", port=Config.PORT, debug=(Config.ENV == "development"))