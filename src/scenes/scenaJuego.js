import { Bala } from "../gameObjets/balas.js";

export class ScenaJuego extends Phaser.Scene {
    constructor() {
        super({ key: "ScenaJuego" });
        this.menuScena;
    }
    create() {

        this.vidaNave = 4
        this.municionInicial = 4
        this.velocidadNave = 800
        this.minAsteroide = 2
        this.maxAsteroide = 4
        this.velocidadCaida = 5
        this.tiempoAparicion = 600;
        this.probabilidadEnergia = 20
        this.municionExtra = 5
        this.puntaje = 0

        //codigo para el boton de pantalla completa
        this.botonFullScreen = this.add.image(1150, 40, 'botonFull').setDepth(0.1).setScale(0.5)
        this.botonFullScreen.setInteractive().on('pointerdown', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        })


        this.nave = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 50, 'nave');
        this.nave.vida = this.vidaNave
        this.nave.municion = this.municionInicial
        this.nave.setCollideWorldBounds(true);

        this.sonidoDisparo = this.sound.add('disparo')
        this.sonidoDaño = this.sound.add('daño')
        this.sonidoEnergia = this.sound.add('energia')


        this.textoVida = this.add.text(10, 10, '', {
            font: '20px Arial',
            fill: '#FFFFFF'
        }).setDepth(0.1);//setDepth(0.1) para que se vea por encima de los asteroides

        this.actulizarTexto();

        this.asteroides = this.physics.add.group({
            defaultKey: 'asteroides',
            frame: 0,
            maxSize: 50,
        });




        this.balas = this.physics.add.group({
            classType: Bala,
            maxSize: 10,
            runChildUpdate: true
        });

        this.bolasEnergia = this.physics.add.group({
            defaultKey: 'energia',
            maxSize: 20,
        })



        this.time.addEvent({
            delay: this.tiempoAparicion,
            loop: true,
            callback: () => {
                this.generarAsteoides()
            },
        })


        this.physics.add.overlap(this.nave, this.asteroides, this.colisionNaveAsteroide, null, this);
        this.physics.add.overlap(this.balas, this.asteroides, this.colicionBalaAsteroide, null, this);
        this.physics.add.overlap(this.nave, this.bolasEnergia, this.colicionNaveEnergia, null, this);

        this.derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //controles tactiles

        this.teclaPresionada = true

        this.btnIzquierda = this.add.image(50, 540, 'botonIzquierda').setDepth(0.1).setScale(1.75)
        this.btnDerecha = this.add.image(200, 540, 'botonDerecha').setDepth(0.1).setScale(1.75)
        this.btnDisparar = this.add.image(1100, 540, 'botonDisparar').setDepth(0.1)

        this.btnIzquierda.setInteractive().on('pointerdown', () => {
            this.nave.body.setVelocityX(-this.velocidadNave);
            this.teclaPresionada = false
        }).on('pointerup', () => {
            this.nave.body.setVelocityX(0);
        })

        this.btnDerecha.setInteractive().on('pointerdown', () => {
            this.nave.body.setVelocityX(this.velocidadNave);
            this.teclaPresionada = false
        }).on('pointerup', () => {

            this.nave.body.setVelocityX(0);
        })

        this.btnDisparar.setInteractive().on('pointerdown', () => {
            if (this.nave.municion > 0) {

                this.disparar(this.balas, this.nave, this.sonidoDisparo)
            }
        })


    }

    update(time, delta) {
        //Movimiento de Asteroides
        Phaser.Actions.IncY(this.asteroides.getChildren(), this.velocidadCaida);//Incrementa la posicion Y de todos los asteroides
        this.asteroides.children.iterate((asteroide) => {
            if (asteroide.y > this.game.config.height) {
                this.asteroides.killAndHide(asteroide) //Desactiva el asteroide
            }
        })

        //Movimiento de balasEnergia

        Phaser.Actions.IncY(this.bolasEnergia.getChildren(), this.velocidadCaida);//Incrementa la posicion Y de todos los asteroides
        this.bolasEnergia.children.iterate((bolaEnergia) => {
            if (bolaEnergia.y > this.game.config.height) {
                this.bolasEnergia.killAndHide(bolaEnergia) //Desactiva el asteroide
            }
        })



        //controles
        if (this.izquierda.isDown || this.derecha.isDown) {
            this.teclaPresionada = true;
            if (this.izquierda.isDown) {
                this.nave.body.setVelocityX(-this.velocidadNave);
            } else if (this.derecha.isDown) {
                this.nave.body.setVelocityX(this.velocidadNave);
            }
        } else if (this.teclaPresionada) {
            this.teclaPresionada = false;
            this.nave.body.setVelocityX(0);
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.nave.municion > 0) {
            this.disparar(this.balas, this.nave, this.sonidoDisparo)
        }
    }

    generarAsteoides() {
        let numAsteroides = Phaser.Math.Between(this.minAsteroide, this.maxAsteroide)

        for (let i = 0; i < numAsteroides; i++) {
            let asteroide = this.asteroides.get();
            if (asteroide) {
                asteroide.setActive(true).setVisible(true);
                asteroide.setFrame(Phaser.Math.Between(0, 1));
                asteroide.y = -100;
                asteroide.x = Phaser.Math.Between(0, this.game.config.width);
                this.physics.add.overlap(asteroide, this.asteroides, (asteroideEnColicion) => {
                    asteroideEnColicion.x = Phaser.Math.Between(0, this.game.config.width);
                })
            }
        }

        let numeroProbababilidad = Phaser.Math.Between(1, 100)

        if (numeroProbababilidad <= this.probabilidadEnergia) {
            let energia = this.bolasEnergia.get();
            if (energia) {
                energia.setActive(true).setVisible(true);
                energia.y = -100;
                energia.x = Phaser.Math.Between(0, this.game.config.width);
                this.physics.add.overlap(energia, this.asteroides, (energiaEnColicion) => {
                    energiaEnColicion.x = Phaser.Math.Between(0, this.game.config.width);
                })
            }
        }
    }

    colisionNaveAsteroide(nave, asteroide) {
        if (asteroide.active) {
            this.asteroides.killAndHide(asteroide);
            asteroide.setActive(false);
            asteroide.setVisible(false);
            this.sonidoDaño.play();
            if (nave.vida > 0) {
                nave.vida--;
                if (nave.vida == 0) {
                    // this.scene.start('gameOver');
                    // this.scene.start('gameOver', {puntos: this.nave.puntos});
                    this.finPartida();
                }
            }
            this.actulizarTexto();

        }
    }

    colicionBalaAsteroide(bala, asteroide) {
        if (bala.active && asteroide.active) {
            this.balas.killAndHide(bala);
            bala.setActive(false);
            bala.setVisible(false);
            this.asteroides.killAndHide(asteroide);
            asteroide.setActive(false);
            asteroide.setVisible(false);
            this.puntaje += 10;
            this.actulizarTexto();
        }
    }

    colicionNaveEnergia(nave, energia) {
        if (energia.active) {
            this.bolasEnergia.killAndHide(energia);
            energia.setActive(false);
            energia.setVisible(false);
            this.nave.municion += this.municionExtra;
            this.sonidoEnergia.play();
            this.actulizarTexto();
        }
    }

    actulizarTexto() {
        this.textoVida.setText(`Vida: ${this.nave.vida}\nMunicion: ${this.nave.municion} \nPuntos: ${this.puntaje}`);
    }



    finPartida() {
        this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'GAME OVER', {
            fontSize: '60px',
            fill: '#fff',
            stroke: '#000',
            backgroundColor: '#f00',
            padding: 20,
        }).setOrigin(0.5);




        this.scene.pause();
        setTimeout(() => {
            this.scene.stop();
            this.scene.start('Menu');
        }, 3000);
    }

    disparar() {
        let bala = this.balas.get();

        if (bala) {
            this.sonidoDisparo.play();
            bala.fire(this.nave.x, this.nave.y);
            this.nave.municion--;
            this.actulizarTexto();
        }
    }

} 