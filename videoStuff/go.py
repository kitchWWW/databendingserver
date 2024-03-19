# Imports PIL module
from PIL import Image, ImageDraw 
import PIL
 
# creating a image object (new image object) with
# RGB mode and size 200x200
totalNumbFrames = 71*30

for i in range(totalNumbFrames):
	im = PIL.Image.new(mode="RGB", size=(1024, 1024))
	shape = [(0, (i / totalNumbFrames) * 1024), (1024,(i / totalNumbFrames) * 1024)]  
	# create line image 
	img1 = ImageDraw.Draw(im)   
	img1.line(shape, fill ="white", width = 3) 
	# This method will show image in any image viewer
	im.save("out/"+(str(i).rjust(6, '0'))+".png")


"""

ffmpeg -framerate 30 -pattern_type glob -i 'out/*.png'  -c:v libx264 -pix_fmt yuv420p outMarker.mp4

ffmpeg -loop 1 -i 171082639899216.png -i 171082639899216.wav -shortest outContent.mp4

ffmpeg -i outContent.mp4 -i outMarker.mp4 -filter_complex "[1]split[m][a];[a]geq='if(gt(lum(X,Y),16),255,0)',hue=s=0[al];[m][al]alphamerge[ovr];[0][ovr]overlay" output.mp4

"""