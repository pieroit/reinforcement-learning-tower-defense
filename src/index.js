import Phaser from "phaser";
import Enemy  from "./Enemy"
import Turret from "./Turret"
import Bullet from "./Bullet"

const config = {
    type: Phaser.AUTO,
    parent: "phaser",
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
let path, enemies, turrets, bullets

function placeTurret(pointer) {
    let i = Math.floor(pointer.y / 64)
    let j = Math.floor(pointer.x / 64)
    if (/*canPlaceTurret(i, j)*/true) {
        let turret = turrets.create(enemies, bullets)
        if (turret) {
            turret.setActive(true)
            turret.setVisible(true)
            turret.place(i, j)
        }
    }
}

function damageEnemy(enemy, bullet) {
    //console.log(enemy, bullet)
    if (enemy.active && bullet.active) {
        // damage enemy
        enemy.receiveDamage(bullet.damage)
        
        // update reward and next environment state
        let reward    = bullet.damage
        let nextState = bullet.shooterTurret.getNearEnemies().length
        bullet.shooterTurret.learn(reward, nextState)
        
        bullet.destroy()
    }
}


function preload() {
    this.load.image('turret', 'assets/turret.png')
    this.load.image('enemy', 'assets/enemy.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.image('sniper', 'assets/sniper.png')
    this.load.image('automatic', 'assets/automatic.png')

}

function create() {

    let graphics = this.add.graphics()

    path = this.add.path(50, -30)
    path.lineTo(50, 160)
    path.lineTo(600, 160)
    path.lineTo(600, 500)

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
        let enemy = enemies.create(path)
        if (enemy) {
            enemy.setActive(true)
            enemy.setVisible(true)
            enemy.startOnPath()

            // alternate dense enemies to rare enemies
            let seconds = Math.round(time/1000)
            let secondsFromMinute = seconds % 60
            let enemyInterval = 25 * secondsFromMinute + 500
            this.nextEnemy = time + ( Math.random() * enemyInterval )
        }
    }
}
