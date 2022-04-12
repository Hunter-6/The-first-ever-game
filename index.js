const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");


canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7


const background = new Sprite({
    position : {
        x: 0,
        y: 0
    },
    imageSrc : "./img/background/background.png",

})

const shop = new Sprite({
    position : {
        x: 630,
        y: 130
    },
    imageSrc : "./img/background/shop.png",
    scale : 2.75,
    framesMax : 6

})

const player = new Fighter({
    position : {
        x : 100,
        y : 0
    },
    velocity : {
        x : 0,
        y : 10
    },
    offset : {
        x : 0,
        y :0
    },
    imageSrc : "./Colour2/Outline/120x80_PNGSheets/_Idle.png",
    framesMax: 10,
    scale : 3,
    offset : {
        x : 190,
        y: 90
    },
    sprites: {
        idle :{
            imageSrc : "./Colour2/Outline/120x80_PNGSheets/_Idle.png",
            framesMax : 10
        },
        run : {
            imageSrc : "./Colour2/Outline/120x80_PNGSheets/_Run.png",
            framesMax : 10
        },
        jump : {
            imageSrc : "./Colour2/Outline/120x80_PNGSheets/_Jump.png",
            framesMax : 3
        },
        fall : {
            imageSrc : "./Colour2/Outline/120x80_PNGSheets/_Fall.png",
            framesMax : 3
        },
        attack2 : {
            imageSrc : "./Colour2/Outline/120x80_PNGSheets/_AttackCombo.png",
            framesMax : 10
        },
        takeHit : {
            imageSrc : "./Colour2/Outline/120x80_PNGSheets/_Hit.png",
            framesMax : 1
        },
        death : {
            imageSrc : "./Colour2/Outline/120x80_PNGSheets/_Death.png",
            framesMax : 10
        }
    },
    attackBox : {
        offset : {
            x: -50,
            y:50 
        },
        width : 190,
        height : 50
    }
})



const enemy = new Fighter({
    position : {
        x : 850,
        y : 100
    },
    velocity : {
        x : 0,
        y : 0
    },
    offset : {
        x : -50,
        y : 0
    },
    imageSrc : "./img/kenji/Idle.png",
    framesMax: 4,
    scale : 2.5,
    offset : {
        x : 125,
        y: 170
    },
    sprites: {
        idle :{
            imageSrc : "./img/kenji/Idle.png",
            framesMax : 4
        },
        run : {
            imageSrc : "./img/kenji/Run.png",
            framesMax : 8
        },
        jump : {
            imageSrc : "./img/kenji/Jump.png",
            framesMax : 2
        },
        fall : {
            imageSrc : "./img/kenji/Fall.png",
            framesMax : 2
        },
        attack2 : {
            imageSrc : "./img/kenji/Attack1.png",
            framesMax : 4
        },
        takeHit : {
            imageSrc : "./img/kenji/Take hit.png",
            framesMax : 3
        },
        death : {
            imageSrc : "./img/kenji/Death.png",
            framesMax : 7
        }
    },
    attackBox : {
        offset : {
            x: -50,
            y:50 
        },
        width : 190,
        height : 50
    }
})
enemy.draw()

console.log(player)

const keys = {
    a: {
        pressed : false
    },
    d: {
        pressed : false
    },
    ArrowLeft: {
        pressed : false
    },
    ArrowRight: {
        pressed : false 
    },
}


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = "rgba(255, 255, 255, 0.13)"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


    // player move
    
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5
        player.switchSprite("run")
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5
        player.switchSprite("run")
    } else {
        player.switchSprite('idle')
    }

    // jump 
    if (player.velocity.y < 0 ) {
       player.switchSprite("jump")
    } else if ( player.velocity.y > 0 ) {
        player.switchSprite("fall")
    }

    // Enemy move
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
        enemy.switchSprite("run")
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
        enemy.switchSprite("run")
    } else {
        enemy.switchSprite('idle')
    }

    // jump 
    if (enemy.velocity.y < 0 ) {
        enemy.switchSprite("jump")
     } else if ( enemy.velocity.y > 0 ) {
         enemy.switchSprite("fall")
     }

    // detect fightin
    if ( rectangularCollision ({
        rectangular1 : player,
        rectangular2 : enemy
    }) &&
        player.isAttacking  ) {
        enemy.takeHit()
        player.isAttacking = false
        
        gsap.to("#enemyHealth", {
            width : enemy.health + "%"
        })
    }


    if ( rectangularCollision ({
        rectangular1 : enemy,
        rectangular2 : player
    }) &&
        enemy.isAttacking ) {
        player.takeHit()
        enemy.isAttacking = false
        
        gsap.to("#playerHealth", {
            width : player.health + "%"
        })
    }

    // the game end based on health
    if ( enemy.health <= 0 || player.health <= 0 ) {
        determineWinner({player, enemy, timerId})

    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {

    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = "d"
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = "a"
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
    }
}
    if (!enemy.dead) {
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = "ArrowRight"
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = "ArrowLeft"
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case "ArrowDown":  
            enemy.attack()
            break
    }
}
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break  
    }

    // enemy here
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    console.log(event.key);
})