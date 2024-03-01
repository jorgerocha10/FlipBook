from flask import Flask, request, render_template, redirect, url_for, request, jsonify
from azure.storage.blob import BlobServiceClient, BlobClient
from dotenv import load_dotenv
import os


app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Now access your variables
STORAGE_ACCOUNT_URL = os.getenv('AZURE_STORAGE_URL')
STORAGE_ACCOUNT_KEY = os.environ.get('AZURE_STORAGE_KEY')
if STORAGE_ACCOUNT_KEY and not STORAGE_ACCOUNT_KEY.endswith('=='):
    STORAGE_ACCOUNT_KEY += '=='
CONTAINER_NAME = os.environ.get('CONTAINER_NAME')

# Initialize the BlobServiceClient
blob_service_client = BlobServiceClient(account_url=STORAGE_ACCOUNT_URL, credential=STORAGE_ACCOUNT_KEY)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=file.filename)
        blob_client.upload_blob(file.read(), overwrite=True)
        return jsonify({'message': 'File uploaded successfully!'}), 200


if __name__ == '__main__':
    app.run(debug=True)
