"""
Unit tests for backend helper functions and services.
"""

import sys
import unittest
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from utils.helpers import parse_github_url, is_valid_github_url, is_code_file
from services.file_reader import compute_stats, build_code_summary
from services.prompt_builder import build_analysis_prompt
from services.ai_service import _generate_dynamic_analysis


class TestBackendServices(unittest.TestCase):

    def test_parse_github_url(self):
        owner, repo = parse_github_url("https://github.com/fastapi/fastapi")
        self.assertEqual(owner, "fastapi")
        self.assertEqual(repo, "fastapi")

        owner, repo = parse_github_url("github.com/tensorflow/tensorflow.git")
        self.assertEqual(owner, "tensorflow")
        self.assertEqual(repo, "tensorflow")

        self.assertFalse(is_valid_github_url("not-a-github-url"))

    def test_is_code_file(self):
        self.assertTrue(is_code_file("src/main.py"))
        self.assertTrue(is_code_file("app/components/Button.tsx"))
        self.assertFalse(is_code_file("node_modules/react/index.js"))
        self.assertFalse(is_code_file("package-lock.json"))

    def test_file_reader_stats(self):
        tree = [
            {"path": "main.py", "type": "blob"},
            {"path": "utils.py", "type": "blob"},
            {"path": "README.md", "type": "blob"},
        ]
        code_files = {
            "main.py": "print('hello')\nprint('world')",
            "utils.py": "def add(a, b):\n    return a + b\n",
        }
        stats = compute_stats(tree, code_files)
        self.assertEqual(stats["total_files"], 3)
        self.assertGreater(stats["lines_of_code"], 0)
        self.assertIn("Python", stats["languages"])

    def test_prompt_builder(self):
        meta = {"full_name": "owner/repo", "language": "Python"}
        stats = {"total_files": 2, "lines_of_code": 10, "languages": {"Python": 2}}
        summary = "--- FILE: main.py ---\nprint('hi')"
        prompt = build_analysis_prompt(meta, stats, summary)
        self.assertIn("DevPilot AI", prompt)
        self.assertIn("owner/repo", prompt)

    def test_dynamic_ai_analysis(self):
        meta = {"owner": "acme", "repo": "payments-api", "language": "TypeScript"}
        stats = {"total_files": 12, "lines_of_code": 1200}
        tree = [{"path": "src/payments.ts", "type": "blob"}]
        result = _generate_dynamic_analysis(meta, stats, tree, {})
        self.assertIn("quality_score", result)
        self.assertIn("summary", result)
        self.assertIn("bugs", result)
        self.assertGreater(len(result["bugs"]), 0)
        self.assertIn("src/payments.ts", result["bugs"][0]["file"])


if __name__ == "__main__":
    unittest.main()
