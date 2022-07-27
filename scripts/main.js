const app = {
    selector: {
        dropArea: document.getElementById("dropSection"),
        actionContainer: document.getElementById("actionContainer"),
        uploadedImages: document.getElementById("uploadedImage"),
        widthValue: document.getElementById("widthValue"),
        heightValue: document.getElementById("heightValue")
    },
    actions: {
        highlightAdd: () => {
            app.selector.dropArea.classList.add('highlight')
        },
        highlightRemove: () => {
            app.selector.dropArea.classList.remove('highlight')
        },
        handleFiles: (files) => {
            files = [...files]
            files.forEach(app.actions.previewFile)
        },
        handleDrop: (e) => {
            let dt = e.dataTransfer
            let files = dt.files

            app.actions.handleFiles(files)
        },
        previewFile: (file) => {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = ()  => {
                let elems = `<div class="image-content"><div class="image-wrapper"><img alt="${file.name}" src="${reader.result}"><span onclick="app.actions.imageDelete(this)">X</span></div></div>`;
                app.selector.uploadedImages.insertAdjacentHTML("beforeend", elems);
                app.selector.actionContainer.classList.remove('d-none')
            }
        },
        imageDelete: (scope) => {
            scope.parentNode.parentNode.remove();
            app.selector.uploadedImages.innerHTML == '' && app.selector.actionContainer.classList.add('d-none');
        },
        clearAll: () => {
            app.selector.uploadedImages.innerHTML = '';
            app.selector.actionContainer.classList.add('d-none')
        },
        preventDefaults: (e) => {
            e.preventDefault()
            e.stopPropagation()
        },
        aspectRatio: (w, h, mw, mh) => {
            let ratio = w / h;
            if (mh * ratio < mw) {
                return [mw, mw / ratio];
            } else {
                return [mh * ratio, mh];
            }
        },
        resizeImages: (base64Str, maxWidth, maxHeight) => {
            return new Promise((resolve) => {
                const img = new Image()
                img.src = base64Str
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    let width = img.width
                    let height = img.height

                    const newSize = app.actions.aspectRatio(width, height, maxWidth, maxHeight);

                    width = newSize[0];
                    height = newSize[1];

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)
                    resolve(canvas.toDataURL())
                }
            })
        },
        execute: () => {
            const images = Array.from(app.selector.uploadedImages.querySelectorAll('img'));
            const width = app.selector.widthValue.value || 400;
            const height = app.selector.heightValue.value || 400;

            images.forEach(item => {
                app.actions.resizeImages(item.getAttribute('src'), width, height).then((result) => {
                    let downloadBtn = `<a class="download-button" href="${result}" download="${item.getAttribute('alt')}">Download</a>`;
                    item.parentNode.insertAdjacentHTML("afterend", downloadBtn);
                });
            })
        }
    },
    init: () => {
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


// function gcd(a, b) {
//     return (b == 0) ? a : gcd(b, a % b);
// }
// function ratio(x, y) {
//     c = gcd(x, y); return `${x / c}:${y / c}`
// }
