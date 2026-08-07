from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    github_url: str


class SnippetAnalyzeRequest(BaseModel):
    code: str
    filename: str = "snippet"
    language: str = ""