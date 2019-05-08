import Phaser from "phaser"
import Qtable from "./Qtable"

let Turret = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function Turret(scene, enemies, bullets) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'turret')
        this.enemies      = enemies
        this.bullets      = bullets
        this.qLearner     = new Qtable(20, 3)
        this.nextTic      = 0
    },

    place: function (i, j) {
        this.x = j * 64 + 32
        this.y = i * 64 + 32
        //map[i][j] = 1
    },

    fire: function(time) {
        let nearEnemies = this.getNearEnemies(this.x, this.y, 100)
        if (nearEnemies.length > 0) {
            let nearestEnemy   = nearEnemies[0]
            let numNearEnemies = nearEnemies.length
            
            // get next action
            let bulletTypeIndex = this.qLearner.getAction(numNearEnemies)
            
            let bullet = this.bullets.create(bulletTypeIndex, this)
            let angle = Phaser.Math.Angle.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y)
            if (bullet) {
                bullet.fire(this.x, this.y, angle)
                this.nextTic = time + bullet.delay
            }
            this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
        }
    },

    learn: function(reward, nextState) {
        this.qLearner.learn(reward, nextState)
    },

    getNearEnemies: function(x, y, distance) {
        let enemiesss = this.enemies.getChildren()
        let nearEnemies = []
        for (let e of enemiesss) {
            let enemyDistance = Phaser.Math.Distance.Between(x, y, e.x, e.y)
            if (e.active && enemyDistance < distance) {
                e.enemyDistance = enemyDistance
                nearEnemies.push(e)
            }
        }

        // sort by nearest
        nearEnemies = nearEnemies.sort(function(a,b){
            return a.enemyDistance - b.enemyDistance
        })
    
        return nearEnemies
    },

    update: function (time, delta) {
        if (time > this.nextTic) {
            this.fire(time)
        }
    }
})

export default Turret