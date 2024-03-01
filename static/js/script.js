document.addEventListener("DOMContentLoaded", function() {
    let droppedFiles = []; // To store the files that are dragged or selected
    const dropArea = document.getElementById('drop-area');
    const input = dropArea.querySelector('input[type=file]');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInfo = document.getElementById('fileInfo'); // Get the file info display element

    // Clicking the drop area also opens the file explorer
    dropArea.addEventListener('click', function() {
        input.click();
    });

    // Handle files once they are selected via the file explorer
    input.addEventListener('change', function() {
        droppedFiles = this.files;
        displayFileNames(droppedFiles); // Display the file names on the UI
    });

    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight the drop area during a dragover
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    // Unhighlight the drop area once dragging is complete
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle files dropped into the area
    dropArea.addEventListener('drop', function(e) {
        let dt = e.dataTransfer;
        droppedFiles = dt.files;
        displayFileNames(droppedFiles); // Display the file names on the UI
    });

    // Prevent default behavior (Prevent file from being opened)
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

    // Upload files when the upload button is clicked
    uploadBtn.addEventListener('click', function() {
        if (droppedFiles.length > 0) {
            Array.from(droppedFiles).forEach(uploadFile);
        } else {
            alert("Please select a file to upload.");
        }
    });

    // Function to display file names in the UI
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

// Function to upload files
function uploadFile(file) {
    let formData = new FormData();
    formData.append('file', file); // Append the file to the formData object

    // Use fetch API to send the file to the server
    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // Log the server response
        alert("File uploaded successfully!");

        // Redirect to the desired URL after successful upload
        window.location.href = '/'; // Change '/upload' to your desired URL
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error uploading file.");
    });
}

});
