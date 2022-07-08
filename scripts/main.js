const app = {
    selector: {
        dropArea: document.getElementById("dropSection"),
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
                let img = document.createElement('img')
                img.src = reader.result
                document.getElementById('uploadedImage').appendChild(img)
            }
        },
        preventDefaults: function (e) {
            e.preventDefault()
            e.stopPropagation()
        }
    },
    init: function () {
        app.selector.dropArea.addEventListener('drop', app.actions.handleDrop, false)
    }
}

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

app.init();