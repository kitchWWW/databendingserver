from pathlib import Path
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

def turnToAcceptableFileName(fn):
    extension = fn.split(".")[-1]
    return "tmp_"+(str(round(time.time()*100000,0)).split(".")[0])+extension


def keep_recent_files(folder_name, limit=10):
    print("deleting!!",folder_name,limit)
    # Convert to Path object for easier manipulation
    folder_path = Path(folder_name)
    # Check if the folder exists
    if not folder_path.is_dir():
        print(f"The folder '{folder_name}' does not exist.")
        return
    # List all files in the folder with their creation time
    files_with_time = [(file, file.stat().st_ctime) for file in folder_path.iterdir() if file.is_file()]
    # Sort files by creation time, newer files first
    files_sorted_by_time = sorted(files_with_time, key=lambda x: x[1], reverse=True)
    # Keep only the most recent 'limit' files
    files_to_keep = files_sorted_by_time[:limit]
    # List of files to delete (those not in the top 'limit')
    files_to_delete = files_sorted_by_time[limit:]
    # Delete the older files
    for file, _ in files_to_delete:
        try:
            os.remove(file)
            print(f"Deleted {file}")
        except Exception as e:
            print(f"Error deleting {file}: {e}")

def deleteOldStuff():
   keep_recent_files("./uploadedAudios")
   keep_recent_files("./uploadedImages")
   keep_recent_files("./gen", limit=100)



def allowed_file(filename, options):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in options


@app.route('/gen/<path:path>')
def send_report(path):
    return send_from_directory('gen', path)


@app.route('/uploadIMG', methods=['POST'])
def upload_img():
    print("upload_img")
    if 'file1' not in request.files:
        return 'there is no file1 in form!'
    file1 = request.files['file1']
    if not allowed_file(file1.filename,["png","jpg","jpeg"]):
        return "wrong file type. must be png or jpg for images"
    path = os.path.join(UPLOAD_IMG_FOLDER, turnToAcceptableFileName(file1.filename))
    file1.save(path)
    fileID = (str(round(time.time()*100000,0)).split(".")[0])
    filePrefix = "gen/"+ fileID
    bend.doAndSay("convert "+path+"  -resize 1024x1024\!  "+filePrefix+".png")
    print("staring real conversion!")
    bend.imgToAud(filePrefix+".png",filePrefix+".wav")
    print("cleanup")
    deleteOldStuff()
    return fileID


@app.route('/createVideo/<uuid>', methods=['POST'])
def create_video(uuid):
    print("create_video")
    print(uuid)
    bend.doAndSay("convert gen/"+uuid+".png  -resize 512x512\!  gen/"+uuid+"_small.png")
    bend.doAndSay("ffmpeg -loop 1 -i gen/"+uuid+"_small.png -i gen/"+uuid+".wav -shortest gen/"+uuid+"_no_marker.mp4")
    bend.doAndSay("ffmpeg -i gen/"+uuid+"_no_marker.mp4 -i outMarkerSmall.mp4 -filter_complex \"[1]split[m][a];[a]geq='if(gt(lum(X,Y),16),255,0)',hue=s=0[al];[m][al]alphamerge[ovr];[0][ovr]overlay\" gen/"+uuid+".mp4")
    deleteOldStuff()
    return uuid



@app.route('/uploadAUD', methods=['POST'])
def upload_aud():
    print("upload_aud")
    if 'file1' not in request.files:
        return 'there is no file1 in form!'
    file1 = request.files['file1']
    if not allowed_file(file1.filename,["wav","mp3"]):
        return "wrong file type. must be mp3 or wav for audio"
    path = os.path.join(UPLOAD_AUD_FOLDER, turnToAcceptableFileName(file1.filename))
    file1.save(path)
    fileID = (str(round(time.time()*100000,0)).split(".")[0])
    filePrefix = "gen/"+ fileID
    bend.doAndSay("sox "+path+" "+filePrefix+".wav remix 1")
    print("staring real conversion!")
    bend.audToImage(filePrefix+".wav",filePrefix+".png")
    print("cleanup")
    deleteOldStuff()
    return fileID

if __name__ == '__main__':
    app.run(host="localhost", port=3007, debug=True)
