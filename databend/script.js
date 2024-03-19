document.getElementById("file1").onchange = function() {
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
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://databend.brianellissound.com/uploadAUD"); 
    xhr.onload = function(event){ 
        // alert("Success, server responded with: " + event.target.response); // raw response
        window.location.href = location.protocol + '//' + location.host + location.pathname +"?gid="+event.target.response;
    };
    var formData = new FormData(document.getElementById("form2")); 
    xhr.send(formData);
};