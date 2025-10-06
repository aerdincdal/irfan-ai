
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.environ.get('HF_API_BASE', 'https://router.huggingface.co/v1'),
    api_key=os.environ['HF_TOKEN']
)

resp = client.chat.completions.create(
    model=os.environ.get('MODEL', 'openai/gpt-oss-120b:novita'),
    messages=[{"role":"system","content":"You are a helpful assistant."},{"role":"user","content":"What is the capital of France?"}],
)
print(resp.choices[0].message.content)
