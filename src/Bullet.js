import Phaser from "phaser"

let Bullet = new Phaser.Class({
    
    Extends: Phaser.GameObjects.Image,
    
    initialize: function Bullet(scene, bulletTypeIndex, shooterTurret){
        
        let bulletTypes = [
            {
                name  : 'sniper',
                damage: 30,
                speed : Phaser.Math.GetSpeed(500,1),
                delay : 1000
            },
            {
                name  : 'automatic',
                damage: 15,
                speed : Phaser.Math.GetSpeed(800,1),
                delay : 100
            },
            {
                name  : 'bomb',
                damage: 100,
                speed : Phaser.Math.GetSpeed(200,1),
                delay : 2000
            }
        ]
    
        let bulletType = bulletTypes[bulletTypeIndex]
        //console.log(bulletType)
        Phaser.GameObjects.Image.call(this, scene, 0, 0, bulletType.name)
        this.dx = 0
        this.dy = 0
        this.lifespan   = 0
        this.bulletName = bulletType.name
        this.damage     = bulletType.damage
        this.speed      = bulletType.speed
        this.delay      = bulletType.delay
        
        // keep track of the turret firing the bullet
        this.shooterTurret = shooterTurret
    },

    fire: function(x, y, angle){
        this.setActive(true)
        this.setVisible(true)

        this.setPosition(x, y)

        this.dx = Math.cos(angle)
        this.dy = Math.sin(angle)

        this.lifespan = 2000
    },

    update: function(time, delta){

        this.x += this.dx * (this.speed * delta)
        this.y += this.dy * (this.speed * delta)
    
        this.lifespan -= delta
        if(this.lifespan <= 0) {
            this.setActive(false)
            this.setVisible(false)

            // if the bullet missed, negative reward
            let reward    = -this.damage
            let nextState = this.shooterTurret.getNearEnemies().length
            this.shooterTurret.learn(reward, nextState)
        }
    }
})

export default Bullet