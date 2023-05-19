// import ENUMS from "../utils.js";
import {
  PLAYER_MOVEMENTS,
  SHAPE_DELAY,
  SHAPES,
  TRIANGULO,
  ROMBO,
  CUADRADO,
  ROMBOMALO,
  POINTS_PERCENTAGE_VALUE_START,
  POINTS_PERCENTAGE
} from "../../utils.js";

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    this.shapesRecolected = {
      ["Triangulo"]: { count: 0, score: 10 },
      ["Cuadrado"]: { count: 0, score: 20 },
      ["Rombo"]: { count: 0, score: 30 },
      ["RomboMalo"]: {count: 0, score: -10}
    };``
    this.scoreTotal = 0;
    this.isWinner = false;
    this.isGameOver = false;
    this.leftTime = 30;
  }

  preload() {
    // cargar fondo, plataformas, formas, jugador
    this.load.image("sky", "./assets/images/Cielo.png");
    this.load.image("platform", "./assets/images/platform.png");
    this.load.image("platformmini", "./assets/images/platformmini.png");
    this.load.image("player", "./assets/images/Ninja.png");
    this.load.image(TRIANGULO, "./assets/images/Triangulo.png");
    this.load.image(ROMBO, "./assets/images/Rombo.png");
    this.load.image(CUADRADO, "./assets/images/Cuadrado.png");
    this.load.image(ROMBOMALO, "./assets/images/RomboMalo.png");
  }

  create() {
    // create game objects
    // add sky background
    this.add.image(400, 300, "sky").setScale(0.555);

    // agregado con fisicas
    // add sprite player
    this.player = this.physics.add.sprite(400, 500, "player");

    // add platforms static group
    this.platformsGroup = this.physics.add.staticGroup();
    this.platformsGroup.create(400, 568, "platform").setScale(2).refreshBody();
    this.platformsGroup.create(200, 250, "platformmini").setScale(1).refreshBody();
    this.platformsGroup.create(600, 300, "platformmini").setScale(1).refreshBody();
    this.platformsGroup.create(320, 420, "platformmini").setScale(1).refreshBody();
    // add shapes group
    this.shapesGroup = this.physics.add.group();

    // add collider between player and platforms
    this.physics.add.collider(this.player, this.platformsGroup);

    // add collider between platforms and shapes
    this.physics.add.collider(this.shapesGroup, this.platformsGroup);

    // add overlap between player and shapes
    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape, // funcion que llama cuando player choca con shape
      null, //dejar fijo por ahora
      this //dejar fijo por ahora
    );

    //add overlap between shapes and platforms
    this.physics.add.overlap(
      this.shapesGroup,
      this.platformsGroup,
      this.reduce,
      null,
      this
    );


    // create cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // create event to add shapes
    this.time.addEvent({
      delay: SHAPE_DELAY,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });

    //add text score
    this.scoreText = this.add.text(16, 16, "T: 0 / C: 0 / R: 0 / Score: " + this.scoreTotal, {
      fontSize: "20px",
      fill: "#1af",
    });

    //add text time
    this.timeText = this.add.text(16, 40, "Time: " + this.leftTime, {
      fontSize: "20px",
      fill: "#1af",
    });

    // create event timer
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    // check if game over or win
    if (this.isWinner) {
      this.scene.start("winner");
    }

    if (this.isGameOver) {
      this.scene.start("gameOver");
    }

    // update game objects

    // update player left right movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_MOVEMENTS.x);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_MOVEMENTS.x);
    } else {
      this.player.setVelocityX(0);
    }

    // update player jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-PLAYER_MOVEMENTS.y);
    }
  }

  // Desarrollar un videojuego que, inicialmente, cuente con una plataforma inferior, donde se posicione el jugador.

  // Desde la parte superior de la pantalla deberán caer items recolectables en forma de cuadrados, triángulos y rombos, de forma aleatoria con intervalos de un segundo.

  // Condición para GANAR: juntar al menos 2 ítems de cada tipo. La acumulación de objetos se deberá persistir en un estructura de datos “array”. Al momento de recolectar un nuevo elemento se deberá verificar la condición de victoria.
  // Mejora 1: Adicionar un contador de tiempo descendente. Al llegar a 0, el jugador PIERDE.
  // Mejora 2: Asignar un puntaje distinto a cada elemento recolectable. Condición de GANAR: superar los 100 puntos.
  // Mejora 3: Reducir intervalo entre cada aparición de un nuevo item a 0.5 segundos. En cada rebote con el piso, descontar 1 punto al objeto. Si llega a 0, desaparece.
  // Mejora 4: Agregar más plataformas a la escena.
  // Mejora 5: Agregar un nuevo tipo de objeto que al recolectar descuenta puntos.

  collectShape(jugador, figuraChocada) {
    // remove shape from screen
    const shapeName = figuraChocada.texture.key;
    console.log("figura recolectada: " + shapeName);
    figuraChocada.disableBody(true, true);
    this.shapesRecolected[shapeName].count++;
    this.scoreTotal+=this.shapesRecolected[shapeName].score //this.scoreTotal + this.shapesRecolected.score;
    console.log("score: " + this.scoreTotal);
    // update score text
    this.scoreText.setText(
      "T: " +
      this.shapesRecolected[TRIANGULO].count +
      " / C: " +
      this.shapesRecolected[CUADRADO].count +
      " / R: " +
      this.shapesRecolected[ROMBO].count +
      " / Score: " +
      this.scoreTotal
    );

    // check if winner
    // take two of each shape

    if (
      (this.shapesRecolected[TRIANGULO].count >= 2 &&
      this.shapesRecolected[CUADRADO].count >= 2 &&
      this.shapesRecolected[ROMBO].count >= 2) ||
      this.scoreTotal === 100
    ) {
      this.isWinner = true;
    }
  }

  addShape() {
    // get random shape
    const randomShape = Phaser.Math.RND.pick(SHAPES);

    // get random position x
    const randomX = Phaser.Math.RND.between(0, 800);

    // add shape to screen
    this.shapesGroup.create(randomX, 0, randomShape)
    .setCircle(32, 0, 0)
    .setBounce(0.8)
    .setData(POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START);

    console.log("shape is added", randomX, randomShape);

  }

  /**
 * The reduce function decreases the percentage of points for a given shape and disables it if the
 * percentage reaches zero, while also displaying a text indicating the reduction.
 */
  reduce(shape, platform){
    const newPercentage = shape.getData(POINTS_PERCENTAGE) - 0.25;
    console.log(shape.texture.key, newPercentage);
    shape.setData(POINTS_PERCENTAGE, newPercentage);
    if (newPercentage <= 0) {
      shape.disableBody(true, true);
      return;
    }
  }

  updateTime() {
    this.leftTime--;
    this.timeText.setText("Time: " + this.leftTime);
    if (this.leftTime === 0) {
      this.isGameOver = true;
    }
  }

  
}