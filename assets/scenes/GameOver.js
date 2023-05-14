export default class GameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
  
    init() {}
  
    preload() {}
  
    create() {
      this.add.text(400, 300, "GAME OVER");
    }
  
    update() {}
  }