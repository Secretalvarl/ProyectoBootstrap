// Declaración de arrays para usuarios, coches en carrito y pedidos
let usuarios = [];
let cochesEnCarrito = [];
let pedidos = [];

// Obtenemos el carrito guardado del localStorage y lo parseamos si existe
const carritoGuardado = localStorage.getItem('carrito');
if (carritoGuardado) {
    cochesEnCarrito = JSON.parse(carritoGuardado);
}

// Función para registrar un nuevo usuario
function registrarUsuario() {
    const nombreUsuario = document.getElementById("nombreUsuario").value;
    const correoElectronico = document.getElementById("correoElectronico").value;
    const contraseña = document.getElementById("contraseñaRegistro").value;

    // Creamos un objeto nuevoUsuario con los datos del formulario
    const nuevoUsuario = {
        username: nombreUsuario,
        email: correoElectronico,
        password: contraseña
    };

    // Agregamos el nuevo usuario al array de usuarios
    usuarios.push(nuevoUsuario);

    // Guardamos el array de usuarios en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Mostramos mensaje de éxito y reseteamos el formulario
    alert("Usuario registrado con éxito");
    document.getElementById("registrarUsuario").reset();

    return false; // Evita el envío del formulario
}

// Función para iniciar sesión
function iniciarSesion() {
    const nombreUsuarioOEmail = document.getElementById("Usuario").value;
    const contraseña = document.getElementById("contraseña").value;

    // Buscamos el usuario por nombre de usuario o correo electrónico
    const usuario = usuarios.find(u => u.username === nombreUsuarioOEmail || u.email === nombreUsuarioOEmail);

    // Verificamos si el usuario existe y la contraseña es correcta
    if (usuario && usuario.password === contraseña) {
        alert("Inicio de sesión exitoso");
        return true;
    } else {
        const mensajeError = document.getElementById('mensajeError');
        mensajeError.textContent = "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.";
        return false;
    }
}

// Función para manejar el formulario de dirección y realizar un pedido
function manejarFormularioDireccion() {
    const nombreApellido = document.getElementById('nombreApellido').value;
    const direccion = document.getElementById('direccion').value;
    const ciudad = document.getElementById('ciudad').value;
    const provincia = document.getElementById('provincia').value;
    const codigoPostal = document.getElementById('codigoPostal').value;

    // Creamos un objeto pedido con la información del formulario y el último usuario registrado
    const pedido = {
        usuario: usuarios[usuarios.length - 1].username, // Tomamos el último usuario registrado
        productos: cochesEnCarrito, // Usamos los productos del carrito
        direccionEnvio: `${direccion}, ${ciudad}, ${provincia}, ${codigoPostal}`,
        fechaRealizacion: obtenerFechaActual()
    };

    // Agregamos el pedido al array de pedidos
    pedidos.push(pedido);

    // Guardamos el array de pedidos en el localStorage
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Mostramos mensaje de éxito, limpiamos el formulario y mostramos los pedidos
    alert("Pedido realizado con éxito");
    mostrarPedidos();
}

// Función para validar datos de tarjeta de crédito
function validarTarjeta() {
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const fechaCaducidad = document.getElementById('fechaCaducidad').value;
    const cvc = document.getElementById('cvc').value;

    // Validamos que todos los campos estén completos
    if (nombreCompleto.trim() === '' || numeroTarjeta.trim() === '' || fechaCaducidad.trim() === '' || cvc.trim() === '') {
        alert('Debe completar todos los campos para realizar la compra.');
        return;
    }

    // Validamos que el número de tarjeta y el CVC contengan solo dígitos
    if (!/^\d+$/.test(numeroTarjeta)) {
        alert('El número de tarjeta debe contener solo dígitos.');
        return;
    }

    if (!/^\d+$/.test(cvc)) {
        alert('El CVC debe contener solo dígitos.');
        return;
    }

    // Validamos la fecha de caducidad de la tarjeta
    const fechaHoy = new Date();
    const anyo = fechaHoy.getFullYear() % 100;
    const mes = fechaHoy.getMonth() + 1;
    const [mesTarjeta, anyoTarjeta] = fechaCaducidad.split('/').map(val => parseInt(val));

    if (anyoTarjeta < anyo || (anyoTarjeta === anyo && mesTarjeta < mes)) {
        alert('La tarjeta está caducada. Por favor, ingresa una tarjeta válida.');
        return;
    }

    // Mostramos mensaje de venta completada
    const mensaje = `Venta completada: \n\nNombre completo: ${nombreCompleto}\nNúmero tarjeta: ${numeroTarjeta}\nFecha caducidad: ${fechaCaducidad}\nCVC: ${cvc}`;
    alert(mensaje);
}

