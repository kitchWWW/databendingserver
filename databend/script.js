
function drawWavform(url){
    const canvas = document.getElementById('waveform');
    const context = canvas.getContext('2d');
    fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => drawWaveform(audioBuffer))
    .catch(e => console.error(e));

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function drawWaveform(audioBuffer) {
        const channelData = audioBuffer.getChannelData(0); // Get the first channel
        const width = canvas.width;
        const height = canvas.height;
        const step = Math.ceil(channelData.length / width);
        // const center = height / 2
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
    }
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


const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
let value = params.gid; // "some_value"
console.log(value)
if(params.gid != null){
    document.getElementById("resimg").src = "https://databend.brianellissound.com/gen/"+params.gid+".png"
    document.getElementById("resaud").src = "https://databend.brianellissound.com/gen/"+params.gid+".wav"
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
};