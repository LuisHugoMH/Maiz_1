async function loadModel() {
    try {
        const model = await tf.loadLayersModel('model/model.json');
        return model;
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
}

document.getElementById('imageInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async function () {
        const img = new Image();
        img.src = reader.result;
        img.onload = async function () {
            const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([256, 256]).toFloat().expandDims();
            const model = await loadModel();
            if (model) {
                const predictions = model.predict(tensor).dataSync();
                const predictedClass = tf.argMax(predictions).dataSync()[0];
                const classes = ['Enfermo', 'Sano']; // Ajusta esto según tus clases
                document.getElementById('prediction').innerText = `Maíz ${classes[predictedClass]}`;
            } else {
                document.getElementById('prediction').innerText = 'Error al cargar el modelo';
            }
        };
        document.getElementById('selectedImage').src = reader.result;
    };

    reader.readAsDataURL(file);
});
