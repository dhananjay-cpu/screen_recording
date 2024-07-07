document.addEventListener('DOMContentLoaded', async () => 
{
    const startBtn = document.querySelector('#start_btn');
    const stopBtn = document.querySelector('#stop_btn');
    const saveBtn = document.querySelector('#save_btn');
    let stream, recorder, chunks = [];

    startBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("Start Recording");
        stream = await startCapture();
        recorder = startRecording(stream, chunks);
    });

    stopBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("Stop Recording");
        stopCapture(stream);
        stopRecording(recorder);
        console.log({chunks});
    });

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("Save Recording");
        const recording = await saveRecording(chunks);
        console.log(recording);
    });
});
async function startCapture() {
    let stream;
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({audio: false});
    } catch(e) {
        console.error(e)
    }
    return stream;
}

function stopCapture(stream) {
    stream.getTracks().forEach(track => track.stop());
    
}


function startRecording(stream, chunks) {
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        chunks.push(e.data);
    }
    recorder.start();
    return recorder;
}

function stopRecording(recorder) {
    recorder.stop()
}

async function saveRecording(chunks) {
    const file = new File(chunks, {
        type: 'video/webm',
        filename: 'recording.webm',
    });
    const formData = new FormData();
    formData.append('recording[file]', file);
    const token = document.getElementsByName("csrf-token")[0].content;
    return await fetch('recordings', {
        method: 'POST',
        headers: {
            'X-CSRF-Token': token,
        }, 
        body: formData,
    }).then(r => r.json)
 }