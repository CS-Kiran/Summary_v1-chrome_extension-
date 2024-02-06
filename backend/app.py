from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from googletrans import Translator


app = Flask(__name__)
CORS(app)

@app.route('/summary', methods=['POST', 'OPTIONS'])
def summary():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    text = request.json.get('text')  # Receive the text content from the frontend
    tokenizer = AutoTokenizer.from_pretrained("t5-base")
    model = AutoModelForSeq2SeqLM.from_pretrained("t5-base")

    tokens_input = tokenizer.encode("summarizer: "+ text, return_tensors='pt', max_length=512, truncation=True)
    summary_ids = model.generate(tokens_input, min_length=80, max_length=200)
    summary = tokenizer.decode(summary_ids[0], skip_special_token=True)
    return jsonify(summary=summary) 


@app.route('/translate', methods=['POST'])
def translate():
    text = request.json.get('text')
    target_language = request.json.get('target_language', 'en')  # Default to English if no target language is provided
    translator = Translator()
    translated_text = translator.translate(text, dest=target_language).text
    return jsonify(translatedText=translated_text)


if __name__ == "__main__":
    app.run(debug=True)
