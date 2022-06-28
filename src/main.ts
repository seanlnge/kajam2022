import { GameObj } from 'kaboom';
import kaboom from './kaboom';

const global = {
    deathMessages: [
        "You Couldn't Handle the Heat",
        "You Weren't Spicy Enough",
        "You Lost to a Vegetable",
        "L",
        "Go Outside",
        "Capsaicin Hurts, Doesn't It"
    ],
    peppers: {
        "reaper": { scoville: 2000000, sprite: "pepper" },
        "ghost": { scoville: 1500000, sprite: "pepper" },
        "habanero": { scoville: 500000, sprite: "pepper" },
        "chili": { scoville: 100000, sprite: "pepper" },
        "cayenne": { scoville: 50000, sprite: "pepper" },
        "serrano": { scoville: 10000, sprite: "pepper" },
        "jalapeno": { scoville: 5000, sprite: "pepper" },
        "pepperonicini": { scoville: 1000, sprite: "pepper" }
    }
};
const state = { tolerance: 100, game: { fighterModules: 4 } };
const game = {
    chances: { "pepperonicini": 0.6, "jalapeno": 0.3, "serrano": 0.1 }
};

class Pepper {
    lanePos: number;
    type: string;
    speedX: number;
    obj: GameObj;
    
    constructor(type, lanePos) {
        this.lanePos = lanePos;
        this.type = type;
        this.obj = kaboom.add([
            kaboom.sprite("pepper"),
            kaboom.pos(lanePos + 10, 480),
            kaboom.scale(0.15)
        ]);
        this.speedX = Math.random() * 40 - 20;
    }
    
    checkCollisions() {
        let x = this.obj.pos.x;
        let y = this.obj.pos.y;
        if(x < this.lanePos || x > this.lanePos+30) {
            this.speedX *= -1;
            if(x < this.lanePos) this.obj.pos.x = this.lanePos;
            else this.obj.pos.x = this.lanePos+30;
        }
        if(y < 100 || y > 550) {
            this.speedY *= -1;
            if(y < 100) this.obj.pos.y = 100;
            else this.obj.pos.y = 550;
        }
    }

    move() {
        this.obj.move(this.speedX, -50);
    }
}

// While key is being pressed, keys[code] is true
const keys: { [string]: boolean } = {};
document.addEventListener('keydown', e => keys[e.code] = keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => { delete keys[e.code]; delete keys[e.key.toLowerCase()] });

kaboom.scene('playing', async () => {
    game.tolerance = state.tolerance;
    await kaboom.loadSprite('pepper', 'https://i.imgur.com/Iah5NcR.png');
    await kaboom.loadSprite('bigpepper', 'https://i.imgur.com/1vvaPYj.png');
    await kaboom.loadSprite('background', 'https://i.imgur.com/MMOUx4Z.jpg');
    
    kaboom.layers(['game', 'gametop', 'ui', 'uitop'], 'game');

    // Background
    kaboom.add([
        kaboom.sprite('background'),
        kaboom.pos(0, 0),
        kaboom.scale(1.2, 1.2),
    ]);

    // Death screen
    const death = kaboom.add([
        kaboom.pos(0, 0),
        kaboom.rect(600, 600),
        kaboom.color(kaboom.hsl2rgb(0, 1, 0.22)),
        kaboom.opacity(0),
        kaboom.layer('uitop')
    ]);
    const deathText = kaboom.add([
        kaboom.pos(20, 200),
        kaboom.text(global.deathMessages[Math.floor(Math.random() * global.deathMessages.length)], {
            font: "apl386",
            size: 40,
            width: 400,
            lineSpacing: 10,
            letterSpacing: 5
        }),
        kaboom.color(kaboom.WHITE),
        kaboom.opacity(0),
        kaboom.layer('uitop')
    ])
    
    // Put commas every three numbers
    const formatTolerance = v => {
        let c = Math.round(v).toString().split('').reverse();
        let str = '';
        while(c.length > 3) {
            str = ',' + c.splice(0, 3).reverse().join('') + str
        }
        return c.reverse().join('') + str + ' Scoville';
    }

    // Spice zone where peppers go
    const zone = kaboom.add([
        kaboom.pos(50, 50),
        kaboom.rect(300, 450),
        kaboom.outline(6),
        kaboom.opacity(0),
        kaboom.layer('gametop')
    ])
    const lanes: { peppers: Pepper[], obj: GameObj, moduleObj: GameObj } = [];
    for(let i=0; i<6; i++) {
        lanes[i] = {
            peppers: [],
            obj: kaboom.add([
                kaboom.pos(50 + 50*i, 100),
                kaboom.rect(50, 400),
                kaboom.color(255, 127, 127),
            ]),
            moduleObj: kaboom.add([
                kaboom.pos(50 + 50*i, 50),
                kaboom.rect(50, 50),
                kaboom.color(127, 127, 127),
                kaboom.outline(2, { r: 63, g: 63, b: 63 }),
                kaboom.opacity(0.5)
            ])
        };
    }

    kaboom.add([
        kaboom.sprite('bigpepper'),
        kaboom.pos(225, 280),
        kaboom.scale(0.35, 0.3),
        kaboom.rotate(45),
        kaboom.outline(4),
        kaboom.layer('ui')
    ]);


    const peppers: GameObj[] = [];
    kaboom.onUpdate(() => {
        const dt = kaboom.dt();
        if(game.dead) {
            // Exponential interpolation from 0 to 1 opacity
            if(death.opacity != 1) death.opacity = Math.exp((Date.now() - game.dead) / 1000 - 2) - 0.2;
            death.opacity = Math.max(0, Math.min(1, death.opacity));
            deathText.opacity = Math.max(0, Math.min(1, death.opacity*2-1));
            return;
        }
        
        for(const lane of lanes) {
            let dec = lane.peppers.reduce((a, c) => a + global.peppers[type].scoville, 0) / state.tolerance;
            if(dec >= 1) game.dead = Date.now();
            if(Math.random() < dt) {
                let chance = Math.random();
                let pepper = Object.keys(game.chances).find(v => chance -= v > 0);
                lane.peppers.push(new Pepper(pepper, lane.obj.pos.x))
            }
            
            lane.obj.color = kaboom.hsl2rgb((1-dec)/3, 1, 0.37-0.15*Math.exp(-dec));
            for(const pepper of lane.peppers) {
                pepper.move();
                pepper.checkCollisions();
            }
        }
    });
});


kaboom.go('playing');