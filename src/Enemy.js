import Phaser from "phaser"

let Enemy = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function Enemy(scene, path) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy')
        this.path = path
        this.follower = {
            t: 0,
            vec: new Phaser.Math.Vector2()
        }
    },

    startOnPath: function(path) {
        this.hp = 100
        this.follower.t = 0
        this.path.getPoint(this.follower.t, this.follower.vec)
        this.setPosition(this.follower.vec.x, this.follower.vec.y)
    },

    receiveDamage: function (damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.destroy()
        }
    },

    update: function (time, delta) {
        this.follower.t += 1 / 10000 * delta
        this.path.getPoint(this.follower.t, this.follower.vec)
        this.setPosition(this.follower.vec.x, this.follower.vec.y)

        if (this.follower.t >= 1) {
            this.destroy()
        }
    }
})

export default Enemy