// Función para agregar un coche al carrito
function agregarAlCarrito(nombreCoche, precioCoche, imagenCoche) {
    console.log(`Añadido al carrito: ${nombreCoche}, ${precioCoche}, ${imagenCoche}`);

    // Creamos un objeto coche y lo añadimos al array cochesEnCarrito
    const coche = { nombre: nombreCoche, precio: precioCoche, imagen: imagenCoche };
    cochesEnCarrito.push(coche);

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(cochesEnCarrito));

    // Actualizamos la visualización del carrito
    mostrarCarrito();
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const listaCoches = document.getElementById("listaCoches");

    // Recorremos el array cochesEnCarrito y mostramos cada coche en la lista
    cochesEnCarrito.forEach(coche => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${coche.nombre}</td>
            <td><img src="${coche.imagen}" style="max-width: 100px;"></td>
            <td>${coche.precio}</td>
        `;
        listaCoches.appendChild(fila);
    });
}

// Función para mostrar el precio total del carrito
function mostrarPrecioTotal() {
	let totalPrecio = 0;

	// Calcular el precio total sumando los precios de todos los coches en el carrito
	cochesEnCarrito.forEach(coche => {
		const precioNumerico = parseFloat(coche.precio.replace('€', ''));
		if (!isNaN(precioNumerico)) {
			totalPrecio += precioNumerico;
		}
	});
	
	// Actualizar el precio total mostrado 
	const precioTotalSpan = document.getElementById('precioTotal');
	if (precioTotalSpan) {
		precioTotalSpan.textContent = `${totalPrecio.toFixed(2)}€`;
	}
}

function limpiarCarrito() {
	// Eliminar el carrito de localStorage
	localStorage.removeItem('carrito');

	// Reiniciar el array cochesEnCarrito
	cochesEnCarrito = [];

	// Limpiar la lista de coches 
	const listaCoches = document.getElementById('listaCoches');
	if (listaCoches) {
		listaCoches.innerHTML = '';
	}

	// Reiniciar el precio total mostrado 
	const precioTotalSpan = document.getElementById('precioTotal');
	if (precioTotalSpan) {
		precioTotalSpan.textContent = '0.00€';
	}
}

// Obtener usuarios del localStorage si existen
const usuariosGuardados = localStorage.getItem('usuarios');
if (usuariosGuardados) {
    usuarios = JSON.parse(usuariosGuardados);
}

// Obtener carrito del localStorage si existe
const carritoGuardado2 = localStorage.getItem('carrito');
if (carritoGuardado2) {
    cochesEnCarrito = JSON.parse(carritoGuardado);
}

// Función para obtener la fecha actual
function obtenerFechaActual() {
     const fechaHoy = new Date();
    const anyo = fechaHoy.getFullYear(); 
    const mes = fechaHoy.getMonth() + 1; // Obtener el mes actual (1-12)
    const dia = fechaHoy.getDate();
    
    return `${dia}-${mes}-${anyo}`;
}

// Función para mostrar los pedidos en la tabla
function mostrarPedidos() {
    const tablaPedidos = document.getElementById('tablaPedidos');

    pedidos.forEach(pedido => {
        const fila = document.createElement('div');

        // Construimos el contenido de la fila con la información del pedido
        fila.textContent = `Usuario: ${pedido.usuario} | Productos: ${obtenerNombresProductos(pedido.productos)} | Direccion Envío: ${pedido.direccionEnvio} | Fecha Pedido: ${pedido.fechaRealizacion}`;

        // Agregamos la fila a la tabla de pedidos
        tablaPedidos.appendChild(fila);
    });
}

// Función para obtener los nombres de los productos de un pedido
function obtenerNombresProductos(productos) {
    return productos.map(producto => producto.nombre).join(', ');
}
