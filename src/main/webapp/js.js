class Usuario {
	constructor(username, email, password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}
}

class Coche {
	constructor(nombre, precio, imagen) {
		this.nombre = nombre;
		this.precio = precio;
		this.imagen = imagen;
	}
}

class Pedido {
	constructor(usuario, productos, direccionEnvio, fechaRealizacion) {
		this.usuario = usuario;
		this.productos = productos;
		this.direccionEnvio = direccionEnvio;
		this.fechaRealizacion = fechaRealizacion;
	}
}

// Cargar usuarios, coches en carrito y pedidos desde localStorage
function cargarDatosDesdeLocalStorage() {
	usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
	cochesEnCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
	pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
}

// Guardar usuarios, coches en carrito y pedidos en localStorage
function guardarDatosEnLocalStorage() {
	localStorage.setItem('usuarios', JSON.stringify(usuarios));
	localStorage.setItem('carrito', JSON.stringify(cochesEnCarrito));
	localStorage.setItem('pedidos', JSON.stringify(pedidos));
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
	const nuevoCoche = new Coche(nombreCoche, precioCoche, imagenCoche);
	cochesEnCarrito.push(nuevoCoche);
	guardarDatosEnLocalStorage();
	console.log(`Añadido al carrito: ${nombreCoche}, ${precioCoche}, ${imagenCoche}`);
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
        const precioNumerico = Number(coche.precio);
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

// Función para crear una celda de texto (<td>)
function crearCeldaTexto(texto) {
	const celda = document.createElement("td");
	celda.textContent = texto;
	return celda;
}

// Función para crear una celda de imagen (<td>)
function crearCeldaImagen(src) {
	const celda = document.createElement("td");
	const imagen = document.createElement("img");
	imagen.src = src;
	imagen.style.maxWidth = "100px";
	celda.appendChild(imagen);
	return celda;
}

// Función para obtener la fecha actual en el formato deseado
function obtenerFechaActual() {
	const fecha = new Date();
	const dia = fecha.getDate();
	const mes = fecha.getMonth() + 1;
	const anyo = fecha.getFullYear();
	return `${dia}-${mes}-${anyo}`;
}

// Mostrar los pedidos en la tabla de pedidos
function mostrarPedidos() {
	cargarDatosDesdeLocalStorage();
	const pedidosBody = document.getElementById("pedidosBody");

	pedidos.forEach(pedido => {
		const fila = document.createElement("tr");
		fila.appendChild(crearCeldaTexto(pedido.usuario));
		fila.appendChild(crearCeldaTexto(pedido.productos[0].nombre)); 
		fila.appendChild(crearCeldaImagen(pedido.productos[0].imagen));
		fila.appendChild(crearCeldaTexto(pedido.fechaRealizacion));
		pedidosBody.appendChild(fila);
	});
}

