# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from transformers import pipeline
from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

model_path = "cardiffnlp/twitter-roberta-base-sentiment-latest"
# sentiment_task = pipeline("sentiment-analysis", model=model_path, tokenizer=model_path, framework="pt")
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)

# Initializing flask app
app = Flask(__name__)

@app.route('/anal', methods=['POST'])
def get_sentiment():
    data = request.get_json()
    text = data.get('text', '')
    
    chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": f"return a sentiment analysis score of this text: {text}",
        }
    ],
        model="llama3-8b-8192",
        stream=False,
    )
    # mood = sentiment_task(text)
    return jsonify({"Sentiment": chat_completion.choices[0].message.content})
    # elif mood[0]['label'] == "negative":
    #     return jsonify({"Sentiment": "You seem like you are in a bad mood today!"})

# Running app
if __name__ == '__main__':
    app.run(debug=True)