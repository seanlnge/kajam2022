import { Kaboom } from './initialize';
import { GameObj } from 'kaboom';

export class Pepper {
    type: string;
    speedX: number;
    speedY: number;
    damping: number;
    prevPos: vec2;
    obj: GameObj;

    // Not indicative of real scovilles whatsoever lmfao
    static types = {
        "reaper": { scoville: 50, sprite: "redPepper" },
        "ghost": { scoville: 30, sprite: "redPepper" },
        "habanero": { scoville: 16, sprite: "redPepper" },
        "chili": { scoville: 9, sprite: "redPepper" },
        "cayenne": { scoville: 5, sprite: "redPepper" },
        "serrano": { scoville: 3, sprite: "orangePepper" },
        "jalapeno": { scoville: 2, sprite: "yellowPepper" },
        "banana": { scoville: 1, sprite: "greenPepper" }
    };
    
    constructor(type) {
        this.type = type;
        this.obj = Kaboom.add([
            Kaboom.sprite(Pepper.types[type].sprite),
            Kaboom.pos(Math.random() * 580 + 160, -18),
            Kaboom.origin("center"),
            Kaboom.scale(0.05)
        ]);
        this.speedX = 0;
        this.speedY = 0;
        this.accX = 0;
        this.accY = 40;
        this.damping = 0.1;
    }
    
    checkCollisions() {
        let x = this.obj.pos.x;
        let y = this.obj.pos.y;
        if(x < 160 || x > 740) {
            this.speedX *= -0.6; // lose some energy in collision
            if(x < 160) this.obj.pos.x = 160;
            else this.obj.pos.x = 740;
        }
        if(y < 0 && this.speedY < 0) {
            this.speedY *= -0.6; // lose some energy in collision
            this.obj.pos.y = 0;
        }
    }

    move() {
        this.prevPos = Kaboom.vec2(this.obj.pos.x, this.obj.pos.y);
        this.speedX += Kaboom.dt() * this.accX;
        this.speedY += Kaboom.dt() * this.accY;
        this.speedX = Math.min(750, Math.max(-750, this.speedX));
        this.speedY = Math.min(750, Math.max(-750, this.speedY));

        // dt near enough to zero that (1+xdt) ^ (1/dt) is approx e^x
        //this.speedX *= 1 + Kaboom.dt() * Math.log(1 - this.damping);
        //this.speedY *= 1 + Kaboom.dt() * Math.log(1 - this.damping);
        this.obj.move(this.speedX, this.speedY);
    }
}