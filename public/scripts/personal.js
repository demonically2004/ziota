// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
}

// Load Theme on Page Load
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}

// Save and Load Notes
function saveNote(textarea, key) {
    localStorage.setItem(key, textarea.value);
}

window.onload = function () {
    document.querySelectorAll(".image-notes").forEach(textarea => {
        const key = textarea.previousElementSibling.innerText.trim();
        textarea.value = localStorage.getItem(key) || "";
    });

    document.getElementById("generalNotes").value = localStorage.getItem("GeneralNotes") || "";
    loadSavedFiles();
};

// Auto-Save Notes
setInterval(() => {
    let notes = document.getElementById("generalNotes").value;
    localStorage.setItem("GeneralNotes", notes);
}, 5000);

document.getElementById("generalNotes").addEventListener("input", function () {
    localStorage.setItem("GeneralNotes", this.value);
    document.getElementById("wordCount").innerText = "Words: " + this.value.trim().split(/\s+/).length;
});

// Save Notes to File
function saveToFile() {
    let text = document.getElementById("generalNotes").value;
    if (text.trim() === "") {
        alert("Cannot save an empty file!");
        return;
    }

    let filename = prompt("Enter file name (e.g., notes.txt, notes.docx):", "notes.txt");
    if (!filename) return;

    let blob = new Blob([text], { type: "application/octet-stream" });
    saveAs(blob, filename);

    localStorage.setItem(filename, text);
    loadSavedFiles();
}

// Load Saved Files
function loadSavedFiles() {
    let fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    Object.keys(localStorage).forEach(filename => {
        if (!filename.endsWith(".docx") && !filename.endsWith(".pdf") && !filename.endsWith(".txt")) return;

        let fileDiv = document.createElement("div");
        fileDiv.classList.add("file-item");

        let icon = document.createElement("img");
        icon.src = "https://cdn-icons-png.flaticon.com/512/136/136521.png"; // Generic file icon
        fileDiv.appendChild(icon);

        let link = document.createElement("a");
        link.href = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(localStorage.getItem(filename));
        link.download = filename;
        link.innerText = filename;
        fileDiv.appendChild(link);

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = function () {
            localStorage.removeItem(filename);
            loadSavedFiles();
        };
        fileDiv.appendChild(deleteBtn);

        fileList.appendChild(fileDiv);
    });
}

// Ctrl+S Shortcut for Saving
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        let focusedElement = document.activeElement;

        if (focusedElement.id === "generalNotes") {
            let confirmSave = confirm("Do you want to save this file?");
            if (confirmSave) saveToFile();
        }
    }
});

// Image Handling (Paste, Drag and Drop)
document.getElementById("imagePreview").addEventListener("paste", function (event) {
    let items = event.clipboardData.items;
    for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
            let blob = item.getAsFile();
            let reader = new FileReader();
            reader.onload = function (e) {
                let div = document.createElement("div");
                div.classList.add("image-controls");

                let img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("uploaded-image");

                // Delete Button
                let deleteBtn = document.createElement("button");
                deleteBtn.innerText = "X";
                deleteBtn.classList.add("delete-image-btn");
                deleteBtn.onclick = function () { div.remove(); };

                div.appendChild(img);
                div.appendChild(deleteBtn);
                document.getElementById("imagePreview").appendChild(div);
            };
            reader.readAsDataURL(blob);
        }
    }
});

// Delete All Images
function deleteAllImages() {
    if (confirm("Are you sure you want to delete all images?")) {
        document.getElementById("imagePreview").innerHTML = '<p style="color: rgba(255,255,255,0.6);">Paste your images here...</p>';
    }
}

// Load Stored Images on Page Load
function loadStoredImages() {
    let storedImages = JSON.parse(localStorage.getItem("storedImages")) || [];
    let imagePreview = document.getElementById("imagePreview");
    storedImages.forEach(imgSrc => {
        let img = document.createElement("img");
        img.src = imgSrc;
        img.classList.add("uploaded-image");
        img.setAttribute("ondblclick", "toggleImageSize(this)");
        imagePreview.appendChild(img);
    });
}
loadStoredImages();

// Toggle Image Size on Double Click
function toggleImageSize(img) {
    img.classList.toggle("enlarged");
}

// Drag-and-Drop Image Upload
function handleDrop(event) {
    event.preventDefault();
    let files = event.dataTransfer.files;
    for (let file of files) {
        if (file.type.startsWith("image/")) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let div = document.createElement("div");
                div.classList.add("image-controls");

                let img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("uploaded-image");
                img.onclick = function () { viewFullscreen(img.src); };

                let deleteBtn = document.createElement("button");
                deleteBtn.innerText = "X";
                deleteBtn.classList.add("delete-image-btn");
                deleteBtn.onclick = function () { div.remove(); };

                div.appendChild(img);
                div.appendChild(deleteBtn);
                document.getElementById("imagePreview").appendChild(div);
            };
            reader.readAsDataURL(file);
        }
    }
}

function allowDrop(event) {
    event.preventDefault();
}

// Fullscreen Image Viewer
function viewFullscreen(src) {
    document.getElementById("fullscreenImg").src = src;
    document.getElementById("fullscreenViewer").style.display = "flex";
}
function closeFullscreen() {
    document.getElementById("fullscreenViewer").style.display = "none";
}
// File Search
function searchFiles() {
    let query = document.getElementById("searchBar").value.toLowerCase();
    let files = document.querySelectorAll(".file-item");
    files.forEach(file => {
        let filename = file.querySelector("a").innerText.toLowerCase();
        file.style.display = filename.includes(query) ? "flex" : "none";
    });
}
