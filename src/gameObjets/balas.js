export class Bala extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bala');
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.speed = Phaser.Math.GetSpeed(400, 1);
    }

    fire(x, y) {
        this.setPosition(x, y - 50);
        this.setActive(true);
        this.setVisible(true);
    }

    update(time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -50) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}