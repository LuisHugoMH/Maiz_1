async function loadModel() {
    try {
        const model = await tf.loadLayersModel('model/model.json');
        console.log("Modelo cargado correctamente");
        return model;
    } catch (error) {
        console.error("Error al cargar el modelo", error);
    }
}

async function predict(model, image) {
    try {
        // Preprocesar la imagen
        const tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([256, 256]) // Cambiar el tamaño de la imagen a 256x256
            .toFloat()
            .expandDims();
        console.log("Tensor de imagen procesado:", tensor);

        const predictions = await model.predict(tensor).data();
        console.log("Predicciones:", predictions);
        return predictions;
    } catch (error) {
        console.error("Error al realizar la predicción", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const selectedImage = document.getElementById('selectedImage');
    const predictionText = document.getElementById('prediction');

    let model;

    loadModel().then(loadedModel => {
        model = loadedModel;
    });

    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            selectedImage.src = e.target.result;
            selectedImage.style.display = "block";
            console.log("Imagen cargada y mostrada");

            selectedImage.onload = () => {
                predict(model, selectedImage).then(predictions => {
                    predictionText.innerText = `Predicción: ${predictions}`;
                });
            };
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });
});