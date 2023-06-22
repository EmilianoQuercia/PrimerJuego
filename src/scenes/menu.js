export class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "Menu" });

    }


    create() {


        this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Asteroides", { font: "80px Arial", fill: "#ffffff" }).setOrigin(0.5);

        this.add.image(this.game.config.width / 2, this.game.config.height - 100, "Empezar").setInteractive().on('pointerdown', () => {
            this.scene.start("ScenaJuego");
        });




    }



}