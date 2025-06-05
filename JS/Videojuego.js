document.addEventListener('DOMContentLoaded', (event) => {
    //Selección de elementos del DOM
    const gameScreen = document.getElementById('game-screen');
    const playGameButton = document.getElementById('start-game-button');
    const gameMenu = document.getElementById('game-menu');
    const level1Button = document.getElementById('level1-button');
    const level2Button = document.getElementById('level2-button');
    const level3Button = document.getElementById('level3-button');
    const level4Button = document.getElementById('level4-button');
    const backButton = document.getElementById('back-button');
    const timerDisplay = document.getElementById('timer');
    const changeTimerButton = document.getElementById('change-timer-button');
    const progressBar = document.getElementById('progress-bar');
    const playerLevelDisplay = document.getElementById('player-level');
    const correctAnswerAudio = document.getElementById('correct-answer-audio');
    const wrongAnswerAudio = document.getElementById('wrong-answer-audio');
    const gameAudio = document.getElementById('game-audio');
    const volumeControl = document.getElementById('volume-control');
    const levelUpSound = document.getElementById('level-up-sound'); //Definir el elemento de audio para el sonido de subida de nivel
    const homeButton = document.getElementById('home-button');
    
    //Variables del juego
    let timerInterval;
    let secondsRemaining = 60;
    let score = 0; //Variable para barra de progreso
    let totalScore = 0; //Nueva variable para almacenar el total de puntos obtenidos
    let lastGameScore = 0; //Puntos obtenidos en la partida anterior
    let playerLevel = 1;
    const maxScore = 100;
    let currentLevel = 1;

    // Evento para el botón de inicio
    homeButton.addEventListener('click', () => {
    window.location.href = 'Pagina_Principal.html'; // URL página principal
    });

    //Función para reproducir el audio del juego
    function playGameAudio() {
        const gameAudio = document.getElementById('game-audio');
        gameAudio.play();
    }

    //Función para ajustar el volumen
    function setVolume(volume) {
        gameAudio.volume = volume;
        correctAnswerAudio.volume = volume;
        wrongAnswerAudio.volume = volume;
    }

    //Ajustar el volumen inicial
    setVolume(volumeControl.value);

    //Evento para cambiar el volumen
    volumeControl.addEventListener('input', (event) => {
        setVolume(event.target.value);
    });

    //Evento para iniciar el juego
    playGameButton.addEventListener('click', () => {
        playGameAudio();
        gameScreen.style.display = 'flex';
        hideIntroScreen();
        showGameMenu();
        loadPlayerData(); //Cargar datos del jugador al iniciar el juego
        updateProgressBar(score);
    });










    

    //Cargar datos del jugador
    function loadPlayerData() {
    const playerId = 1; // Ajusta esto según tu lógica para obtener el ID del jugador
    getPlayerLevel(playerId).then(level => {
        if (level !== null) {
            document.getElementById('player-level').innerText = `Nivel: ${level}`;
        }
    });
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "get_player.php", true);
    xhr.onload = function () {
        if (this.status === 200) {
             const playerData = JSON.parse(this.responseText);
            totalScore = playerData.points; //Almacena los puntos
            playerLevel = playerData.level; //Almacena el nivel
            updatePlayerLevel(); //Actualiza la visualización del nivel
            
            // Llama a loadPlayerData cuando la página se carga
            document.addEventListener('DOMContentLoaded', loadPlayerData);  
            }
            };
        xhr.send();
    }
    
        //Actualizar datos del jugador
    function updatePlayerData() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "update_player.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`points=${totalScore}&level=${playerLevel}`); //Envía puntos y nivel al PHP
    }












    //Evento para regresar a la pantalla de inicio
    backButton.addEventListener('click', () => {
        hideGame();
        showIntroScreen();
        clearInterval(timerInterval);
        timerDisplay.textContent = '';
        secondsRemaining = 60;
        updatePlayerData(); //Actualizar datos del jugador al regresar
        updateProgressBar(score);
        homeButton.style.display = 'block'; // Mostrar el botón de inicio
        changeTimerButton.style.display = 'none';
    });


    //Eventos para mostrar descripciones al pasar el ratón sobre los botones de nivel
    level1Button.addEventListener('mouseover', () => {
        level1Button.title = 'Sumas básicas (5 puntos)';
    });

    level2Button.addEventListener('mouseover', () => {
        level2Button.title = 'Multiplicaciones básicas (10 puntos)';
    });

    level3Button.addEventListener('mouseover', () => {
        level3Button.title = 'Sumas y restas con numeros del 1 al 50 (15 puntos)';
    });

    level4Button.addEventListener('mouseover', () => {
        level4Button.title = 'Sumas, restas con numeros 1 al 50 y multiplicaciones del 1 al 15 (20 puntos)';
    });







    



    //Eventos para iniciar los juegos de sumas y multiplicaciones
    level1Button.addEventListener('click', () => {
        hideGameMenu();
        homeButton.style.display = 'none'; //Ocultar el botón de inicio
        startAdditionGame();
        startTimer();
        showChangeTimerButton(); // Mostrar el botón al iniciar el nivel
    });

    level2Button.addEventListener('click', () => {
        hideGameMenu();
        homeButton.style.display = 'none'; //Ocultar el botón de inicio
        startMultiplicationGame();
        startTimer();
        showChangeTimerButton(); // Mostrar el botón al iniciar el nivel
    });

     //Evento para iniciar el juego de sumas y restas(Nivel 3)
    level3Button.addEventListener('click', () => {
        hideGameMenu();
        homeButton.style.display = 'none'; //Ocultar el botón de inicio
        startAdditionSubtractionGame();
        startTimer();
        showChangeTimerButton(); // Mostrar el botón al iniciar el nivel
    });

    level4Button.addEventListener('click', () => {
        hideGameMenu();
        homeButton.style.display = 'none'; //Ocultar el botón de inicio
        startAdditionSubtractionMultiplicationGame();
        startTimer();
        showChangeTimerButton(); // Mostrar el botón al iniciar el nivel
    });













    /*Funciones para ocultar y mostrar botones conforme se clickean las opciones
    Para que el juego tenga la dinamica de quitar y agregar botones segun donde se encuentre el usuario*/
    function hideIntroScreen() {
        const introScreen = document.getElementById('intro-screen');
        introScreen.style.display = 'none';
        updateProgressBar(score);
        changeTimerButton.style.display = 'none';
    }

    function showGameMenu() {
        const gameTitle = document.getElementById('game-title');
        gameTitle.style.display = 'block';
        gameMenu.style.display = 'flex';
        homeButton.style.display = 'block'; //Mostrar el botón de inicio
        updateProgressBar(score);
        changeTimerButton.style.display = 'none';
    }

    function hideGameMenu() {
        const gameTitle = document.getElementById('game-title');
        gameTitle.style.display = 'none';
        gameMenu.style.display = 'none';
        homeButton.style.display = 'none'; //Ocultar el botón de inicio
        updateProgressBar(score);
        changeTimerButton.style.display = 'none';
    }

    function showIntroScreen() {
        const introScreen = document.getElementById('intro-screen');
        introScreen.style.display = 'flex';
        const gameTitle = document.getElementById('game-title');
        gameTitle.style.display = 'none';
        const playGameButton = document.getElementById('start-game-button');
        playGameButton.style.display = 'block';
        hideGameMenu();
        updateProgressBar(score);
        changeTimerButton.style.display = 'none';
    }

    // Función para mostrar el botón durante los niveles
    function showChangeTimerButton() {
        changeTimerButton.style.display = 'block';
    }

    // Evento para el botón de cambio de temporizador
    changeTimerButton.addEventListener('click', () => {
        secondsRemaining = 1; // Cambia el temporizador a 1 segundo
        clearInterval(timerInterval); // Detiene el temporizador actual
        startTimer(); // Reinicia el temporizador con el nuevo tiempo
    });

     // Eventos para el botón de inicio y los niveles
     playGameButton.addEventListener('click', () => {
        playGameAudio();
        gameScreen.style.display = 'flex';
        hideIntroScreen();
        showGameMenu();
        loadPlayerData();
        updateProgressBar(score);
    });











    //Función/Logica del apartado de sumas(Nivel 1)
    function startAdditionGame() {
        const equationContainer = document.createElement('div');
        equationContainer.id = 'equation-container';
        equationContainer.style.marginTop = '20px';
        gameScreen.appendChild(equationContainer);

        const answerInput = document.createElement('input');
        answerInput.type = 'number';
        answerInput.style.marginTop = '10px';
        gameScreen.appendChild(answerInput);
        showChangeTimerButton();

        let num1, num2;

        answerInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const userAnswer = parseInt(answerInput.value);
                if (checkAnswer(userAnswer)) {
                    correctAnswerAudio.play(); //Reproducir sonido de respuesta correcta
                    score += 5;
                    lastGameScore += 5;
                    totalScore += 5;
                    updateProgressBar();
                    if (score >= maxScore) {
                        score = 0;
                        playerLevel++;
                        updatePlayerLevel();
                        resetProgressBar();
                    }
                    generateRandomEquation();
                } else {
                    wrongAnswerAudio.play(); //Reproducir sonido de respuesta incorrecta
                    generateRandomEquation();
                }
                answerInput.value = '';
            }
        });

        //Función para verificar la respuesta
        function checkAnswer(answer) {
            return answer === (num1 + num2);
        }

        //Función para generar una nueva ecuación aleatoria
        function generateRandomEquation() {
            let newNum1, newNum2;
            do {
                newNum1 = Math.floor(Math.random() * 25) + 1;
                newNum2 = Math.floor(Math.random() * 25) + 1;
            } while (newNum1 === num1 && newNum2 === num2);

            num1 = newNum1;
            num2 = newNum2;
            equationContainer.textContent = `${num1} + ${num2}`;
        }
        generateRandomEquation();
    }








    


    //Función/Logica del apartado de multiplicaciones(Nivel 2)
    function startMultiplicationGame() {
        const equationContainer = document.createElement('div');
        equationContainer.id = 'equation-container';
        equationContainer.style.marginTop = '20px';
        gameScreen.appendChild(equationContainer);

        const answerInput = document.createElement('input');
        answerInput.type = 'number';
        answerInput.style.marginTop = '10px';
        gameScreen.appendChild(answerInput);
        showChangeTimerButton();

        let num1, num2;

        answerInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const userAnswer = parseInt(answerInput.value);
                if (checkAnswer(userAnswer)) {
                    correctAnswerAudio.play(); //Reproducir sonido de respuesta correcta
                    score += 10;
                    lastGameScore += 10;
                    totalScore += 10;
                    updateProgressBar();
                    if (score >= maxScore) {
                        score = 0;
                        playerLevel++;
                        updatePlayerLevel();
                        resetProgressBar();
                    }
                    generateRandomEquation();
                } else {
                    wrongAnswerAudio.play(); //Reproducir sonido de respuesta incorrecta
                    generateRandomEquation();
                }
                answerInput.value = '';
            }
        });

        //Función para verificar la respuesta
        function checkAnswer(answer) {
            return answer === (num1 * num2);
        }

        //Función para generar una nueva ecuación aleatoria
        function generateRandomEquation() {
            let newNum1, newNum2;
            do {
                newNum1 = Math.floor(Math.random() * 10) + 1;
                newNum2 = Math.floor(Math.random() * 10) + 1;
            } while (newNum1 === num1 && newNum2 === num2);

            num1 = newNum1;
            num2 = newNum2;
            equationContainer.textContent = `${num1} x ${num2}`;
        }

        generateRandomEquation();
    }







    
        //Función/Logica del apartado de sumas y restas(Nivel 3)
        function startAdditionSubtractionGame() {
            const equationContainer = document.createElement('div');
            equationContainer.id = 'equation-container';
            equationContainer.style.marginTop = '20px';
            gameScreen.appendChild(equationContainer);
    
        const answerInput = document.createElement('input');
        answerInput.type = 'number';
        answerInput.style.marginTop = '10px';
        gameScreen.appendChild(answerInput);
        showChangeTimerButton();
    
        let num1, num2;
        let operation; //Variable para almacenar la operación
    
        answerInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const userAnswer = parseInt(answerInput.value);
                if (checkAnswer(userAnswer)) {
                    correctAnswerAudio.play(); // Reproducir sonido de respuesta correcta
                    score += 15; // Ajustar puntos según la lógica deseada
                    lastGameScore += 15;
                    totalScore += 15;
                    updateProgressBar();
                    if (score >= maxScore) {
                        score = 0;
                        playerLevel++;
                        updatePlayerLevel();
                        resetProgressBar();
                    }
                    generateRandomEquation();
                } else {
                    wrongAnswerAudio.play(); //Reproducir sonido de respuesta incorrecta
                    generateRandomEquation();
                }
                answerInput.value = '';
            }
        });
    
        // Función para verificar la respuesta
        function checkAnswer(answer) {
            if (operation === '+') {
                return answer === (num1 + num2);
            } else if (operation === '-') {
                return answer === (num1 - num2);
            }
            return false;
        }
    
        // Función para generar una nueva ecuación aleatoria
        function generateRandomEquation() {
            num1 = Math.floor(Math.random() * 50) + 1; // Números del 1 al 50
            num2 = Math.floor(Math.random() * 50) + 1; // Números del 1 al 50
            operation = Math.random() < 0.5 ? '+' : '-'; // Elegir aleatoriamente entre suma y resta
            equationContainer.textContent = `${num1} ${operation} ${num2}`;
        }
        generateRandomEquation();
    }
    
    
    
    
    
    
    
    
        //Función/Logica del sumas, restas y multiplicaciones(Nivel 4)
        function startAdditionSubtractionMultiplicationGame() {
        const equationContainer = document.createElement('div');
        equationContainer.id = 'equation-container';
        equationContainer.style.marginTop = '20px';
        gameScreen.appendChild(equationContainer);
    
        const answerInput = document.createElement('input');
            answerInput.type = 'number';
            answerInput.style.marginTop = '10px';
            gameScreen.appendChild(answerInput);
            showChangeTimerButton();
    
        let num1, num2;
        let operation; //Para almacenar la operación
    
        answerInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const userAnswer = parseInt(answerInput.value);
                if (checkAnswer(userAnswer)) {
                    correctAnswerAudio.play(); // Reproducir sonido de respuesta correcta
                    score += 20; //Asignar puntos por respuesta correcta
                    lastGameScore += 20;
                    totalScore += 20;
                    updateProgressBar();
                    if (score >= maxScore) {
                        score = 0;
                        playerLevel++;
                        updatePlayerLevel();
                        resetProgressBar();
                    }
                    generateRandomEquation();
                } else {
                    wrongAnswerAudio.play(); //Reproducir sonido de respuesta incorrecta
                    generateRandomEquation();
                }
                answerInput.value = '';
            }
        });
    
        //Función para verificar la respuesta
        function checkAnswer(answer) {
            switch (operation) {
                case '+':
                    return answer === (num1 + num2);
                case '-':
                    return answer === (num1 - num2);
                case '*':
                    return answer === (num1 * num2);
                default:
                    return false;
            }
        }
    
        //Función para generar una nueva ecuación aleatoria
        function generateRandomEquation() {
            const randomOperation = Math.random();
            if (randomOperation < 0.33) {
                //Suma
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                operation = '+';
                equationContainer.textContent = `${num1} + ${num2}`;
            } else if (randomOperation < 0.66) {
                //Resta
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                operation = '-';
                equationContainer.textContent = `${num1} - ${num2}`;
            } else {
                //Multiplicación
                num1 = Math.floor(Math.random() * 15) + 1;
                num2 = Math.floor(Math.random() * 15) + 1;
                operation = '*';
                equationContainer.textContent = `${num1} x ${num2}`;
            }
        }
        
        generateRandomEquation();
    }
    









    //Función para ocultar el juego actual(Eliminar campos )
    /*La función hideGame elimina los elementos del juego actual del DOM para limpiar la interfaz 
    y prepararla para el siguiente estado de la aplicación, sea este un nuevo juego, un menú o 
    cualquier otra vista.*/
    function hideGame() {
        const equationContainer = document.getElementById('equation-container');
        if (equationContainer) {
            equationContainer.parentNode.removeChild(equationContainer);
        }
        const answerInput = document.querySelector('input[type="number"]');
        if (answerInput) {
            answerInput.parentNode.removeChild(answerInput);
        }
        updateProgressBar(score);
    }







    //Función/logica del temporizador
    function startTimer() {
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            secondsRemaining--;
            timerDisplay.textContent = `Tiempo restante: ${secondsRemaining} segundos`;

            if (secondsRemaining === 0) {
                clearInterval(timerInterval);
                alert(
                    `Tiempo agotado. "\n"
                    Puntuacion de la partida ${lastGameScore}. "\n"
                    Puntuación total: ${totalScore} puntos`
                );
                hideGame();
                showIntroScreen();
                resetProgressBar();
                updateProgressBar(score);
                timerDisplay.textContent = '';
                secondsRemaining = 60;
                lastGameScore = 0 //Reiniciar la puntuacion de la ultima partida
            }
        }, 1000);
    }



    











    function getPlayerLevel(playerId) {
        return fetch(`get_player_level.php?player_id=${playerId}`)
            .then(response => response.json())
            .then(data => {
                if (data.level) {
                    return data.level;
                } else {
                    console.error(data.error);
                    return null;
                }
            })
            .catch(error => {
                console.error('Error fetching player level:', error);
                return null;
            });
    }









    
    //Función para actualizar la barra de progreso
    function updateProgressBar() {
        const progress = (score / maxScore) * 100;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            progressBar.style.backgroundColor = '#2ecc71';
        }
    }
    //Función para reiniciar la barra de progreso
    function resetProgressBar() {
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#4CAF50';
    }





    //Función para actualizar el nivel del jugador
    function updatePlayerLevel() {
        playerLevelDisplay.textContent = `Nivel: ${playerLevel}`;
        if (playerLevel > 1) { //Verificar que el nivel actual sea mayor que 1 antes de reproducir el sonido de subida de nivel
            levelUpSound.play(); //Reproduce el sonido de subida de nivel
        }
    }
});







//Función para iniciar el juego en el canvas
function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '48px serif';
    ctx.fillText('El juego empieza aquí!', 10, 50);
}