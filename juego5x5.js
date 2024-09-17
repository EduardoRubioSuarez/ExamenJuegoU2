(function() {
    const my_canvas = document.getElementById('my_canvas');
    const ctx = my_canvas.getContext('2d');
    var carros = [];
    var startTime = Date.now();
    var elapsedTime = 0;
    var gameActive = true;
    var victoria = false;
    var cambiosDeDireccion = 0;
    var sonidoVictoria = new Audio("./media/musicaVictoria.mp3");
    var musicaFondo = document.getElementById('musicaFondo');
    var carroArriba = new Image();
    carroArriba.src = "./media/ImgArriba.png";
    var carroAbajo = new Image();
    carroAbajo.src = "./media/ImgAbajo.png";
    var carroIzquierda = new Image();
    carroIzquierda.src = "./media/ImgIzquierda.png";
    var carroDerecha = new Image();
    carroDerecha.src = "./media/ImgDerecha.png";
    var sound = new Audio("./media/moveSound.mp3");
    var imagenGanaste = new Image();
    imagenGanaste.src = "./media/imagenGanaste.jpeg";

    var animationId;

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
            this.image = this.asignarImagen();
        }

        asignarImagen() {
            switch (this.t) {
                case "arriba":
                    return carroArriba;
                case "abajo":
                    return carroAbajo;
                case "izquierda":
                    return carroIzquierda;
                case "derecha":
                    return carroDerecha;
                default:
                    return carroArriba;
            }
        }

        isClicked(clickX, clickY) {
            return (
                clickX > this.x &&
                clickX < this.x + this.w &&
                clickY > this.y &&
                clickY < this.h + this.y
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

        moverEnDireccionContraria() {
            let newX = this.x;
            let newY = this.y;
            let direccionContraria = false;

            if (this.t === "arriba") {
                newY += this.s;
                this.t = "abajo";
            } else if (this.t === "abajo") {
                newY -= this.s;
                this.t = "arriba";
            } else if (this.t === "izquierda") {
                newX += this.s;
                this.t = "derecha";
            } else if (this.t === "derecha") {
                newX -= this.s;
                this.t = "izquierda";
            }

            const tempX = this.x;
            const tempY = this.y;
            this.x = newX;
            this.y = newY;

            if (this.estaChocandoConOtro()) {
                this.x = this.originalX;
                this.y = this.originalY;
                this.moving = false;
                sound.pause();
            } else {
                this.x = newX;
                this.y = newY;
                direccionContraria = true;
                cambiosDeDireccion += 1;
            }

            return direccionContraria;
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

            if (this.estaChocandoConOtro()) {
                this.x = tempX;
                this.y = tempY;
                let direccionContraria = this.moverEnDireccionContraria();

                if (!direccionContraria) {
                    this.x = this.originalX;
                    this.y = this.originalY;
                    this.moving = false;
                    sound.pause();
                }
            } else {
                this.x = newX;
                this.y = newY;
            }

            if (this.y <= -1000 || this.y >= 1000 || this.x <= -1000 || this.x >= 1000) {
                carros = carros.filter(carro => carro !== this);
            }
        }
    }

    function iniciarJuego() {
        const carSize = 80;
        const rows = 5;
        const cols = 5;
        const tipos = ["arriba", "abajo", "derecha", "izquierda"];
        const initialX = 150;
        const initialY = 50;

        carros = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let x = initialX + col * carSize;
                let y = initialY + row * carSize;
                let tipo = tipos[Math.floor(Math.random() * tipos.length)];
                carros.push(new Carro(x, y, 80, 80, 7, tipo));
            }
        }

        startTime = Date.now();
        elapsedTime = 0;
        gameActive = true;
        victoria = false;
        sonidoVictoria.pause();
        requestAnimationFrame(pintar);
    }

    function detenerJuego() {
        gameActive = false;
        sonidoVictoria.pause();
        sound.pause();
        musicaFondo.pause();

        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }

    function pintar() {
        ctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
        ctx.fillStyle = "rgb(56, 56, 56)";
        ctx.fillRect(0, 0, my_canvas.width, my_canvas.height);

        if (gameActive) {
            elapsedTime = (Date.now() - startTime) / 1000;
        }

        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.fillText(`Tiempo: ${elapsedTime.toFixed(2)}s`, my_canvas.width - 10, 30);

        carros.forEach(function(carro) {
            carro.update();
            ctx.drawImage(carro.image, carro.x, carro.y, carro.w, carro.h);
        });

        if (carros.length === 0 && gameActive && !victoria) {
            victoria = true;
            gameActive = false;
            musicaFondo.pause();
            sonidoVictoria.play();
            mostrarPantallaVictoria();
        }

        if (!victoria) {
            animationId = requestAnimationFrame(pintar);
        }
    }

    function mostrarPantallaVictoria() {
        ctx.drawImage(imagenGanaste, 0, 0, my_canvas.width, my_canvas.height);
        ctx.font = "40px Arial BOLD";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";
        ctx.fillText("FELICIDADES", 350, 80);
        ctx.fillText("ESCAPASTE DEL SUEÑO", 350, 120);

        ctx.font = "40px Arial";
        ctx.fillStyle = "WHITE";
        ctx.fillText(`Escapaste en: ${elapsedTime.toFixed(2)} segundos`, 350, 200);
        
        ctx.fillStyle = "red";
        ctx.fillText(`Reinicia el nivel antes de cambiar la dificultad`, 350, 300);

        ctx.fillStyle = "red";
        ctx.fillRect(250, 400, 200, 90);
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Reiniciar", 350, 455);
    }

    my_canvas.addEventListener("click", (e) => {
        const rect = my_canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        if (victoria) {
            if (clickX > 250 && clickX < 450 && clickY > 400 && clickY < 490) {
                iniciarJuego();
                musicaFondo.play();
            }
        } else {
            carros.forEach(function(carro) {
                if (carro.isClicked(clickX, clickY)) {
                    carro.handleClick();
                }
            });
        }
    });

    window.iniciarJuego5x5 = iniciarJuego;
    window.stopJuego5x5 = detenerJuego;

})();
