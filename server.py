"""Local server for Logic Lab — run with: python server.py"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser


PORT = 8000


def main():
    directory = Path(__file__).parent
    handler = lambda *args, **kwargs: SimpleHTTPRequestHandler(
        *args, directory=str(directory), **kwargs
    )
    server = ThreadingHTTPServer(("localhost", PORT), handler)
    url = f"http://localhost:{PORT}"
    print(f"Logic Lab is running at {url}")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
