import kaboom from './libs/kaboom.mjs';
import { LEVELS_JS } from './scripts/levels.js';

//"use strict";

kaboom({
    debug: true
})

loadSprite("hell_grass", "sprites/backgrounds/misc/hell_grass.png");

//loadSprite("metal_sand", "sprites/textures/metal_wall.png")


// GLOBAL: can be used anywhere
loadSprite("player", "sprites/character/player.png", {
    sliceX: 4,
    sliceY: 2,
    scale: 1,
    anims: {
        run: {
            from: 0,
            to: 3,
            speed: 6,
            loop: true
        },
        idle: {
            from: 4, 
            to: 5,
            speed: 3,
            loop: true
        }
    }
})
loadSprite("ejector", "sprites/textures/ejector.png")
loadSprite("chest", "sprites/textures/chest.png")
loadSprite("spawner", "sprites/textures/spawner.png")
loadSprite("note", "sprites/textures/note.png", {
    sliceX: 2,
    sliceY: 1,
    scale: 0.8,
    anims: {
        "bounce": {
            from: 0,
            to: 1,
            speed: 3,
            loop: true
        }
        
    }
})
loadSprite("bullet", "sprites/textures/bullet.png")
loadSprite("bullet-explosion", "sprites/textures/bullet-explosion.png")
loadSprite("activator", "sprites/textures/activator.png")
loadSprite("stationer", "sprites/textures/stationer.png")
loadSprite("portal", "sprites/textures/portal.png")
loadSprite("portalShard", "sprites/textures/portalShard.png", {
    sliceX: 2,
    sliceY: 1,
    scale: 1,
    anims: {
        sparkle: {
            from: 0,
            to: 1,
            speed: 1,
            loop: true
        }
    }
})


// LEVEL 1
loadSprite("dark_tile", "sprites/textures/level-1/lvl1-tile-up_scaled_3x_pngcrushed.png")
loadSprite("level-1-bg", "sprites/backgrounds/level-1-bg.png")
loadSprite("level-1-enemy", "sprites/enemies/level-1-enemy.png", {
    sliceX: 4,
    sliceY: 1,
    scale: 1,
    anims: {
        move: {
            from: 0,
            to: 3,
            speed: 4,
            loop: true
        },
        idle: {
            from: 0,
            to: 0,
            speed: 2,
            loop: true
        }
    }
})

// LEVEL 2
loadSprite("sand_tile", "sprites/textures/level-2/sand.png")
loadSprite("sandbrick_tile", "sprites/textures/level-2/sandbrick.png")
loadSprite("level-2-bg", "sprites/backgrounds/level-2-bg.png")
loadSprite("sandpillar_tile", "sprites/textures/level-2/sandpillar.png")
loadSprite("desert-fig", "sprites/textures/level-2/desert-fig.png", {
    sliceX: 3,
    sliceY: 1,
    scale: 1,
    anims: {
        sway: {
            from: 0,
            to: 2,
            speed: 6,
            loop: true
        }
    }
})
loadSprite("level-2-enemy", "sprites/enemies/level-2-enemy.png", {
    sliceX: 4,
    sliceY: 1,
    scale: 1,
    anims: {
        move: {
            from: 0,
            to: 3,
            speed: 4,
            loop: true
        },
        idle: {
            from: 1,
            to: 2,
            speed: 2,
            loop: true
        }
    }
})

// LEVEL 3
loadSprite("lava", "sprites/textures/level-3/lava.png", {
    sliceX: 4,
    sliceY: 1,
    scale: 1,
    anims: {
        burn: {
            from: 0,
            to: 3,
            speed: 10,
            loop: true
        }
    }
})
loadSprite("level-3-bg", "sprites/backgrounds/level-3-bg.png")


