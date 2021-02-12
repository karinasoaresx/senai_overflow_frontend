export const validSquaredImage = (image) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        //vai tentar abrir a imagem
        reader.readAsDataURL(image);

        reader.onload = (e) => {
            const image = new Image();

            image.src = e.target.result;

            image.onload = () => {
                const width =  image.width;
                const height =  image.height;

                //validar se a imagem é quadrada ou não
                if(width / height > 1.1 || height / width > 1.1) {
                    reject("a imagem não é quadrada");
                    return;
                }
                    resolve();
            };
        };
    });
};