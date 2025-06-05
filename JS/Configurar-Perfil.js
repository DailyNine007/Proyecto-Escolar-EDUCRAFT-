
/*Funcion para guardar imagen de perfil, seleccionando desde el equipo en uso*/
function previewImage() {
    const fileInput = document.getElementById('profileImage');
    const profilePic = document.getElementById('profilePic');
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    /*Leer la imagen y convertilo el archivo a una data URL(Que la imagen de muestre en la pagina de manera correcta)*/
    reader.onloadend = function() {
        profilePic.src = reader.result;
        profilePic.style.display = 'block';
    };
    
    if (file) {
        reader.readAsDataURL(file);
    } else {
        profilePic.src = "";
        profilePic.style.display = 'none';
    }
}














document.addEventListener('DOMContentLoaded', function() {
    const avatars = [
        'estilos/imagenes/Fuego_fase1.jpg',
        'estilos/imagenes/Zorro_fase1.jpg',
        'estilos/imagenes/Gato_fase1.jpg',
        'estilos/imagenes/Mono_fase1.jpg',
        'estilos/imagenes/Perro_fase1.jpg'

    ];

    const evolvedAvatars = {
        'estilos/imagenes/Fuego_fase1.jpg': [
            'estilos/imagenes/Fuego_fase2.jpg',
            'estilos/imagenes/Fuego_fase3.jpg'
        ],
        'estilos/imagenes/Zorro_fase1.jpg': [
            'estilos/imagenes/Zorro_fase2.jpg',
            'estilos/imagenes/Zorro_fase3.jpg'
        ],
        'estilos/imagenes/Gato_fase1.jpg': [
            'estilos/imagenes/Gato_fase2.jpg',
            'estilos/imagenes/Gato_fase3.jpg'
        ],
        'estilos/imagenes/Mono_fase1.jpg': [
            'estilos/imagenes/Mono_fase2.jpg',
            'estilos/imagenes/Mono_fase3.jpg'
        ],
        'estilos/imagenes/Perro_fase1.jpg': [
            'estilos/imagenes/Perro_fase2.jpg',
            'estilos/imagenes/Perro_fase3.jpg'
        ],
    };

    let currentAvatarIndex = 0;
    let evolutionStep = 0;

    const avatarImg = document.getElementById('avatar');
    const prevButton = document.getElementById('prev-avatar');
    const nextButton = document.getElementById('next-avatar');
    const selectButton = document.getElementById('select-avatar');
    const evolveButton = document.getElementById('evolve-avatar');

    function updateAvatar() {
        let avatarSrc = avatars[currentAvatarIndex];
        if (evolutionStep > 0) {
            avatarSrc = evolvedAvatars[avatars[currentAvatarIndex]][evolutionStep - 1];
        }
        avatarImg.src = avatarSrc;
        avatarImg.classList.remove('avatar-selected'); //Remover el brillo cuando cambia el avatar
    }

    prevButton.addEventListener('click', function() {
        currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
        evolutionStep = 0; //Reset evolution step
        updateAvatar();
    });

    nextButton.addEventListener('click', function() {
        currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
        evolutionStep = 0; //Reset evolution step
        updateAvatar();
    });

    selectButton.addEventListener('click', function() {
        avatarImg.classList.add('avatar-selected'); //Añadir el brillo dorado al seleccionar
    });

    evolveButton.addEventListener('click', function() {
        if (evolutionStep < 2) { //Solo si no está en la última fase
            evolutionStep++;
            updateAvatar();
        }
    });

    document.getElementById('submit-button').addEventListener('click', function() {
        submitProfile();
    });

    updateAvatar();
});

















/*Funcion para mostrar datos despues de guardar en la parte interior de la pagina*/ 
function submitProfile() {
    const parentName = document.getElementById('parentName').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gamertag = document.getElementById('gamertag').value;
    const age = document.getElementById('age').value;
    const profileImageInput = document.getElementById('profileImage');
    const avatarImage = document.getElementById('avatar').src;

    //(AJAX o formulario)
    //Crear un objeto FormData
    const formData = new FormData();
    formData.append('parentName', parentName);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('gamertag', gamertag);
    formData.append('age', age);
    formData.append('profileImage', profileImageInput.files[0]); //Archivo de imagen de perfil
    formData.append('avatar', avatarImage); 



    //Enviar datos a PHP usando fetch
    fetch('guardar_perfil.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); //Manejar la respuesta
    })
    .catch(error => console.error('Error:', error));

    

    /*Mostrar datos despues de guardar la informacion*/
    const profileOutput = document.getElementById('profileOutput');
    const profilePic = document.getElementById('profilePic').src; //Esto debería ser una URL válida después de guardar la imagen
    profileOutput.innerHTML = `
        <h2>Perfil del Jugador</h2>
        <img src="${profilePic}" alt="Imagen de Perfil" style="width:100px; height:100px; border-radius:50%; display:${profilePic ? 'block' : 'none'};">
        <p><strong>Nombre de Padre/Tutor:</strong> ${parentName}</p>
        <p><strong>Nombre:</strong> ${firstName}</p>
        <p><strong>Apellido:</strong> ${lastName}</p>
        <p><strong>Gamertag:</strong> ${gamertag}</p>
        <p><strong>Edad:</strong> ${age}</p>
        <h3>Avatar Seleccionado:</h3>
        <img src="${avatarImage}" alt="Avatar Seleccionado" style="width:100px; height:100px; border-radius:50%; border: 2px solid gold;">
    `;

    /*Forma de mostrar la informacion (block)*/
    profileOutput.style.display = 'block';
    
    //Desplazar hacia arriba al guardar datos
    window.scrollTo({ top: 0, behavior: 'smooth' });
}