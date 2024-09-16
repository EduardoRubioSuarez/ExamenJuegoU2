(function() {
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
            this.originalX = x;
            this.originalY = y;
        }

        isClicked(clickX, clickY) {
            return (
                clickX > this.x &&
                clickX < this.x + this.w &&
                clickY > this.y &&
                clickY < this.y + this.h
            );
        }

        handleClick() {
            if (!this.estaChocandoConOtro()) {
                this.moving = true;
                sound.play();
            }
        }

        estaChocando(otroCarro) {
            return (
                this.x < otroCarro.x + otroCarro.w &&
                this.x + this.w > otroCarro.x &&
                this.y < otroCarro.y + otroCarro.h &&
                this.y + this.h > otroCarro.y
            );
        }

        estaChocandoConOtro() {
            return carros.some(otroCarro => otroCarro !== this && this.estaChocando(otroCarro));
        }

        update() {
            if (!this.moving) return;

            let newX = this.x;
            let newY = this.y;

            if (this.t === "arriba" && this.y > -1000) {
                newY -= this.s;
            } else if (this.t === "abajo" && this.y < 1000) {
                newY += this.s;
            } else if (this.t === "izquierda" && this.x > -1000) {
                newX -= this.s;
            } else if (this.t === "derecha" && this.x < 1000) {
                newX += this.s;
            }

            const tempX = this.x;
            const tempY = this.y;
            this.x = newX;
            this.y = newY;

            if (this.estaChocandoConOtro() && this.x < 900 && this.x > -900 && this.y < 900 && this.y > -900) {
                this.x = this.originalX;
                this.y = this.originalY;
                this.moving = false;
                sound.pause();
            } else {
                this.x = newX;
                this.y = newY;
            }

            if (this.y <= -1000 || this.y >= 1000 || this.x <= -1000 || this.x >= 1000) {
                this.moving = false;
            }
        }
    }

    const carSize = 100;
    const rows = 3;
    const cols = 3;
    const tipos = ["arriba", "abajo", "derecha", "izquierda"];
    const initialX = 200;
    const initialY = 100;
   // var musicaFondo;

    carros = [];
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

        carros.forEach(function(carro) {
            carro.update();
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

        gameInstance = requestAnimationFrame(pintar);

    }

    my_canvas.addEventListener("click", (e) => {
        const rect = my_canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        carros.forEach(carro => {
            if (carro.isClicked(clickX, clickY)) {
                carro.handleClick();
            }
        });
    });

    requestAnimationFrame(pintar);
    /*
    myMusic = new sound("gametheme.mp3");
    myMusic.play();
     */
})();
