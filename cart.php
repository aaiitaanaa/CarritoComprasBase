<?php
session_start();

// Inicializar el carrito si no existe
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Obtener los datos enviados desde la solicitud
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'POST') {
    // Recibir datos de la solicitud POST (agregar producto al carrito)
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['productId'])) {
        $productId = $input['productId'];
        $nombre = $input['nombre'];

        // Agregar producto al carrito
        $cantidad = 1;
        if(array_key_exists($productId, $_SESSION['cart'])){
            //Actualizar valor
            $_SESSION['cart'][$productId]['cantidad']++;
            $cantidad = $_SESSION['cart'][$productId]['cantidad'];
        }else{
            $_SESSION['cart'][$productId] = array(
                'nombre' => $nombre,
                'cantidad' => 1
            );
        }

        // Responder con el producto agregado
        echo json_encode([
            "productId" => $productId,
            "nombre" => $nombre,
            "cantidad" => $cantidad
        ]);

    } else {
        // Datos inválidos
        http_response_code(400);
        echo json_encode(["error" => "Datos inválidos"]);
    }
} elseif ($requestMethod === 'GET') {
    // Devolver el contenido del carrito en una solicitud GET
    echo json_encode($_SESSION['cart']);
} elseif ($requestMethod === 'DELETE') {
    $_SESSION['cart'] = [];
    echo json_encode("");
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
