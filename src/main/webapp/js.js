let usuarios = [];

function registrarUsuario() {
    const nombreUsuario = document.getElementById("nombreUsuario").value;
    const correoElectronico = document.getElementById("correoElectronico").value;
    const contraseña = document.getElementById("contraseñaRegistro").value;

    const nuevoUsuario = {
        username: nombreUsuario,
        email: correoElectronico,
        password: contraseña
    };

    usuarios.push(nuevoUsuario);
    alert("Usuario registrado con éxito");
    document.getElementById("registrarUsuario").reset();

    return false; 
}

function iniciarSesion() {
    const nombreUsuarioOEmail = document.getElementById("Usuario").value;
    const contraseña = document.getElementById("contraseña").value;

    const usuario = usuarios.find(u => u.username === nombreUsuarioOEmail || u.email === nombreUsuarioOEmail);

    if (usuario && usuario.password === contraseña) {
        alert("Inicio de sesión exitoso");
        return true; 
    } else {
        const mensajeError = document.getElementById('mensajeError');
        mensajeError.textContent = "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.";
        return false; 
    }
}

