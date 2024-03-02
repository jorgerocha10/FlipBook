document.addEventListener("DOMContentLoaded", function() {
    let droppedFiles = []; // To store the files that are dragged or selected
    const dropArea = document.getElementById('drop-area');
    const input = dropArea.querySelector('input[type=file]');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInfo = document.getElementById('fileInfo');
    const loadingSpinner = document.getElementById('loadingSpinner'); // Get the loading spinner element
    const validVideoFormats = ['mp4', 'mov', 'wmv', 'avi']; // List of accepted video formats
    const maxSizeInMB = 50; // Maximum file size in MB
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024; // Convert MB to Bytes

    dropArea.addEventListener('click', function() {
        input.click();
    });

    input.addEventListener('change', function() {
        droppedFiles = this.files;
        if (validateFiles(droppedFiles) && validateFileSize(droppedFiles)) {
            displayFileNames(droppedFiles); // Display the file names on the UI
        } else {
            clearSelection();
        }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', function(e) {
        let dt = e.dataTransfer;
        droppedFiles = dt.files;
        if (validateFiles(droppedFiles) && validateFileSize(droppedFiles)) {
            displayFileNames(droppedFiles); // Display the file names on the UI
        } else {
            clearSelection();
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function validateFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const fileExtension = files[i].name.split('.').pop().toLowerCase();
            if (!validVideoFormats.includes(fileExtension)) {
                alert(`Invalid file format: ${files[i].name}. Please upload a video file.`);
                return false;
            }
        }
        return true;
    }

    function validateFileSize(files) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSizeInBytes) {
                alert(`File size exceeds limit: ${files[i].name}. Please upload a file smaller than ${maxSizeInMB}MB.`);
                return false;
            }
        }
        return true;
    }

    function clearSelection() {
        input.value = '';
        droppedFiles = [];
        fileInfo.innerHTML = '';
    }

    function displayFileNames(files) {
        fileInfo.innerHTML = ''; // Clear previous file names
        if(files.length > 1) {
            fileInfo.innerHTML = `Selected files: <br>`;
            Array.from(files).forEach(file => {
                fileInfo.innerHTML += `${file.name}<br>`;
            });
        } else if (files.length == 1) {
            fileInfo.textContent = `Selected file: ${files[0].name}`;
        }
    }

    uploadBtn.addEventListener('click', function() {
        if (droppedFiles.length > 0 && validateFiles(droppedFiles) && validateFileSize(droppedFiles)) {
            loadingSpinner.style.display = 'block'; // Show the spinner
            const uploadPromises = Array.from(droppedFiles).map(file => uploadFile(file));
            Promise.all(uploadPromises).finally(() => {
                loadingSpinner.style.display = 'none'; // Hide the spinner once all uploads are done
            });
        } else {
            alert("Please select a valid video file to upload.");
        }
    });

    function uploadFile(file) {
        let formData = new FormData();
        formData.append('file', file);

        return fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            alert("File uploaded successfully!");
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error uploading file.");
        });
    }
});
