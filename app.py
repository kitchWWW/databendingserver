import time
import os
from flask import Flask, request

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_IMG_FOLDER = './uploadedImages'

app.config['UPLOAD_FOLDER'] = UPLOAD_IMG_FOLDER

@app.route('/uploadIMG', methods=['POST'])
def upload_file():
    if 'file1' not in request.files:
        return 'there is no file1 in form!'
    file1 = request.files['file1']
    newFileName = time.time()+".png"
    path = os.path.join(UPLOAD_IMG_FOLDER, file1.filename)
    file1.save(path)
    return path

if __name__ == '__main__':
    app.run(host="localhost", port=3007, debug=True)
