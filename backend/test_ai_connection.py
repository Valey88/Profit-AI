import urllib.request
import json
import uuid

url = "http://localhost:8001/ai/process"
data = {
    "text": "Привет! Какая ты модель?",
    "conversation_id": str(uuid.uuid4()),
    "context": {}
}

headers = {'Content-Type': 'application/json'}
req = urllib.request.Request(url, data=json.dumps(data).encode(), headers=headers)

print(f"Sending request to {url}...")
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode())
        print("\n✅ Verification Successful!")
        print("-" * 30)
        print("Response Text:", result.get("text"))
        print("Intent:", result.get("intent"))
        print("-" * 30)
        print("Full Response:", json.dumps(result, indent=2, ensure_ascii=False))
except Exception as e:
    print(f"\n❌ Verification Failed: {e}")
