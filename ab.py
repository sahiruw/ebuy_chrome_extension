import requests
import json

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer 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",
  },
  data=json.dumps({
    "model": "deepseek/deepseek-r1:free", # Optional
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
    
  })
)

print(response.json())