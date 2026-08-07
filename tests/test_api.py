"""
Unit tests for backend API routes.
"""

import sys
import unittest
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app import app


class TestBackendAPI(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)
        self.assertEqual(data["message"], "Welcome to DevPilot AI Backend")

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")

    def test_analyze_invalid_url(self):
        response = self.client.post("/analyze", json={"github_url": "invalid-url"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid GitHub repository URL", response.json()["detail"])

    def test_analyze_valid_url(self):
        response = self.client.post("/analyze", json={"github_url": "https://github.com/acme/payments-api"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("id", data)
        self.assertIn("quality_score", data)
        self.assertIn("repo_meta", data)
        self.assertEqual(data["repo_meta"]["owner"], "acme")
        self.assertEqual(data["repo_meta"]["repo"], "payments-api")


if __name__ == "__main__":
    unittest.main()
