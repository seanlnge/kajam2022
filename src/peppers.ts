import { Kaboom, Screen } from './initialize';
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
        "ghost": { scoville: 5, sprite: "redPepper" },
        "habanero": { scoville: 3, sprite: "orangePepper" },
        "jalapeno": { scoville: 2, sprite: "yellowPepper" },
        "banana": { scoville: 1, sprite: "greenPepper" }
    };
    
    constructor(type) {
        this.type = type;
        this.obj = Kaboom.add([
            Kaboom.sprite(Pepper.types[type].sprite),
            Kaboom.pos(Math.random() * 580 + Screen.maxLeft + 10, -118),
            Kaboom.origin("center"),
            Kaboom.scale(0.05)
        ]);
        this.speedX = 0;
        this.speedY = 0;
        this.accX = 0;
        this.accY = 80 * Pepper.types[type].scoville;
        this.damping = 0.1;
    }
    
    checkCollisions() {
        let x = this.obj.pos.x;
        let y = this.obj.pos.y;
        if(x < Screen.maxLeft + 10 || x > Screen.minRight - 10) {
            this.speedX *= -0.2; // lose some energy in collision
            if(x < Screen.maxLeft + 10) this.obj.pos.x = Screen.maxLeft + 10;
            else this.obj.pos.x = Screen.minRight - 10;
        }
        if(y < 0 && this.speedY < 0) {
            this.speedY *= -0.2; // lose some energy in collision
            this.obj.pos.y = 0;
        }
    }

    move() {
        this.prevPos = Kaboom.vec2(this.obj.pos.x, this.obj.pos.y);
        this.speedX += Kaboom.dt() * this.accX;
        this.speedY += Kaboom.dt() * this.accY;
        this.speedX = Math.min(1250, Math.max(-1250, this.speedX));
        this.speedY = Math.min(1250, Math.max(-1250, this.speedY));

        // dt near enough to zero that (1+xdt) ^ (1/dt) is approx e^x
        //this.speedX *= 1 + Kaboom.dt() * Math.log(1 - this.damping);
        //this.speedY *= 1 + Kaboom.dt() * Math.log(1 - this.damping);
        this.obj.move(this.speedX, this.speedY);
    }
}