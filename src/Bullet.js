import Phaser from "phaser"

let Bullet = new Phaser.Class({
    
    Extends: Phaser.GameObjects.Image,
    
    initialize: function Turret(scene){
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet')
        this.dx = 0
        this.dy = 0
        this.lifespan = 0
        this.speed = Phaser.Math.GetSpeed(600,1)
    },

    fire: function(x, y, angle){
        this.setActive(true)
        this.setVisible(true)

        this.setPosition(x, y)

        this.dx = Math.cos(angle)
        this.dy = Math.sin(angle)

        this.lifespan = 300
    },

    update: function(time, delta){

        this.x += this.dx * (this.speed * delta)
        this.y += this.dy * (this.speed * delta)
    
        this.lifespan -= delta
        if(this.lifespan <= 0) {
            this.setActive(false)
            this.setVisible(false)
        }
    }
})

export default Bullet