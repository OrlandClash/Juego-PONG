// Variables para las dimensiones y posiciones
let anchoCanvas = 600;
let altoCanvas = 400;

let raquetaAncho = 10;
let raquetaAlto = 100;

let posicionRaquetaIzquierda;
let posicionRaquetaDerecha;

let pelotaX;
let pelotaY;
let pelotaTamano = 20;
let velocidadPelotaX = 5;
let velocidadPelotaY = 3;

let grosorMarco = 20; // Grosor del marco superior e inferior

// Velocidad de la raqueta derecha (jugador)
let velocidadRaquetaDerecha = 0;

// Puntajes
let puntajeJugador = 0;
let puntajeComputadora = 0;

// Variables para almacenar las imágenes y el sonido
let fondo, barraJugador, barraComputadora, pelota;
let sonidoRebote;
let sonidoBordeVertical;

// Ángulo de rotación de la pelota
let anguloPelota = 0;
let velocidadRotacion = 0.1; // Velocidad de rotación de la pelota

// Variables para la síntesis de voz
let narrador = window.speechSynthesis;

function narrarPuntaje(mensaje) {
    if (narrador) {
        let utterance = new SpeechSynthesisUtterance(mensaje);
        narrador.speak(utterance);
    }
}

function preload() {
    // Cargar el sonido de rebote
    sonidoRebote = loadSound('bounce.wav'); // Cargar el sonido de rebote
    sonidoBordeVertical = loadSound('jingle_win_synth.wav'); // Sonido para los bordes verticales
    // Cargar las imágenessonidoBordeVertical
    fondo = loadImage('fondo1.png');
    barraJugador = loadImage('barra1.png');
    barraComputadora = loadImage('barra2.png');
    pelota = loadImage('bola.png');
}

function setup() {
    createCanvas(anchoCanvas, altoCanvas);
    posicionRaquetaIzquierda = (altoCanvas - raquetaAlto) / 2;
    posicionRaquetaDerecha = (altoCanvas - raquetaAlto) / 2;
    
    // Posición inicial de la pelota
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;

    textSize(20); // Tamaño del texto para los puntajes
    textAlign(CENTER, CENTER); // Alineación centrada para los puntajes
}

function draw() {
    // Dibujar la imagen de fondo
    image(fondo, 0, 0, anchoCanvas, altoCanvas);

    // Dibujar los marcos superior e inferior
    fill(color("#2b3fd6"));
    rect(0, 0, anchoCanvas, grosorMarco); // Marco superior
    rect(0, altoCanvas - grosorMarco, anchoCanvas, grosorMarco); // Marco inferior

    // Dibujar raquetas usando imágenes
    image(barraComputadora, 10, posicionRaquetaIzquierda, raquetaAncho, raquetaAlto); // Raqueta izquierda (computadora)
    image(barraJugador, anchoCanvas - 20, posicionRaquetaDerecha, raquetaAncho, raquetaAlto); // Raqueta derecha (jugador)

    // Dibujar pelota con efecto giratorio
    push(); // Guardar la configuración actual de transformación
    translate(pelotaX, pelotaY); // Trasladar el sistema de coordenadas al centro de la pelota
    rotate(anguloPelota); // Rotar el sistema de coordenadas
    imageMode(CENTER); // Dibujar la pelota desde su centro
    image(pelota, 0, 0, pelotaTamano, pelotaTamano); // Dibujar la imagen de la pelota
    pop(); // Restaurar la configuración de transformación

    // Dibujar puntajes
    fill(255); // Cambiar a blanco
    text(puntajeComputadora, anchoCanvas / 4, grosorMarco / 2); // Puntaje computadora (lado izquierdo)
    text(puntajeJugador, 3 * anchoCanvas / 4, grosorMarco / 2); // Puntaje jugador (lado derecho)

    // Movimiento de la pelota
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Incrementar el ángulo para el efecto giratorio
    anguloPelota += velocidadRotacion;

    // Rebote de la pelota en los bordes superior e inferior (dentro del marco)
    if (pelotaY < grosorMarco || pelotaY > altoCanvas - grosorMarco) {
        velocidadPelotaY *= -1;
        if (sonidoRebote.isLoaded()) { // Verificar si el sonido está cargado
            sonidoRebote.play(); // Reproducir sonido cuando la pelota rebota en el marco
        }
    }

    // Rebote de la pelota en las raquetas
    if (pelotaX < 20 && pelotaY > posicionRaquetaIzquierda && pelotaY < posicionRaquetaIzquierda + raquetaAlto) {
        velocidadPelotaX *= -1;
        if (sonidoRebote.isLoaded()) {
            sonidoRebote.play(); // Reproducir sonido cuando la pelota rebota en la raqueta izquierda
        }
    }

    if (pelotaX > anchoCanvas - 20 && pelotaY > posicionRaquetaDerecha && pelotaY < posicionRaquetaDerecha + raquetaAlto) {
        velocidadPelotaX *= -1;
        if (sonidoRebote.isLoaded()) {
            sonidoRebote.play(); // Reproducir sonido cuando la pelota rebota en la raqueta derecha
        }
    }

    // Incrementar puntajes cuando la pelota sale del canvas por los lados
    if (pelotaX < 0) {
        puntajeJugador++; // Punto para el jugador si la pelota sale por la izquierda
        sonidoBordeVertical.play(); // Reproduce el sonido de borde vertical
        narrarPuntaje(`Jugador: ${puntajeJugador}, Computadora: ${puntajeComputadora}`);
        reiniciarPelota();
    }

    if (pelotaX > anchoCanvas) {
        puntajeComputadora++; // Punto para la computadora si la pelota sale por la derecha
        sonidoBordeVertical.play(); // Reproduce el sonido de borde vertical
        narrarPuntaje(`Computadora: ${puntajeComputadora}, Jugador: ${puntajeJugador}`);
        reiniciarPelota();
    }

    // Movimiento automático de la raqueta izquierda para seguir la pelota
    if (pelotaY > posicionRaquetaIzquierda + raquetaAlto / 2) {
        posicionRaquetaIzquierda += 3; // Velocidad de la raqueta automática
    } else if (pelotaY < posicionRaquetaIzquierda + raquetaAlto / 2) {
        posicionRaquetaIzquierda -= 3;
    }

    // Limitar el movimiento de la raqueta izquierda
    posicionRaquetaIzquierda = constrain(posicionRaquetaIzquierda, grosorMarco, altoCanvas - raquetaAlto - grosorMarco);

    // Movimiento de la raqueta derecha (controlada por el jugador)
    posicionRaquetaDerecha += velocidadRaquetaDerecha;

    // Limitar el movimiento de la raqueta derecha
    posicionRaquetaDerecha = constrain(posicionRaquetaDerecha, grosorMarco, altoCanvas - raquetaAlto - grosorMarco);
}

function reiniciarPelota() {
    // Reiniciar la pelota en el centro después de un punto
    pelotaX = anchoCanvas / 2;
    pelotaY = altoCanvas / 2;
    velocidadPelotaX *= -1; // Cambiar la dirección de la pelota
}

function keyPressed() {
    // Controles de la raqueta derecha
    if (keyCode === UP_ARROW) {
        velocidadRaquetaDerecha = -5;
    } else if (keyCode === DOWN_ARROW) {
        velocidadRaquetaDerecha = 5;
    }
}

function keyReleased() {
    // Detener la raqueta derecha cuando se suelta la tecla
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        velocidadRaquetaDerecha = 0;
    }
}
