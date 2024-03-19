
function dissableAllServerCallButtons(){
    document.getElementById('videobtn').disabled=true
    var fields = document.getElementById("form1").getElementsByTagName('*');
    for(var i = 0; i < fields.length; i++)
    {
        fields[i].disabled = true;
    }
    var fields = document.getElementById("form2").getElementsByTagName('*');
    for(var i = 0; i < fields.length; i++)
    {
        fields[i].disabled = true;
    }
}

function drawWav(audioBuffer, play) {
    const canvas = document.getElementById('waveform');
    const context = canvas.getContext('2d');

    const channelData = audioBuffer.getChannelData(0); // Get the first channel
    const width = canvas.width;
    const height = canvas.height;
    const step = Math.ceil(channelData.length / width);
    const center = height / 2
    const amp = height / 4;

    context.lineWidth = 2;
    context.strokeStyle = '#2980b9';
    context.beginPath();

    for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
            const datum = channelData[(i * step) + j]; 
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.moveTo(i, (2 + min) * amp);
        context.lineTo(i, (2 + max) * amp);
    }
    context.stroke();
    context.fillStyle = '#ecf0f1';
    if(play){
        context.moveTo(center+40, center);
        context.lineTo(center-24, center-40);
        context.lineTo(center-24, center+40);
        context.fill();
    }else{
        context.fillRect(center-24, center-40, 20, 80);
        context.fillRect(center+4, center-40, 20, 80);

    }
}

var audioBuffer = null

isPlaying = false
var can = document.getElementById('waveform');
can.addEventListener('click', function() {
    if(isPlaying){
        isPlaying = false
        drawWav(audioBuffer, true)
        audio.pause();
        audio.currentTime = 0;
    }else{
        isPlaying = true
        drawWav(audioBuffer, false)
        audio.play()
    }

}, false);


function drawWavform(url){
    const canvas = document.getElementById('waveform');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const context = canvas.getContext('2d');
    fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audBuff => {
        audioBuffer = audBuff
        drawWav(audioBuffer, true)
    })
    .catch(e => console.error(e));
}




function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

var audio = null;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let value = params.gid; // "some_value"
console.log(value)
if(params.gid != null){
    document.getElementById("resimg").src = "https://databend.brianellissound.com/gen/"+params.gid+".png"
    audio = new Audio("https://databend.brianellissound.com/gen/"+params.gid+".wav")
    drawWavform("https://databend.brianellissound.com/gen/"+params.gid+".wav")
    document.getElementById("resultsArea").style.display="block"
    document.getElementById("bigTitle").classList.remove("bigTitle");
    document.getElementById("bigTitle").classList.add("bigTitleAfter");
}

function downloadImg(){
    forceDownload("https://databend.brianellissound.com/gen/"+params.gid+".png", params.gid+".png")
}

function downloadAud(){
    forceDownload("https://databend.brianellissound.com/gen/"+params.gid+".wav", params.gid+".wav")
}

function createVideo(){
    dissableAllServerCallButtons()
    document.getElementById("loaderInfo").style.display="block"    
    document.getElementById("videoLink").href = "https://databend.brianellissound.com/gen/"+params.gid+".mp4"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://databend.brianellissound.com/createVideo/"+params.gid); 
    xhr.onload = function(event){ 
        window.location.href = "https://databend.brianellissound.com/gen/"+params.gid+".mp4";
    };
    xhr.send();
}

document.getElementById("file1").onchange = function() {
    document.getElementById("loaderThing").style.display="block"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://databend.brianellissound.com/uploadIMG"); 
    xhr.onload = function(event){ 
        // alert("Success, server responded with: " + ); // raw response
        window.location.href = location.protocol + '//' + location.host + location.pathname +"?gid="+event.target.response;
    };
    var formData = new FormData(document.getElementById("form1")); 
    xhr.send(formData);
    dissableAllServerCallButtons()
};

document.getElementById("file2").onchange = function() {
    document.getElementById("loaderThing").style.display="block"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://databend.brianellissound.com/uploadAUD"); 
    xhr.onload = function(event){ 
        // alert("Success, server responded with: " + event.target.response); // raw response
        window.location.href = location.protocol + '//' + location.host + location.pathname +"?gid="+event.target.response;
    };
    var formData = new FormData(document.getElementById("form2")); 
    xhr.send(formData);
    dissableAllServerCallButtons()
};