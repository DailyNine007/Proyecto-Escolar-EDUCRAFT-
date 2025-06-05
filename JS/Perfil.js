//Informacion que sera tomada de la base de datos del usuario al iniciar sesion
document.addEventListener('DOMContentLoaded', function() {
    //Fetch player data from server
    fetch('get_player_data.php')
        .then(response => response.json())
        .then(playerData => {
            //Mostrar datos del jugador en la página
            document.getElementById('parentName').textContent = playerData.parentName;
            document.getElementById('EstudioDia').textContent = playerData.EstudioDia
            document.getElementById('firstName').textContent = playerData.firstName;
            document.getElementById('lastName').textContent = playerData.lastName;
            document.getElementById('gamertag').textContent = playerData.gamertag;
            document.getElementById('age').textContent = playerData.age;
            document.getElementById('points').textContent = playerData.points;
            document.getElementById('level').textContent = playerData.level;
            document.getElementById('profileImage').src = playerData.profilePic || 'estilos/imagenes/placeholder.png';
            document.getElementById('avatar').src = playerData.avatar;

            //Actualizar nivel y barra de progreso
            updateLevel();
        })
        .catch(error => console.error('Error fetching player data:', error));


    //Si no hay imagen de perfil, muestra un placeholder de imagen vacia. (Condicion)
    if (playerData.profilePic) {
        document.getElementById('profileImage').src = playerData.profilePic;
    } else {
        document.getElementById('profileImage').src = "estilos/imagenes/placeholder.png"; //Marcador de posición
    }
});














function updateLevel() {
    const pointsInput = document.getElementById('points');
    const levelInput = document.getElementById('level');
    const progressBar = document.getElementById('progressBar');

    const points = parseInt(pointsInput.textContent); //Obtener puntos y convertir a entero
    const level = Math.floor(points / 100) + 1; //Calcular nivel basado en puntos

    levelInput.textContent = level; //Actualizar el texto del nivel

    //Calcular el porcentaje de progreso
    const progressPercentage = (points % 100) * 100 / 100;

    //Ajustar la anchura de la barra de progreso
    progressBar.style.width = `${progressPercentage}%`;

    // Cambiar el color de fondo de la barra de progreso según el diseño deseado
    if (progressPercentage === 100) {
        progressBar.style.backgroundColor = `green`; 
        setTimeout(() => {
            progressBar.style.width = `0%`; //Reiniciar la barra después de un breve retraso
        }, 1000); //Tiempo en milisegundos antes de reiniciar (ejemplo: 1 segundo)
    } else {
        progressBar.style.backgroundColor = `#00ff00`; 
    }

    //Actualizar el nivel cuando se alcanza un nuevo múltiplo de 100 puntos
    if (points % 100 === 0) {
        levelInput.textContent = level + 1; //Incrementar nivel
    }
}









//Llamar a updateLevel() al cargar la página para inicializar la barra de progreso
document.addEventListener('DOMContentLoaded', updateLevel);

//Llamar a updateLevel() cada vez que se ingrese un nuevo valor en el campo de puntos
document.getElementById('points').addEventListener('input', updateLevel);