// Array que simula el carrito de compras
const carrito = [];

// Simulación de un carrito de compras con AJAX
window.onload = function () {
  actualizarCarrito();
  gestionProductos();
  habilitarDrop();
  gestionarBorrado();
}

/**
 * TODO 1
 * Leer productos desde el fichero json productos.json y mostrarlos con mostrarProductos
 */
function gestionProductos() {
  //Hacer una llamada a la AJAX para obtener los productos
  //La llamada es al fichero productos.json y la respuesta es un array de productos
  fetch('productos.json')
    .then(response => {
      // console.log(response);
      if (!response.ok) {
        throw new Error('Error en la solicitud ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      //console.log(data);
      //Cuando tengas los productos, llama a la función mostrarProductos
      mostrarProductos(data);
    })
    .catch(error => {
      console.error('Hubo un problemacon la petición fetch: ', error);
    });
}


/**
 * TODO 2
 * Recorre los productos y por cada producto crea un div con la imagen y el nombre
 * Función para mostrar productos en el DOM con la forma (ej. kiwi):
 * <div class="product" id="producto_0" draggable="true" data-id="0" data-precio="3.5" data-nombre="kiwi">
 *  <img class="product-img" src="img/kiwi.png" alt="kiwi">
 *  <p>kiwi</p>
 * </div>
 * @param {productos} productos 
 */
function mostrarProductos(productos) {
  const product = document.getElementById('productos');
  product.innerHTML = '';
  product.setAttribute("class", "product-list");

  /* DOS MANERAS DIFERENTES DE HACER FOREACH   
  productos.forEach(myfuction);
    function myfuction(producto, index){
      const div = document.createElement('div');
      div.setAttribute("class", "producto");
      div.setAttribute("id", `producto_${index}`)
      div.className = 'producto';
      div.id = `producto_${index}`;
      div.setAttribute("draggrable", 'true');
      div.setAttribute("dataset-id", index);
      div.setAttribute("dataset-precio", producto.precio);
      div.setAttribute("dataset-nombre", producto.nombre);
  
      const img = document.createElement('img');
      img.setAttribute("class", "imagenProducto");
      img.setAttribute("id", "imagenProducto");
      img.setAttribute("src", `img/${producto.nombre}.png`);
      img.setAttribute("alt", producto.nombre);
  
      const nombre = document.createElement('p');
      nombre.textContent = producto.nombre;
  
      div.appendChild(img);
      div.appendChild(nombre);
      producto.appendChild(div);
  
    } */
  /* const listdiv = document.createElement("div");
  listdiv.setAttribute("class", "product-list"); */
  productos.forEach((producto, index) => {

    //'producto' viene del fichero productos.json, e index coge la posición en la que está el objeto
    const div = document.createElement('div');
    div.setAttribute("class", "product-item");
    div.setAttribute("id", `product_${index}`);
    div.className = 'product';
    div.id = `product_${index}`;
    div.setAttribute("draggable", 'true');
    div.setAttribute("data-id", index);
    div.setAttribute("data-precio", producto.precio);
    div.setAttribute("data-nombre", producto.nombre);

    const img = document.createElement('img');
    img.setAttribute("class", "product-img");
    img.setAttribute("id", "imagenProducto");
    img.setAttribute("src", `img/${producto.nombre}.png`);
    img.setAttribute("alt", producto.nombre);

    const nombre = document.createElement('p');
    nombre.textContent = producto.nombre;

    product.appendChild(div);
    div.appendChild(img);
    div.appendChild(nombre);

  });

  //Habilitar el drag una vez
  habilitarDrag();
}


/**
 * TODO 3 Habilitar el drag
 * Habilitar el drag una vez 
 */
function habilitarDrag() {
  // Hacer que los productos se puedan arrastrar

  //Añade el evento dragstart al producto
  //Guarda en e.dataTransfer.getData('text/plain') el id del producto
  document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', e.currentTarget.id);
      /** 
       * Si se pone target, según por donde coger el producto coge el id de la 
       * imagen o el id del producto, entonces si ponemos currentTarget, no importa 
       * por donde se coja, siempre cogerá el id del producto.
       * */
      //console.log(e.currentTarget.id);
    })
  });
}


/**
 * TODO 4 Habilitar el drop en cart
 * Añadir eventos dragover y drop al carrito
 * Al hacer drop se llama a la función agregarAlCarrito
 * Habilitar el drop para que acepte productos, y cuando hagamos drop 
 * guarde en la sesión información del producto
 */
