const my_canvas = document.getElementById('my_canvas');
const ctx = my_canvas.getContext('2d');
var carros = [];

var carroArriba = new Image();
carroArriba.src = "./media/ImgArriba.png";
var carroAbajo = new Image();
carroAbajo.src = "./media/ImgAbajo.png";
var carroIzquierda = new Image();
carroIzquierda.src = "./media/ImgIzquierda.png";
var carroDerecha = new Image();
carroDerecha.src = "./media/ImgDerecha.png";

// Cargar un sonido (reemplazar con tu archivo de sonido)
var sound = new Audio("./media/moveSound.mp3");

class Carro {
    constructor(x, y, w, h, s, t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.s = s; 
        this.t = t;
        this.moving = false;
    }

    // Método para verificar si el carro fue clickeado
    isClicked(clickX, clickY) {
        return (
            clickX > this.x &&
            clickX < this.x + this.w &&
            clickY > this.y &&
            clickY < this.y + this.h
        );
    }

    handleClick() {
        console.log(`Clickeaste en un carro de tipo: ${this.t}`);
        this.moving = true;
        sound.play();
    }

    // Actualiza la posición del carro dependiendo de su tipo
    updatePosition() {
        if (!this.moving) return; // Si no está en movimiento, salir

        if (this.t === "arriba" && this.y > -1000) {
            this.y -= this.s; // Mover hacia arriba
        } else if (this.t === "abajo" && this.y < 1000) {
            this.y += this.s; // Mover hacia abajo
        } else if (this.t === "izquierda" && this.x > -1000) {
            this.x -= this.s; // Mover hacia la izquierda
        } else if (this.t === "derecha" && this.x < 1000) {
            this.x += this.s; // Mover hacia la derecha
        }

        if (this.y <= -1000 || this.y >= 1000 || this.x <= -1000 || this.x >= 1000) {
            this.moving = false;
            sound.pause();
        }
    }
}

// Tamaño de cada celda del arreglo 3x3
const carSize = 100;
const rows = 3;
const cols = 3;
const tipos = ["arriba", "abajo", "derecha", "izquierda"];
const initialX = 200;
const initialY = 100;

// Llenar el arreglo de carros
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let x = initialX + col * carSize;
        let y = initialY + row * carSize;
        let tipo = tipos[Math.floor(Math.random() * tipos.length)];
        carros.push(new Carro(x, y, 100, 100, 7, tipo));
    }
}

function pintar() {
    ctx.fillStyle = "rgb(56, 56, 56)";
    ctx.fillRect(0, 0, my_canvas.width, my_canvas.height);

    // Pinta la matriz de carros y actualiza su posición si están en movimiento
    carros.forEach(function(carro) {
        carro.updatePosition();

        if (carro.t == "arriba") {
            ctx.drawImage(carroArriba, carro.x, carro.y, carro.w, carro.h);
        } else if (carro.t == "abajo") {
            ctx.drawImage(carroAbajo, carro.x, carro.y, carro.w, carro.h);
        } else if (carro.t == "izquierda") {
            ctx.drawImage(carroIzquierda, carro.x, carro.y, carro.w, carro.h);
        } else if (carro.t == "derecha") {
            ctx.drawImage(carroDerecha, carro.x, carro.y, carro.w, carro.h);
        }
    });

    requestAnimationFrame(pintar);
}

my_canvas.addEventListener("click", (e) => {
    // Obtiene las coordenadas del clic relativo al canvas
    const rect = my_canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Verificar si algún carro fue clickeado
    carros.forEach(carro => {
        if (carro.isClicked(clickX, clickY)) {
            carro.handleClick();
        }
    });
});

requestAnimationFrame(pintar);
