#!/usr/bin/env python3
"""
Simple HTTP server for testing browser functionality
Serves the safe-refactor directory with proper CORS headers for ES modules
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

PORT = 8888

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def guess_type(self, path):
        mimetype = super().guess_type(path)
        # Ensure JavaScript files are served with correct MIME type
        if path.endswith('.js'):
            return 'application/javascript'
        return mimetype

def main():
    # Change to the safe-refactor directory (parent of parent of this script)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    safe_refactor_dir = os.path.join(script_dir, '..', '..')
    os.chdir(safe_refactor_dir)
    
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print(f"🚀 Test server running at http://localhost:{PORT}")
        print(f"📁 Serving files from: {safe_refactor_dir}")
        print(f"🧪 Open http://localhost:{PORT}/tests/browser/test-browser-simple.html to run browser tests")
        print(f"⏹️  Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Shutting down server...")
            httpd.shutdown()
            print("✅ Server stopped")

if __name__ == "__main__":
    main()
