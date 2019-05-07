import Phaser from "phaser";
//import logoImg from "./assets/logo.png";
//import Enemy from "./Enemy"
//import Turret from "./Turret"
import Bullet from "./Bullet"

const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config)
let graphics
let path
let enemies, turrets, bullets

let Enemy = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function Enemy(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'enemy')
        this.follower = {
            t: 0,
            vec: new Phaser.Math.Vector2()
        }
    },

    startOnPath: function () {
        this.hp = 100
        this.follower.t = 0
        path.getPoint(this.follower.t, this.follower.vec)
        this.setPosition(this.follower.vec.x, this.follower.vec.y)
    },

    receiveDamage: function (damage) {
        this.hp -= damage
        if (this.hp <= 0) {
            this.setActive(false)
            this.setVisible(false)
        }
    },

    update: function (time, delta) {
        this.follower.t += 1 / 10000 * delta
        path.getPoint(this.follower.t, this.follower.vec)
        this.setPosition(this.follower.vec.x, this.follower.vec.y)

        if (this.follower.t >= 1) {
            this.setActive(false)
            this.setVisible(false)
        }
    }
})


let Turret = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function Turret(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'turret')
        this.nextTic = 0
    },

    place: function (i, j) {
        this.x = j * 64 + 32
        this.y = i * 64 + 32
        //map[i][j] = 1
    },

    fire: function () {
        let enemy = getEnemy(this.x, this.y, 100)
        if (enemy) {
            let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)
            addBullet(this.x, this.y, angle)
            this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
        }
    },

    update: function (time, delta) {
        if (time > this.nextTic) {
            this.fire()
            this.nextTic = time + 1000
        }
    }
})


function placeTurret(pointer) {
    let i = Math.floor(pointer.y / 64)
    let j = Math.floor(pointer.x / 64)
    if (/*canPlaceTurret(i, j)*/true) {
        let turret = turrets.get()
        if (turret) {
            turret.setActive(true)
            turret.setVisible(true)
            turret.place(i, j)
        }
    }
}

function addBullet(x, y, angle) {
    let bullet = bullets.get()
    if (bullet) {
        bullet.fire(x, y, angle)
    }
}

function getEnemy(x, y, distance) {
    let enemiesss = enemies.getChildren()
    for (let e of enemiesss) {
        let enemyDistance = Phaser.Math.Distance.Between(x, y, e.x, e.y)
        if (e.active && enemyDistance < distance) {
            return e
        }
    }

    return false
}


function damageEnemy(enemy, bullet) {
    //console.log(enemy, bullet)
    if (enemy.active && bullet.active) {
        bullet.setActive(false)
        bullet.setVisible(false)

        enemy.receiveDamage(30)
    }
}


function preload() {
    this.load.image('turret', 'assets/turret.png')
    this.load.image('enemy', 'assets/enemy.png')
    this.load.image('bullet', 'assets/bullet.png')

}

function create() {

    let graphics = this.add.graphics()

    path = this.add.path(90, -30)
    path.lineTo(90, 160)
    path.lineTo(480, 160)
    path.lineTo(480, 500)

    graphics.lineStyle(3, 0xffffff, 1)

    path.draw(graphics)

    enemies = this.physics.add.group({
        classType: Enemy,
        runChildUpdate: true
    })

    turrets = this.add.group({
        classType: Turret,
        runChildUpdate: true
    })

    bullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    })

    this.physics.add.overlap(enemies, bullets, damageEnemy)

    this.input.on('pointerdown', placeTurret)

    this.nextEnemy = 0
}

function update(time, delta) {
    if (time > this.nextEnemy) {
        let enemy = enemies.get()
        if (enemy) {
            enemy.setActive(true)
            enemy.setVisible(true)
            enemy.startOnPath()

            this.nextEnemy = time + 2000
        }
    }
}
