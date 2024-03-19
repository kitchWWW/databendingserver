import time
import os
from flask import Flask, request
import bend
from flask import send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_IMG_FOLDER = './uploadedImages'
UPLOAD_AUD_FOLDER = './uploadedAudios'

app.config['UPLOAD_FOLDER'] = UPLOAD_IMG_FOLDER

def allowed_file(filename, options):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in options



@app.route('/gen/<path:path>')
def send_report(path):
    return send_from_directory('gen', path)


@app.route('/uploadIMG', methods=['POST'])
def upload_img():
    if 'file1' not in request.files:
        return 'there is no file1 in form!'
    file1 = request.files['file1']
    if (!allowed_file(file1.filename,["png","jpg"])):
        return "wrong file type"

    path = os.path.join(UPLOAD_IMG_FOLDER, file1.filename)
    
    file1.save(path)

    filePrefix = "gen/"+ (str(round(time.time()*100000,0)).split(".")[0])
    bend.doAndSay("convert "+path+"  -resize 1024x1024\!  "+filePrefix+".png")
    bend.imgToAud(filePrefix+".png",filePrefix+".wav")

    return filePrefix


@app.route('/uploadAUD', methods=['POST'])
def upload_aud():
    if 'file1' not in request.files:
        return 'there is no file1 in form!'
    file1 = request.files['file1']
    if not allowed_file(file1.filename,["wav","mp3"]):
        return "wrong file type"
    path = os.path.join(UPLOAD_AUD_FOLDER, file1.filename)
    file1.save(path)

    filePrefix = "gen/"+ (str(round(time.time()*100000,0)).split(".")[0])
    bend.doAndSay("sox "+path+" "+filePrefix+".wav remix 1")
    bend.audToImage(filePrefix+".wav",filePrefix+".png")

    return filePrefix



if __name__ == '__main__':
    app.run(host="localhost", port=3007, debug=True)
