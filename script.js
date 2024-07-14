let model;

async function loadModel() {
    try {
        //Ruta al modelo
        model = await tf.loadLayersModel("D:\LuisHugo\LIA\Web\model\model.json");
        console.log('Modelo cargado correctamente');
    } catch (error) {
        console.error('Error al cargar el modelo:', error);
    }
}

//Procesar imagen y hacer predicción
async function predictImage(image) {
    
    const img = tf.browser.fromPixels(image)   //Redimensionar y normalizar imagen
        .resizeNearestNeighbor([256, 256])
        .toFloat()
        .expandDims(0);
    
    //Hacer predicción
    const prediction = await model.predict(img).data();
    return prediction;
}

//Cargar imagen
document.getElementById('imageInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const imageElement = document.getElementById('selectedImage');
    const reader = new FileReader();

    reader.onload = async function(e) {
        imageElement.src = e.target.result;
        imageElement.onload = async function() {
            const prediction = await predictImage(imageElement);
            document.getElementById('prediction').innerText = `Predicción: ${prediction}`;
        }
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

//Cargar el modelo al cargar la página
window.addEventListener('load', loadModel);
