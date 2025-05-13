import './style.css'
import Phaser, { Physics, Scene } from 'phaser'

const size = {
    width: 500,
    height: 500
}

const speedDown = 300

class GameScene extends Phaser.Scene{
    constructor(){
        super("scene-game")
        this.player
        this.cursor
        this.playerSpeed = speedDown + 50
        // target = apple
        this.target
        // hit
        this.point = 0
        // score
        this.textScore
    }

    preload(){
        // preload image in scene
        this.load.image("bg","/assets/bg.png" )
        this.load.image("basket", "/assets/basket.png")
        this.load.image("apple", "/assets/apple.png")
    }
    create(){
        // (background) create objects in the scene and set the origin position
        this.add.image(0, 0, "bg").setOrigin(0,0)
        // (player) set movable to player and speed in scene even postion
        this.player = this.physics.add.image(5, size.height-100, "basket").setOrigin(0, 0)
        this.player.setImmovable(true)
        this.player.body.allowGravity = false
        // (player) we set this line for make sure the basket will not out of the scene
        this.player.setCollideWorldBounds(true)
        // (player) determine hitbox
        this.player.setSize(this.player.width - this.player.width/4, this.player.height/6).
        setOffset(this.player.width/10, this.player.height - this.player.height/10);
        // (target) set target in the scene and movable
        this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0)
        // (target) set max velocity of target when fall
        this.target.setMaxVelocity(0, speedDown)
        // (player) collision detection
        this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)
        // (player) Input from keyboard
        this.cursor = this.input.keyboard.createCursorKeys()
        // (player) counting score
        this.textScore = this.add.text(size.width - 120, 10, "Score: 0", {
            font: "25px Arial",
            fill: "#000000",
        });
    }
    update(){
        // (target) determine the target that use to fall and random fall
        /* (target) we set condition if the target is out of the scene we will let the 
        target comeback to origin that is set(Y) = 0 */
        if(this.target.y >= size.height){
            this.target.setY(0);
            this.target.setX(this.getRandomX())
        }
        // (player) control their own keyboard for left and right direction
        const {left, right} = this.cursor

        if(left.isDown){
            this.player.setVelocityX(-this.playerSpeed)
        }else if (right.isDown){
            this.player.setVelocityX(this.playerSpeed)
        }else{
            this.player.setVelocityX(0)
        }
    }
    /* (target) random target fall function, we mean fall actually 
     so that we will x - axis instead */
    getRandomX(){
        return Math.floor(Math.random() * 480)
    }
    /* when target overlap with playter the target will set to y = 0 and the target will
    auto random x position to drop again. */
    targetHit(){
        this.target.setY(0);
        this.target.setX(this.getRandomX())
        this.point += 1
        this.textScore.setText("Score: " + this.point)
    }
}

const config ={
    // config size for the game
    type: Phaser.WEBGL,
    width: size.width,
    height: size.height,
    canvas: gameCanvas,
    // Adding physics in game
    physics:{
        default: "arcade",
        arcade:{
            // value gravity in the y-axis
            gravity: {y:speedDown},
            debug: true
        }
    },
    scene:[GameScene]
}

const game = new Phaser.Game(config)