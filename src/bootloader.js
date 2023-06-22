export class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: "Bootloader" });
    }
    preload() {
        this.load.image('nave', 'assets/sprites/nave.png');
        this.load.spritesheet('asteroides', './assets/sprites/asteroides.png', { frameWidth: 64, frameHeight: 64 })
        this.load.image('bala', 'assets/sprites/bala.png');
        this.load.image('energia', 'assets/sprites/energia.png')

        this.load.image('botonFull', 'assets/sprites/iconoPantalla.png')
        this.load.image('Empezar', 'assets/sprites/play.png')


        //botonesMoviles

        this.load.image('botonIzquierda', 'assets/sprites/btnIzq.png')
        this.load.image('botonDerecha', 'assets/sprites/btnDer.png')
        this.load.image('botonDisparar', 'assets/sprites/btnDisparo.png')

        this.load.audio('disparo', 'assets/sonidos/disparo.wav')
        this.load.audio('daño', 'assets/sonidos/damage.wav')
        this.load.audio('energia', 'assets/sonidos/recarga_energia.wav')

        this.load.on('complete', () => {
            this.scene.start('Menu')
        }
        )
    }
}