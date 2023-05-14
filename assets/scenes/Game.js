export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
    }

    Init() {}

    Preload() {
        this.load.image("sky", "./assets/image/sky.png");
        this.load.image("platform", "./assets/image/platform.png")
        this.load.image("ninja". "./assets/image/ninja.png")
        this.load.image("square", "./assets/image/square.png")

    }

    Create() {
        //add background
        this.add.image(400, 300. "sky").setScale(0.555);

        //add static platforms
        let platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, "platform").setScale(2).refreshBody();

        //add shapes
        this.shapesGroup = this.physics.add.group();
        this.shapesGroup.create(100,0, "square");
        this.shapesGroup.create(200, 0, "diamond");
        this.shapesGroup.create(300, 0, "triangle");

        //add player
        this.player = this.physics.add.sprite(100, 450,"ninja");
        this.player.setCollideWorldBounds(true);

    }
ñ
    update() {}
}