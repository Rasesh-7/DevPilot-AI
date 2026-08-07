"""
Unit tests for Zip upload and Snippet review API endpoints.
"""

import io
import sys
import unittest
import zipfile
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app import app


class TestUploadAPI(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_analyze_snippet_success(self):
        code = "def add(a, b):\n    return a + b\n"
        response = self.client.post(
            "/analyze/snippet",
            json={"code": code, "filename": "math_utils.py", "language": "Python"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("id", data)
        self.assertEqual(data["source_type"], "snippet")
        self.assertIn("quality_score", data)
        self.assertEqual(data["repo_meta"]["repo"], "math_utils.py")

    def test_analyze_snippet_empty_code(self):
        response = self.client.post(
            "/analyze/snippet",
            json={"code": "   ", "filename": "test.py"},
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("empty", response.json()["detail"].lower())

    def test_analyze_zip_success(self):
        # Create an in-memory zip file with code
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w") as zf:
            zf.writestr("src/main.py", "print('Hello World')\n")
            zf.writestr("src/utils.js", "console.log('Util');\n")

        buffer.seek(0)
        response = self.client.post(
            "/analyze/zip",
            files={"file": ("project.zip", buffer, "application/zip")},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("id", data)
        self.assertEqual(data["source_type"], "zip")
        self.assertIn("quality_score", data)

    def test_analyze_zip_invalid_file_extension(self):
        response = self.client.post(
            "/analyze/zip",
            files={"file": ("project.txt", b"dummy content", "text/plain")},
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("only .zip files", response.json()["detail"].lower())


if __name__ == "__main__":
    unittest.main()
