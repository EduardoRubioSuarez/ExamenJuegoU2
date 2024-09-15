const my_canvas = document.getElementById('my_canvas');
const ctx = my_canvas.getContext('2d');
var tecla;
var carros = [];

var carroArriba = new Image();
carroArriba.src = "./media/ImgArriba.png";
var carroAbajo = new Image();
carroAbajo.src = "./media/ImgAbajo.png";
var carroIzquierda = new Image();
carroIzquierda.src = "./media/ImgIzquierda.png";
var carroDerecha = new Image();
carroDerecha.src = "./media/ImgDerecha.png";

class carro {
    constructor(x, y, w, h, s, t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.s = s;
        this.t = t;
    }

    colision(otroCarro) {
        if (this.x < otroCarro.x + otroCarro.w &&  
            this.x + this.w > otroCarro.x &&    
            this.y < otroCarro.y + otroCarro.h &&    
            this.y + this.h > otroCarro.y) { 
            return true;
        } else {
            return false;
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
        carros.push(new carro(x, y, 100, 100, 7, tipo));
    }
}

console.log(carros);


function update() {
    /*
    carros.forEach(function(carro) {
        if (carro.colision(otroCarro)) {
            // Reiniciar la posición si colisiona
        }

        if (player.colision(obstaculo)) {
            if (tecla == "up") {
                player.y += player.s; // w
            }
        }
    });
    */ 
}

function pintar() {
    // Pinta el fondo del juego usando el tamaño actual del canvas
    ctx.fillStyle = "rgb(56, 56, 56)";
    ctx.fillRect(0, 0, my_canvas.width, my_canvas.height);

    // Pinta la matriz de carros
    carros.forEach(function(carro) {
        if(carro.t == "arriba"){
            ctx.drawImage(carroArriba,carro.x , carro.y, carro.w, carro.h);
        }if(carro.t == "abajo"){
            ctx.drawImage(carroAbajo,carro.x , carro.y, carro.w, carro.h);
        }if(carro.t == "izquierda"){
            ctx.drawImage(carroIzquierda,carro.x , carro.y, carro.w, carro.h);
        }if(carro.t == "derecha"){
            ctx.drawImage(carroDerecha,carro.x , carro.y, carro.w, carro.h);
        }
    });

   
    update();
    requestAnimationFrame(pintar);
}

document.addEventListener("keypress", (e) => {
    if (!pause) {
        if (e.keyCode == 119) {
            tecla = "up"; // w
        }
    }
});

requestAnimationFrame(pintar);
