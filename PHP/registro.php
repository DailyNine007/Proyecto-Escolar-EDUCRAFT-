<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

//Verificar si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //Verificar que los campos no estén vacíos
    if (isset($_POST['nombre']) && isset($_POST['correo']) && isset($_POST['contraseña'])) {
        //Recibir datos del formulario
        $nombre = $_POST['nombre'];
        $correo = $_POST['correo'];
        $contraseña = $_POST['contraseña'];

        // Conectar a la base de datos
        $servername = "localhost";
        $username = "root"; //El nombre de usuario por defecto es 'root'
        $password = ""; //Por defecto, la contraseña está vacía
        $dbname = "usuarios";

        // Crear conexión
        $conn = new mysqli($servername, $username, $password, $dbname);

        //Verificar la conexión
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }

        //Verificar si el correo electrónico ya está registrado
        $sql = "SELECT id FROM registro WHERE correo='$correo'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            //El correo electrónico ya está registrado
            echo "Esta cuenta ya existe.";
        } else {
            //Encriptar la contraseña
            $contraseña_encriptada = password_hash($contraseña, PASSWORD_BCRYPT);

            //Insertar datos en la tabla
            $sql = "INSERT INTO registro (nombre, correo, contraseña) VALUES ('$nombre', '$correo', '$contraseña_encriptada')";

            if ($conn->query($sql) === TRUE) {
                echo "Registro exitoso";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }

        //Cerrar la conexión
        $conn->close();
    } else {
        echo "Por favor, complete todos los campos.";
    }
} else {
    echo "Método de solicitud no válido.";
}
?>
