/*CODIGO PARA INTERACTUAR Y QUE DESAPAREZCAN LOS FORMULARIOS DE INICIO DE SESION Y REGISTRO
CREACION DE UN VALOR...  LOS FORMULARIOS DE INICIO Y REGISTRO*/ 
const $btnSignIn= document.querySelector('.sign-in-btn'),
      $btnSignUp = document.querySelector('.sign-up-btn'),  
      $signUp = document.querySelector('.sign-up'),
      $signIn  = document.querySelector('.sign-in');



/*CONDICIONES DE LA INTERACCION, SI HACEMOS CLICK SOBRE EL BOTON SE HACE EL CAMBIO  */      
document.addEventListener('click', e => { 
    if (e.target === $btnSignIn || e.target === $btnSignUp) {
        $signIn.classList.toggle('active');
        $signUp.classList.toggle('active')
    }
});