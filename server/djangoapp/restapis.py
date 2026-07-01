import os

import requests
from dotenv import load_dotenv
from urllib.parse import quote

load_dotenv()

backend_url = os.getenv("backend_url", default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    "sentiment_analyzer_url",
    default="http://localhost:5050/",
)


def get_request(endpoint, **kwargs):
    request_url = f"{backend_url}{endpoint}"

    print(f"GET from {request_url}")

    try:
        response = requests.get(request_url, params=kwargs, timeout=10)
        return response.json()
    except requests.RequestException:
        print("Network exception occurred")
        return None


def analyze_review_sentiments(text):
    request_url = (
        f"{sentiment_analyzer_url.rstrip('/')}/analyze/{quote(text)}"
    )

    try:
        response = requests.get(request_url, timeout=10)
        return response.json()
    except requests.RequestException as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return None


def post_review(data_dict):
    request_url = f"{backend_url}/insert_review"

    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        print(response.json())
        return response.json()
    except requests.RequestException:
        print("Network exception occurred")
        return None
