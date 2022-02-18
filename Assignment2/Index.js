//making a 2d canvas
const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d")

//To make the canvas fit the screen
canvas.width = innerWidth
canvas.height = innerHeight

//Constants
const scoreElement = document.querySelector('#scoreElement')
const startGameBtn = document.querySelector('#startGameBtn')
const modalElement = document.querySelector('#modalElement')
const saveScoreBtn = document.querySelector('#saveScoreBtn')
const storageInput = document.querySelector('#storageInput')
const bigScoreElement = document.querySelector('#bigScoreElement')


//To store info in local storage
document.getElementById('saveScoreBtn').addEventListener('click', function(){
    localStorage.setItem('savedScore', score)
})
document.getElementById('saveScoreBtn').addEventListener('click', function(){
    localStorage.setItem('Attempts', 'No')
})
var NoAttempts = document.getElementById('saveScoreBtn').addEventListener('click', function(){
    localStorage.getItem('Attempts')
})

//Timer
const countdown = () => {
    const newDate = new Date('February 21, 2022 00:00:00').getTime
    const currentTime = new Date().getTime()
    const gap = countDate - currentTime

    if(gap = 86400000){
        localStorage.removeItem('savedScore')
    }
    else if (gap = 0){
        localStorage.clear()
        newDate + 604800000//miliseconds in a week
    }
}

//Object class Player for all Players to have these properties
class Player{
    constructor(x, y, radius, color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

//Maps the item into the page
    draw(){
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
    }
}

//Object class for all projectiles
class Projectile{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
//Maps the item into the page
    draw(){
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
    }
//manipulating properties
    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

//Object class for all enemies
class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
//Maps the item into the page
    draw(){
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
    }
//manipulating properties
    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

//Class for particle effects
const friction = 0.98
class Particle{
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
//Maps the item into the page
    draw(){
        context.save()
        context.globalAlpha = this.alpha
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
        context.restore()
    }
//manipulating properties
    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction 
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}

//Placing the Player in the middle 
const x = canvas.width / 2
const y = canvas.height / 2

//Variables
let player = new Player(x, y, 20, 'white')
let projectiles = []
let enemies = []
let particles = []

//Initialising the game
function init(){
    player = new Player(x, y, 20, 'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreElement.innerHTML = score
    bigScoreElement.innerHTML = score
}
function refresh(){
    location.reload(true)
}
//function for spawning enemies
function spawnEnemies(){
    setInterval(()=>{
//randomising size
        const radius = Math.random() * (30-8) + 8

        let x
        let y
//randomising spawn location
        if (Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }
        else{
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            x = Math.random() * canvas.width
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(
            canvas.height/2 - y, 
            canvas.width/2 - x
        )
    
        const velocity ={
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}


let animationID
let score = 0
//Function to animate movement
function animate(){
    animationId = requestAnimationFrame(animate)
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0){
            particles.splice(index, 1)
        }
        else{
            particle.update()
        }
        particle.update()
    })
    projectiles.forEach((projectile, index) =>{
        projectile.update()

        if (projectile.x - projectile.radius < 0){
        setTimeout(()=>{
            projectiles.splice(index, 1)
            }, 0)
    }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(
            player.x - enemy.x, 
            player.y - enemy.y
        )

//endgame
        if (dist - enemy.radius - player.radius< 1){
            cancelAnimationFrame(animationId)
            modalElement.style.display = 'flex'
            bigScoreElement.innerHTML = score     
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(
                projectile.x - enemy.x, 
                projectile.y - enemy.y
            )

//collision detection 
            if (dist - enemy.radius - projectile.radius< 1){

//explosion effects
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            projectile.x, projectile.y, Math.random() * 2, enemy.color, {
                                x: (Math.random() - 0.5) * (Math.random() * 8), 
                                y: (Math.random() - 0.5) * (Math.random() * 8)
                            }
                        )
                    )
                }
                if (enemy.radius - 10 > 7) {
//Scoreing
                score += 100
                scoreElement.innerHTML = score
                    gsap.to(enemy, { radius: enemy.radius - 10})
                    setTimeout(()=>{
                        projectiles.splice(projectileIndex, 1)
                        }, 0)
                }
                else {
                score += 250
                scoreElement.innerHTML = score
                setTimeout(()=>{
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
                }, 0)
                }
            }
        })
    })
}
//Math for trigonometry to calculate projectile movement 
addEventListener('click', (event) => { 
    console.log(projectiles)
    const angle = Math.atan2(
        event.clientY - canvas.height/2, 
        event.clientX - canvas.width/2
    )

    const velocity ={
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4
    }
    projectiles.push(
        new Projectile(
            canvas.width/2, canvas.height/2, 5, 'white', velocity
        )
    )     
})

//Starting the game on click
startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalElement.style.display = 'none'
    secondTime='false'
})
