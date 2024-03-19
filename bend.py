import numpy as np
from PIL import Image
from scipy.io.wavfile import write
from scipy.io.wavfile import read
import os

shapeImage = (1024,1024,3)
shapeAudio = (3145728,)
singleLenSize = 1024*1024*3

def doAndSay(com):
	print(com)
	os.system(com)

def imgToAud(imgName, audName):
	img = Image.open(imgName).convert('RGB')
	# convert it to a matrix
	vector = np.asarray(img).reshape(shapeAudio)
	print(vector.dtype)
	print(vector)
	# do something to the vector
	print(vector.shape)

	newv = vector
	samplerate = 44100;

	biggestNumb = np.iinfo(np.int16).max
	newnewv = ((newv / 255.0) * (biggestNumb*2)) - biggestNumb
	write(audName, samplerate, newnewv.astype(np.int16))

def audToImage(audName, imgName):
	sr, dat = read(audName)
	print(dat)
	if(dat.size > singleLenSize):
		dat = dat[:singleLenSize]
	if(dat.size<singleLenSize):
		print(singleLenSize-dat.size)
		dat = np.pad(dat, (0, singleLenSize-dat.size), 'constant')
	print(dat.size)
	print(singleLenSize)
	# dat = (((dat / np.iinfo(np.int16).max) + 1) * (255.0 *10 /2)).round().astype(np.uint8) # np.uint8 vs np.int16 // keeps skin tone same while distoring other colors
	# dat = (((dat / np.iinfo(np.int16).max) + 1) * (255.0)).round().astype(np.int16) # classic distortion / grainy
	dat = (((dat / np.iinfo(np.int16).max) + 1) * (255.0/2)).round().astype(np.uint8) # TRUE 1:1 MAPPING
	print(dat)

	arr4 = np.asarray(dat).reshape(shapeImage)
	img2 = Image.fromarray(arr4, 'RGB')
	img2.save(imgName)

# imgToAud("t.png","test1.wav")
# audToImage("test2.wav","test0.png")

