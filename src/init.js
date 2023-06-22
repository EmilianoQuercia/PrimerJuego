import { Bootloader } from "./bootloader.js";
import { Menu } from "./scenes/menu.js";
import { ScenaJuego } from "./scenes/scenaJuego.js";


const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 600,

    },
    backgroundColor: '#000000',
    parent: 'container',
    scene: [Bootloader, Menu, ScenaJuego],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);