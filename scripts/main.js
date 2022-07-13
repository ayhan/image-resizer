const app = {
    selector: {
        dropArea: document.getElementById("dropSection"),
        actionContainer: document.getElementById("actionContainer"),
        uploadedImages: document.getElementById("uploadedImage"),
        widthValue: document.getElementById("widthValue"),
        heightValue: document.getElementById("heightValue")
    },
    actions: {
        highlightAdd: function () {
            app.selector.dropArea.classList.add('highlight')
        },
        highlightRemove: function () {
            app.selector.dropArea.classList.remove('highlight')
        },
        handleFiles: function (files) {
            files = [...files]
            files.forEach(app.actions.previewFile)
        },
        handleDrop: function (e) {
            var dt = e.dataTransfer
            var files = dt.files

            app.actions.handleFiles(files)
        },
        previewFile: function (file) {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = function () {
                let elems = `<div class="image-content"><div class="image-wrapper"><img alt="${file.name}" src="${reader.result}"><span onclick="app.actions.imageDelete(this)">X</span></div></div>`;
                app.selector.uploadedImages.insertAdjacentHTML("beforeend", elems);
                app.selector.actionContainer.classList.remove('d-none')
            }
        },
        imageDelete: function (scope) {
            scope.parentNode.parentNode.remove();
            app.selector.uploadedImages.innerHTML == '' && app.selector.actionContainer.classList.add('d-none');
        },
        clearAll: function() {
            app.selector.uploadedImages.innerHTML = '';
            app.selector.actionContainer.classList.add('d-none')
        },
        preventDefaults: function (e) {
            e.preventDefault()
            e.stopPropagation()
        },
        resizeImages: function (base64Str, maxWidth = 500, maxHeight = 500) {
            return new Promise((resolve) => {
                let img = new Image()
                img.src = base64Str
                img.onload = () => {
                    let canvas = document.createElement('canvas')
                    const MAX_WIDTH = maxWidth
                    const MAX_HEIGHT = maxHeight
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }
                    canvas.width = width
                    canvas.height = height
                    let ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)
                    resolve(canvas.toDataURL())
                }
            })
        },
        execute: function () {
            var images = Array.from(app.selector.uploadedImages.querySelectorAll('img'));
            var width = app.selector.widthValue.value || 400;
            var height = app.selector.heightValue.value || 400;

            images.forEach(item => {
                app.actions.resizeImages(item.getAttribute('src'), width, height).then((result) => {
                    let downloadBtn = `<a class="download-button" href="${result}" download="${item.getAttribute('alt')}">Download</a>`;
                    item.parentNode.insertAdjacentHTML("afterend", downloadBtn);
                });
            })
        }
    },
    init: function () {
        app.selector.dropArea.addEventListener('drop', app.actions.handleDrop, false);

        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            app.selector.dropArea.addEventListener(eventName, app.actions.preventDefaults, false)
            document.body.addEventListener(eventName, app.actions.preventDefaults, false)
        })

            ;['dragenter', 'dragover'].forEach(eventName => {
                app.selector.dropArea.addEventListener(eventName, app.actions.highlightAdd, false)
            })

            ;['dragleave', 'drop'].forEach(eventName => {
                app.selector.dropArea.addEventListener(eventName, app.actions.highlightRemove, false)
            })
    }
}

app.init();