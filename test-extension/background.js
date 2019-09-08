chrome.runtime.onMessage.addListener(request => {
    switch (request) {
        case 'START_RECORDING':
            console.log('START_RECORDING');
            startRecording();
            break;
        case 'STOP_RECORDING':
            console.log('STOP_RECORDING');
            break;
        default:
            console.log('UNKNOWN_REQUEST');
    }
});

function startRecording() {
    console.log('Starting to record.');

    const options = { video : true, audio: false, };
    chrome.tabCapture.capture(options, (stream) => {
        if (stream === null) {
            console.log(`Last Error: ${chrome.runtime.lastError.message}`);
            return;
        }

        let recorder;
        try {
            var options = {mimeType: 'video/webm; codecs=vp9'};
            recorder = new MediaRecorder(stream, options);
        } catch (err) {
            console.log(err.message);
            return;
        }

        console.log('Recroder is in place.');
        var chunks = [];

        recorder.onstop = function(e) {
            // const { data: blob, timecode } = event;
            // const url = 'https://localhost:64099/api/Design/VideoStream';
            // var xhttp = new XMLHttpRequest();
            // xhttp.onreadystatechange = function() {
            //     if (this.readyState == 4 && this.status == 200) {
            //         alert(this.responseText);
            //     }
            // };
            // xhttp.open("POST", url, true);
            // // xhttp.setRequestHeader("Content-type", "application/json");
            // xhttp.send(formData);
            
            // console.log(`Got another blob: ${timecode}: ${chunks}`);
        }

        recorder.addEventListener('dataavailable', event => {
            console.log('event.data ', event.data)
            chunks.push(event.data);
            var formData = new FormData();
            formData.append('webm', event.data, 'video.webm');
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                }
            };
            const url = 'https://localhost:64099/api/Design/VideoStream';
            xhttp.open("POST", url, true);
            // xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(formData);
        });
        const timeslice = 5000;
        recorder.start(timeslice);

        setTimeout(() => {
            recorder.stop();
        }, 15000);
    });
}