function habilitarDrop() {
  // Habilitar el Drop en el carrito
  // Añadir eventos dragover
  const dropZone = document.getElementById('cart');
  dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  // Añadir drop al carrito
  // Al hacer drop se llama a la función agregarAlCarrito pasandole el id del producto
  // El id del producto se obtiene del e.dataTransfer.getData('text/plain')
  dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    let id = e.dataTransfer.getData('text/plain', e.id); //obtengo el id del producto
    let split = id.split('_'); //utilizo spit para dividirlo en '_', para solo coger el número 
    //console.log(id);
    //console.log(split[1]);
    //console.log("ID split: ", split);

    id = split[1];//aquí obtengo el id en la posición 1
    //console.log(id);
    agregarAlCarrito(id);
  });
}


/**
 * TODO 5: Agregar al carrito
 * llamada a la API para añadir un producto al carrito
 * Se hace una petición POST a cart.php con el id del producto
 * Una vez obtengamos la respuesta se llama a la función actualizarCarrito
 * @param {*} id Identificador del producto
 */
function agregarAlCarrito(id) {
  let element = document.getElementById('product_' + id);
  //console.log('elemento:' + element);
  let nombre = element.dataset.nombre; //obtengo el nombre desde 'data-nombre' del producto
  //console.log(id);
  //console.log(nombre);
  let productId = id; //el id la obtiene desde la función habilitarDrop()
  // let productos = [productId, nombre];
  // console.log(productos);

  // let productoJSON = JSON.stringify(producto);

  //Hacer una llamada a la API para añadir un producto al carrito
  fetch('cart.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      productId: productId, //le paso directamente la información de producto id y nombre directamente a 'cart.php'
      nombre: nombre
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ', response.status);
      }
      return response.json();
    })
    .then(data => {
      //console.log('información obtenida: ', data);
      actualizarCarrito();//llama a la función de actualizarCarrito()
    })
    .catch(error => {
      console.error("Hubo un problema con la petición fetch: ", error);
    });
}


/**
 * TODO 6: Actualizar al carrito
 * Función que actualiza el contenido del carrito con una petición GET
 * La llamada es a cart.php con el método GET
 * La respuesta es un array de productos
 * Por cada producto del carrito se crea un li con el nombre y la cantidad
 */
function actualizarCarrito() {

  //La llamada es al fichero cart.php y la respuesta es un array de productos
  fetch('cart.php', {
    method: "GET"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      //console.log("Datos recibidos: ", data);
      visualizarProducto(data);//llama a la función de visualiarProducto(data)
    })
    .catch(error => {
      console.error("Hubo un problema con la petición fetch: ", error);
    });

}

function visualizarProducto(data) {
  let ul = document.getElementById('cartItems');
  ul.innerHTML = " "; //Se añade el ul vacio para que no se duplique la lista al añdir un producto nuevo

  for (producto in data) {
    let li = document.createElement('li');
    ul.appendChild(li);
    let nombre = data[producto].nombre;
    let cantidad = data[producto].cantidad;
    let h4 = document.createElement('h4');
    h4.innerHTML = 'Nombre: ' + nombre + ' cantidad: ' + cantidad;
    //console.log(nombre);
    //console.log(cantidad);
    li.appendChild(h4);
  }
}


/**
 * TODO 7: Borrar carrito
 * Añadir evento click al icono de la papelera
 * Al hacer click se muestra un mensaje de confirmación
 * Si el usuario confirma se llama a la función borrarCarrito
 */
function gestionarBorrado() {
  //Añadir evento click al icono de la papelera
  let papelera = document.getElementById('basura');
  papelera.addEventListener('click', function () {
    let eliminar = window.confirm('¿Quieres eliminar la lista de la compra?'); //añado un confirm, para que esté seguro si quiere eliminarlo o o
    //console.log(eliminar);
    if (eliminar) {
      borrarCarrito();
    }
    //Al hacer click se muestra un mensaje de confirmación
    //Si el usuario confirma se llama a la función borrarCarrito
  });
}


/**
 * TODO 8: Borrar carrito
 * Llamada a la API para borrar el carrito
 * Se hace una petición DELETE a cart.php
 * Una vez obtengamos la respuesta se limpia el carrito
 */
function borrarCarrito() {
  //Hacer una llamada a la API para borrar el carrito
  //La llamada es al fichero cart.php y el método es DELETE
  fetch('cart.php', {
    method: "DELETE"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      //console.log('infomracion de  data: ' + data);
      let ul = document.getElementById('cartItems');
      ul.innerHTML = " ";
    });

  //Una vez obtengamos la respuesta se limpia el carrito
}