// LEVEL 4
loadSprite("level-4-bg", "sprites/backgrounds/level-4-bg.png")
loadSprite("level-4-enemy", "sprites/enemies/level-4-enemy.png", {
    sliceX: 4,
    sliceY: 1,
    scale: 1,
    anims: {
        move: {
            from: 0,
            to: 3,
            speed: 4,
            loop: true
        },
        idle: {
            from: 0,
            to: 0,
            speed: 2,
            loop: true
        }
    }
})

// LEVEL 5

// font
loadFont("myFont", "fonts/DotGothic16-Regular.ttf")


// global vars
const GRAVITY = 1400
const LEVELS = LEVELS_JS;
const PLAYER_HEALTH = 200
const BASE_PLAYER_SPEED = 400
let JUMP_STRENGTH = 670;

const GUN_DAMAGE = 50;
const BULLET_SPEED = 1200

const SPAWNER_LIMIT = 3;
let currentLevel = 3;    





scene("main_menu", () => {
    setBackground(23, 23, 23)

    const title = add([
        text("ESCAPE FROM THE UNKNOWN", {font: "myFont"}),
        pos(width()/2, height()/2- 100),
        anchor("center"),
        scale(2)
    ])

    onKeyPress("enter", () => {
        go("game", LEVELS[currentLevel])
    })
})

scene("ending_scene", () => {
    setBackground(155, 144, 155)
})

scene("failed", (causeOfDeath) => {
    setBackground(23, 23, 23);

    const title = add([
        text("YOU DIED", {font: "myFont"}),
        pos(width()/2, height()/2- 100),
        anchor("center"),
        scale(2)
    ])

    const causeOfDeathLabel = add([
        text("cause of death: "+causeOfDeath, {font: "myFont"}),
        pos(width()/2, height()/2- 20),
        anchor("center"),
        scale(1)
    ])

    onKeyPress("enter", () => {
        go("game", LEVELS[currentLevel])
    })
})

