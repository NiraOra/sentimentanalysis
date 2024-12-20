# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request, jsonify
from transformers import pipeline
from groq import Groq
import os
from dotenv import load_dotenv
import json

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
                "content": f"""Return a sentiment analysis score of this text: {text}. 
                            Return the summary in JSON format, with parameters of message and score ONLY.
                            The message should be something small (no more than 10 words) about the tone of the message.""",
            }
        ],
        model="llama3-8b-8192",
        stream=False,
    )
    
    try:
        # Get the response content
        response_content = chat_completion.choices[0].message.content
        
        # Extract JSON string between backticks if present
        if '```' in response_content:
            json_str = response_content.split('```')[1]
            # Remove any "json" or other language identifier
            if '{' in json_str:
                json_str = json_str[json_str.find('{'):json_str.rfind('}')+1]
        else:
            # If no backticks, try to find JSON between curly braces
            start = response_content.find('{')
            end = response_content.rfind('}') + 1
            json_str = response_content[start:end]
        
        # Parse the extracted JSON string
        sentiment_data = json.loads(json_str)
        
        # Ensure score is a number
        if isinstance(sentiment_data.get('score'), str):
            sentiment_data['score'] = float(sentiment_data['score'])
        
        # Return the parsed JSON directly
        return jsonify(sentiment_data)
    except (json.JSONDecodeError, IndexError) as e:
        # If parsing fails, return an error message
        print(f"Error parsing response: {e}")
        print(f"Original response: {response_content}")
        return jsonify({
            "message": "Could not parse sentiment",
            "score": 0
        })

@app.route('/new_email', methods=['POST'])
def nice_email():
    data = request.get_json()
    email = data.get('email', '')
    tone = data.get('tone', '')
    
    # Validate tone
    # valid_tones = ['Work Professional', 'Casual and Friendly', 'Apologetic']
    # if tone not in valid_tones:
    #     return jsonify({
    #         "error": "Invalid tone. Must be one of: Work Professional, Casual and Friendly, Apologetic"
    #     }), 400
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""Rewrite this email in a {tone} tone: {email}
                            Make sure the email is well-structured and clear, resonating more with the tone that is mentioned.
                            Return the response in JSON format with a single parameter 'email' containing the rewritten text.
                            Do not include any other explanation or text outside the JSON."""
            }
        ],
        model="llama3-8b-8192",
        stream=False,
    )
    
    try:
        response_content = chat_completion.choices[0].message.content
        
        # Extract JSON string between backticks if present
        if '```' in response_content:
            json_str = response_content.split('```')[1]
            if '{' in json_str:
                json_str = json_str[json_str.find('{'):json_str.rfind('}')+1]
        else:
            # If no backticks, try to find JSON between curly braces
            start = response_content.find('{')
            end = response_content.rfind('}') + 1
            json_str = response_content[start:end]
        
        # Parse the extracted JSON string
        email_data = json.loads(json_str)
        
        return jsonify(email_data)
    except (json.JSONDecodeError, IndexError) as e:
        print(f"Error parsing response: {e}")
        print(f"Original response: {response_content}")
        return jsonify({
            "error": "Could not generate email",
            "email": ""
        }), 500

# Running app
if __name__ == '__main__':
    app.run(debug=True)