scene("game", (LEVEL) => {

    setGravity(GRAVITY)
    
    // BACKGROUND
    const bg = add([
        sprite(LEVEL.backgroundSprite),
        z(-1),
        anchor("center"),
        fixed(),
        pos(width()/2, height()/2),
        scale(LEVEL.backgroundScale)
    ])
    
    /* -------------------------- level setup --------------------------*/


    const createPlayer = () => {
        return [
            sprite("player"),
            area(),
            body(),
            health(PLAYER_HEALTH),
            anchor("bot"),
            scale(2.7),
            // player properties
            {
                // status
                health: PLAYER_HEALTH,
                oxygen: 200,
                // items
                inventory: {
                    portal_shards: 0,
                    healing_potions: 1,
                    tools: [

                    ]
                },
                weapons: {
                    gun: true
                },
                // abilities
                jumpMultiplier: 1,
                speedMultiplier: 1,
                // misc
                helmetOn: true,
                // 
                canGoToNextLevel: true // by default
            },
            "player"
        ]
    }

    
    const createEnemy = () => {
        if (LEVEL.hasEnemy) {
            return [
                sprite(`level-${currentLevel+1}-enemy`, {flipY: getGravity() == GRAVITY ? false : true}),
                area(),
                body(),
                //pos(x, y),
                anchor("bot"),
                health(rand(100, 200)),
                scale(LEVEL.enemyScale),
                offscreen({hide: true}),
                {
                    agro: false
                },
                "enemy"
            ]
        } else {
            return;
        }
    };
    
    
    const createNote = (text) => {
        return [
            sprite("note"),
            area(),
            body({isStatic: true}),
            anchor("bot"),
            scale(2.3), {
                text: text,
            },
            "note",
        ]
    }

    const level = addLevel(LEVEL.map, {
        tileWidth: 48,
        tileHeight: 48,
        tiles: {
            // DARK TILE
            "=" : () => [
                sprite("dark_tile"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(1),
                tile({ isObstacle: true }),
                offscreen({hide: true}),
                "solid"
            ],
            // UPSIDE DOWN DARK TILE
            "-" : () => [
                sprite("dark_tile", {flipY: true}),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(1),
                tile({ isObstacle: true }),
                offscreen({hide: true}),
                "solid"
            ],
            // SAND
            "2" : () => [
                sprite("sand_tile"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                //tile({ isObstacle: true }),
                offscreen({hide: true}),
                "solid"
            ],
            // SAND BRICK
            "3" : () => [
                sprite("sandbrick_tile"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                //tile({ isObstacle: true }),
                offscreen({hide: true}),
                "solid"
            ],
            "|" : () => [
                sprite("sandpillar_tile"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                //tile({ isObstacle: true }),
                offscreen({hide: true}),
                "solid"
            ],
            // SPIKE
            "^" : () => [
                sprite("hell_grass"),
                color(BLACK),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(1.5),
                offscreen({hide: true}),
                "spike"
            ],
            // EJECTOR
            "B" : () => [
                sprite("ejector"),
                area(),
                body(),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "ejector", "movable"
            ],
            // CHEST
            "C" : () => [
                sprite("chest"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "chest"
            ],
            // PORTAL
            "@" : () => [
                sprite("portal"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "portal",
            ],
            // ACTIVATOR
            ")" : () => [
                sprite("activator"),
                area(),
                body(),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "activator", "movable"
            ],
            // STATIONER
            "(" : () => [
                sprite("stationer", {flipY: true}),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "stationer"
            ],
            "~" : () => [
                sprite("lava"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "lava"
            ],
            "*" : () => [
                sprite("portalShard"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "portalShard"
            ],
            // creates enemy
            "!" : () => createEnemy(),
            // CREATES MORE ENEMY :3
            "S" : () => [
                sprite("spawner"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "spawner"
            ],
            // spawns player
            "P" : () => createPlayer(),
            // creates note
            "&" : () => createNote(LEVEL.levelNote.text),
            // desert-fig
            "F" : () => [
                sprite("desert-fig"),
                area(),
                body({isStatic: true}),
                anchor("bot"),
                scale(3),
                offscreen({hide: true}),
                "desertfig"
            ]
        }
    })


    /* --------------------- PLAYER ------------------------- */
    // setting the tag player as a workable object
    const player = level.get("player")[0];

    player.onUpdate(() => {
        camPos(player.pos)
    })

    
    /* --------------------- MOVEMENT ----------------------------*/
    let left = -BASE_PLAYER_SPEED;
    let right = BASE_PLAYER_SPEED;

    let unFlipped = false;
    let flipped = true;

    onKeyDown("a", () => {
        player.move(left * player.speedMultiplier, 0);
        player.flipX = flipped;
        player.play("run")
    })
    onKeyRelease("a", () => {
        player.play("idle")
    })
    
    onKeyDown("d", () => {
        player.move(right * player.speedMultiplier, 0);
        player.flipX = unFlipped;
        player.play("run")
    })
    onKeyRelease("d", () => {
        player.play("idle")
    })

    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump(JUMP_STRENGTH * player.jumpMultiplier)
        }
    })

    

    /* --------------------- SOME FUNCS -----------------------*/
    // INIT UI

    const ui = add([
        fixed(),
        z(99)
    ])
    
    // DAMAGE PLAYER
    async function damagePlayer(amount) {
        await player.hurt(amount);
        if ((player.health - amount) < 0) {
            player.health = 0;
        } else {
            player.health -= amount;
        }
    }

    // the player gets healed every 10 seconds
    async function passivelyHealPlayer(amount) {
        loop(10, async () => {
            await player.heal(amount);
            if ((player.health + amount) > PLAYER_HEALTH) {
                player.health += PLAYER_HEALTH - player.health;
            } else {
                player.health += amount;
            }
        })
    }
    passivelyHealPlayer(20)
    


    // GUN ATTACK
    async function fireGun(dir) {
        return add([
            sprite("bullet"),
            scale(1.5),
            area(),
            pos(player.pos.sub(0, 40)),
            move(dir, BULLET_SPEED),
            offscreen({destroy: true}),
            {DIR: dir}, // wala direction data sa gin butang ko na lang diri
            "bullet"
        ])
    }

    // its set up like that para ma reverse naton ang values during the gravity flip
    let fireGunRIGHT = 0;
    let fireGunLEFT = 180;  

    onMousePress("left", () => {
        if(player.flipX == flipped) {
            fireGun(fireGunLEFT);
        } else {
            fireGun(fireGunRIGHT);
        }
    })

    // when you die
    
    onUpdate(async () => {
        if (player.health <= 0) {
            await wait(0.7)
            await go("failed", "murder")
        }
    })

    // function i got from kaboomjs website 
    // the rate at which the particles will be scaled
    function grow(rate) {
		return {
			update() {
				const n = rate * dt() // mul by dt so the time becomes consistent
				this.scale.x += n
				this.scale.y += n
			},
		}
	}
    // spawns a particle for exploosionss
	function addExplode(p, num, rad, size) {
		for (let i = 0; i < num; i++) {
			wait(rand(num * 0.1), () => {
				for (let i = 0; i < 2; i++) {
					add([
						pos(p.add(rand(vec2(-rad), vec2(rad)))),
						sprite("bullet-explosion"),
						scale(1 * size, 1 * size),
						lifespan(0.2),
						grow(rand(9, 30) * size),
						anchor("center"),
					])
				}
			})
		}
	}


    // if enemy gets shot 
    onCollide("enemy", "bullet", (e, b) => {
        addExplode(b.pos,1, 1, 1)   // add some exploding
        e.hurt(GUN_DAMAGE)          // hurt the enemy
        destroy(b)                  // and remove the bullet like nothing happened
    })

    // if a bullet hits a wall
    onCollide("solid", "bullet", (s, b) => {
        addExplode(b.pos, 1, 1, 1)  // add some exploding
        destroy(b)                  // remove the evidence
    })


    // If a bullet gets shot on a movable object it apparently defys newtons third law of motion and propels the object.. backward! ?
    onCollide("movable", "bullet", function(m, b) {
        if(b.DIR === fireGunLEFT) {
            m.pos.x += 10;
        } else if (b.DIR === fireGunRIGHT) {
            m.pos.x -= 10
        }
        destroy(b)  // also remove the evidence
    })



    /* ----------------- TILE ANIMATIONS -------------------*/
    // DESERT FIG
    if (level.get("desertfig")) {
        for(const desertfig of level.get("desertfig")) {
            desertfig.play("sway")
        }
    }
    
    // NOTES
    for(const note of level.get("note")) {
        note.play("bounce")
    }


    for(const portalShard of level.get("portalShard")) {
        portalShard.play("sparkle")
    }

    if (level.get("lava")) {
        for(const lava of level.get("lava")) {
            lava.play("burn")
        }
    }

    

    /* --------------------- EVENTS -------------------------- */
    
    // jumping on bouncer blocks
    onCollide("player", "ejector", () => {
        player.jumpMultiplier = 1.5;
    })
    onCollideEnd("player", "ejector", () => {
        player.jumpMultiplier = 1;
    });
    

    // spikes 
    onCollide("player", "spike", () => {
        damagePlayer(5) 
        shake(1)
        debug.log("ouch")   // aray
    })

    onCollide("player", "portalShard", (pl, ps) => {
        destroy(ps),
        addExclaim("obtained portal shard", pl.pos)
        player.inventory.portal_shards += 1;
        debug.log(player.inventory.portal_shards);
    })

    // lava
    onCollide("player", "lava", (p, l) => {
        go("failed", "toasted alive")
    })

      /* ----------------------- CHESTS ---------------------------------- */

    let currentChest = "";
    onCollide("player", "chest", (player, chest) => {
        currentChest = chest;
        onKeyPress("e", () => {
            if(LEVEL.item !== undefined) {
                player.inventory.tools.push(LEVEL.item);
                if(currentChest) {
                    destroy(currentChest);
                    addExclaim(`obtained ${LEVEL.item}`, player.pos)
                }
            }
        })
    })

    onCollideEnd("player", "chest", () => {
        currentChest = "";
    })


    onCollide("player", "portal", (pl, po) => {
        if (player.canGoToNextLevel == true) {
            if (currentLevel+1 !== LEVEL.length) {
                currentLevel += 1;
                go("game", LEVELS[currentLevel])
            } else {
                go("ending_scene")
            }
        } else {
            addExclaim("You cant yet enter", pl.pos)
        }   
    })

    
    
    /* ----------------------- DIALOG --------------------- */
    function addDialog() {
		const pad = 16  // padding
        const border = add([
            pos(width()/2, height()/2),
			rect(830, 510),
			color(255, 255, 255),
            anchor("center"),
			z(100),
            fixed()
        ])
		const bg = add([
			pos(border.pos),
			rect(820, 500),
			color(18, 32, 32),
            anchor("center"),
			z(100),
            fixed()
		])
		const txt = add([
			text("", {
				width: width(), font: "myFont"
			}),
			pos(width()/2 - 390, height()/2 + pad),
			z(100),
            fixed(),
            anchor('left'),
            scale(0.6)
		])
        // hides the sprites by default
        border.hidden = true;
		bg.hidden = true
		txt.hidden = true
		return {
			say(t) {
				txt.text = t
				bg.hidden = false
				txt.hidden = false
                border.hidden = false;
			},
			dismiss() {
				if (!this.active()) {
					return
				}
				txt.text = ""
				bg.hidden = true
				txt.hidden = true
                border.hidden = true;
			},
			active() {
				return !bg.hidden
			},
			destroy() {
				bg.destroy()
                border.destroy()
				txt.destroy()
			},
		}
	}

    function addExclaim(txt, p) {
        
        const bg = add([
            rect(150, 40), 
            pos(p.x, p.y-50),
            anchor("center"),
            color(18, 32, 32),
            lifespan(2),
            z(100),
        ])
        const t1xt = add([
            text(txt, {font: "myFont"}),
            pos(bg.pos),
            anchor("center"),
            scale(0.4),
            lifespan(2, {fade: 2}),
            z(100),
        ])
    }

    const dialog = addDialog() // initialize dialog per level

    player.onCollide("note", (note) => {
		dialog.say(note.text)
	})
    // when player moves away the dialog is removed
    player.onCollideEnd("note", (note) => {
        dialog.dismiss()
    })

    

    
    /* --------------------- GAME LOOP RELATED ------------------------ */
    /* ------------ Code that runs continously / onUpdate ------------- */


    /* -------- enemy spawner ---------- */
    
    
    // every spawner present will activate and spawn enemies
    async function activateEnemySpawners() {
        // loops every 9-12s 
        
        await loop(rand(9, 12), async () => {
            // if the number of enemies is less than: THE ENEMY LIMIT OF EACH SPAWNER COMBINED + ENEMIES THAT ALREADY SPAWNED IN THE LEVEL
            if (level.get("spawner").length > 0) {
                if(level.get("enemyFromSpawner").length <= (SPAWNER_LIMIT * level.get("spawner").length)) {
                    const spawner = level.get("spawner")
                    // loop through all the spawners and spawn enemies around a certain area
                    for(let i = 0; i < spawner.length; i++) {
                        const enemy = level.spawn("!", spawner[i].tilePos.sub(rand(2, -2), 1));
                        enemy.use("enemyFromSpawner")
                    }
                }
            }
        });
    }

    // checks if spawners do exist in this level
    if (level.get("spawner")) {
        
        activateEnemySpawners() // hindi paglimtan i run 
        
        // if player is next to a spawner and is carrying a pickaxe, the spawner will break
        let currentSpawner = "";
        player.onCollide("spawner", async (spawner) => {
            // to prevent all spawners from breaking in certain cases the current spawner is stored
            currentSpawner = spawner;
            await onKeyPress("r", function() {
                if (currentSpawner && spawner) {
                    // if the player has "pickaxe" in their inventory 
                    if (player.inventory.tools.includes("pickaxe") === true) {
                        addExplode(player.pos, 1, 1, 1)
                        destroy(spawner)
                    } else {
                        addExclaim("you need a pickaxe", player.pos)
                    }
                } 
            })
        })
        player.onCollideEnd("spawner", async () => {
            await wait(0.3) // since kis a ga jump ka, so may delay para ma catch gyapon
            currentSpawner = "";
        })
    }
    
    /* --------------------- ENEMY AI ----------------------- */
    // async function makeEnemyGoAfterPLayer() {
    //     for(const enemy of level.get("enemy")) {
    //         enemy.onEnterState("idle", async() => {
    //             if (
    //                 player.pos.y >= enemy.pos.y - 100 && 
    //                 player.pos.y <= enemy.pos.y + 20 && 
    //                 player.pos.x >= enemy.pos.x - 1000 && 
    //                 player.pos.x <= enemy.pos.x + 1000
    //             ) {
    //                 enemy.enterState("move")
    //             } else {
    //                 await enemy.move(rand(0, 180), 100)
    //                 enemy.agro = false;
    //             }
    //         })

    //         enemy.onEnterState("attack", async() => {
    //             if (!(
    //                 player.pos.y >= enemy.pos.y - 100 && 
    //                 player.pos.y <= enemy.pos.y + 20 && 
    //                 player.pos.x >= enemy.pos.x - 1000 && 
    //                 player.pos.x <= enemy.pos.x + 1000
    //             )) {
    //                 enemy.enterState("idle")
    //             } else {
    //                 await enemy.move((player.pos.sub(enemy.pos).unit()).scale(LEVEL.enemySpeed))
    //                 if ((player.pos.sub(enemy.pos).unit()).scale(1).x < 0) {
    //                     enemy.flipX = true;
    //                     debug.log("left")
    //                 } else {
    //                     enemy.flipX = false;
    //                     debug.log("right")
    //                 }
    //                 enemy.agro = true;
    //             }
    //         })
    //     }
    // }


    /* runs a function every frame where if the enemy sees me or
    if they see me within a certain y level and x range then they attack me */
    async function makeEnemyComeAfterPlayer() {
        await player.onUpdate(async function() {
            // for enemies that are spawned in the level
            for(const enemy of level.get("enemy")) {
                if (
                    // if player is within: 1000 px x, and between -100 and +20 px from the enemy
                    player.pos.y >= enemy.pos.y - 100 && 
                    player.pos.y <= enemy.pos.y + 20 && 
                    player.pos.x >= enemy.pos.x - 1000 && 
                    player.pos.x <= enemy.pos.x + 1000
                ) {
                    // attack
                    //debug.log("spotted")
                    await enemy.move((player.pos.sub(enemy.pos).unit()).scale(LEVEL.enemySpeed))
                    if ((player.pos.sub(enemy.pos).unit()).scale(1).x < 0) {
                        enemy.flipX = true;
                        debug.log("left")
                    } else {
                        enemy.flipX = false;
                        debug.log("right")
                    }
                    enemy.agro = true;
                    
                    
                } else {
                    // they just be roaming
                    enemy.agro = false;
                    await enemy.move(rand(-180, 180), 100)
                }

            }
        })
    }
    // run function
    makeEnemyComeAfterPlayer()

    // animates enemy
    loop(1, async() => {
        for(const enemy of level.get("enemy")) {
            if (enemy.agro) {
                await enemy.play("move")
            } else {
                await enemy.play("idle")
            }
        }
    })

    // when enemy dies they are expelled from reality
    on("death", "enemy", (e) => {
        destroy(e);
    })

    // enemy fire, when enemy fires bullets
    async function enemyFire() {
        // loops through all enemies
        for(const enemy of level.get("enemy")) {
            // enemy is agressive or the player has been seen
            if(enemy.agro) {
                return add([
                    pos(enemy.pos.sub(-20, 50)),
                    move(player.pos.sub(enemy.pos).unit(), BULLET_SPEED),
                    circle(5),
                    area(),
                    offscreen({ destroy: true }),
                    anchor("center"),
                    color(RED),
                    "enemybullet",
                ])
            }
        }
    }
    // run the enemy fire ever 1 second
    loop(1, async () => {
        enemyFire()
    })

    // when player collides with the bullet of the enemy the player is hurt
    player.onCollide("enemybullet", async ()=> {
        await damagePlayer(10)
    })

    onCollide("enemybullet", "solid", async (eb, s) => {
        await addExplode(s.pos, 0.5, 0.5, 0.5)
        await destroy(eb);
    })
    
  

    // fall off the map for some reason
    // more dying
    player.onUpdate(() => {
        // i think 5000 ang max
        if (player.pos.y > 5000 || player.pos.y < -5000) {
            go("failed", "falling into the void")
        }
    })

    

    async function reverseGravity() {
        let angle = 0; // var to store current angle para ma check in conditions
        await wait(10)  // waits 10 seconds before it starts the loop so hindi siya ma run at launch
        await loop(10, async function() {

            // para magbalik sa 0 and make our lives easier
            if (angle === 360) {
                angle = 0;
            }

            angle += 180; // change camera angle

            // reverses the gravity to the camRotation that matches
            if (angle === 180) {
                setGravity(GRAVITY*(-1))
            } else {
                setGravity(GRAVITY)
            }

            // funcs that makes sure that hindi weird when upside down
            await shake(10)             // *planet's core exploding*
            await camRot(angle);        // then i rotate
            await reverseControls()     // reverse controls
            await flipEntities();       // reverse sprites of entities
           
        })
    }
    
    function flipEntities() {
        if (getGravity() == GRAVITY) {
            player.flipY = false;
        } else {
            player.flipY = true;
        }
        
        for(const enemy of level.get("enemy")) {
            if(getGravity() == GRAVITY) {
                enemy.flipY = false;
            } else {
                enemy.flipY = true;
            }
        }
    }


    function reverseControls() {
        // reverse movement
        let temp1 = right;
        right = left;
        left = temp1;

        // reverse gun fire
        let temp2 = fireGunRIGHT;
        fireGunRIGHT = fireGunLEFT;
        fireGunLEFT = temp2
        //JUMP_STRENGTH *= (-1); // hindi pwede negative ang jump :<

        let temp3 = unFlipped;
        unFlipped = flipped;
        flipped = temp3
    }

    /* ---------------------- USER INTERFACE ----------------------- */

    

    var healthLabel = make([
        text("hp: "+player.health, {font: "myFont"}),
        pos(width()/40, height()/40),
        scale(0.9),
    ])

    var healthBar = make([
        rect(player.health*1.5, 30),
        pos(healthLabel.pos.x + 140, healthLabel.pos.y - 5),
        outline(3),
        color(WHITE),
        scale(1.05)
    ])

    // add ui elements
    ui.add(healthLabel)
    ui.add(healthBar)
    

    // handles ui updates when stuff changes
    ui.onUpdate(() => {
        healthLabel.text = "hp: "+player.health;
        healthBar.width = player.health*1.5;
        const p = player.health;
        if (p >= 150) {
            healthBar.color = WHITE;
        } else if (p <= 149 && p >= 100) {
            healthBar.color = GREEN;
        } else if (p <= 99 && p >= 50) {
            healthBar.color = YELLOW;
        } else if (p <= 49 && p >= 0) {
            healthBar.color = RED
        }
        
    })


    // level swicth
    let numberOfPortalShards = 0;
    let numberOfSpawners = 0;

    switch(LEVEL.level) {
        case 1:
            loop(0.8, () => {
                if (player.oxygen > 0) {
                    player.oxygen -= 2;
                }
            })
    
            var oxygenBar = make([
                text("Oxygen:"+player.oxygen, {font: "myFont"}),
                pos(healthLabel.pos.x, healthLabel.pos.y + 50),
                scale(0.8)
            ])
    
            ui.add(oxygenBar);
    
            oxygenBar.onUpdate(() => {
                oxygenBar.text = "Oxygen: "+player.oxygen
            })
    
            // when player sufficates
            function sufficate(amount) {
                loop(2, () => {
                    damagePlayer(amount)
                })
            }
    
            // if player does lose oxygen or oxygen is 0
            player.onUpdate(() => {
                if (player.oxygen < 1) {
                    sufficate(20);
                }
                if (player.health <= 0) {
                    go("failed", "suffication")
                }
            })
    
            numberOfPortalShards = level.get("portalShard").length;
    
            player.onUpdate(async() => {
                if(
                    level.get("spawner").length <= 0 && 
                    player.inventory.portal_shards == numberOfPortalShards
                ) {
                    player.canGoToNextLevel = true;
                } else {
                    player.canGoToNextLevel = false;
                    debug.log(`/n${level.get("spawner").length} /n${player.inventory.portal_shards} - ${numberOfPortalShards} /n`)
                }
            })
            
            
            camScale(1)
            break;
        case 2:

            // adds pickaxe to inventory
            player.inventory.tools.push("pickaxe")

            // slows the player down kay may hangin
            player.speedMultiplier = 0.5; 
            
            // for deserts and stuff
            let currentDesertFig  = "";
            onCollide("player", "desertfig", (player, desertfig) => {
                currentDesertFig = desertfig;
                onKeyPress("c", () => {
                    if (currentDesertFig) {
                        // if the player has "pickaxe" in their inventory 
                        if (player.inventory.tools.includes("shears") === true) {
                            addExplode(player.pos, 1, 1, 1)
                            destroy(currentDesertFig)
                        } else {
                            addExclaim("you need shears", player.pos)
                        }
                    } 
                })
            })

            onCollideEnd("player", "desertfig", () => {
                currentDesertFig = "";
            })

            
            camScale(1.2)
            break;
        case 3:

            let activated = 0;
            let areAllStationersActivated = false;
            numberOfPortalShards = level.get("portalShard").length;

            onCollide("activator", "stationer", () => {
                activated++;
                debug.log(activated)  
                if(activated >= level.get("stationer").length) {
                    areAllStationersActivated = true;
                    debug.log("can now enter")
                }
            })
            onCollideEnd("activator", "stationer", () => {
                activated--;
                debug.log(activated)
            })

            

            onUpdate(async() => {
                if(
                    player.inventory.portal_shards == numberOfPortalShards &&
                    areAllStationersActivated == true
                ) {
                    player.canGoToNextLevel = true;
                } else {
                    player.canGoToNextLevel = false;
                    
                }
                // debug.log(`
                //     Stationers: ${areAllStationersActivated} 
                //     ${player.inventory.portal_shards} / ${numberOfPortalShards}
                // `)
            })
            camScale(1.1)
            break;
            
        case 4:
            console.log("level4")

            reverseGravity()
            player.inventory.tools.push("pickaxe")
            player.inventory.tools.push("shears")

            break;
        case 5:
            console.log("level5")

            player.inventory.tools.push("pickaxe")
            player.inventory.tools.push("shears")
            
            break;
        default:
            console.log("Error level does not exist")
    }

})




// is this necessary????
document.addEventListener("DOMContentLoaded", () => {
    go("main_menu")
})

