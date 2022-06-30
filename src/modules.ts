import { Pepper } from './peppers';
import { Kaboom, Colors, Game } from './initialize';

export class Module {
    x: number;
    y: number;
    gameX: number;
    gameY: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.gameX = 175 + x*50;
        this.gameY = 25 + y*50;
    }

    static types = {
        "Repulsor": { price: 10 },
        "Attractor": { price: 10 },
        "Bouncer": { price: 10 },
        "Slope": { price: 25 },
        "Collector": { price: 50 }
    }

    // like a fan
    static Repulsor(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Repulsor.price;
        
        module.obj = Kaboom.add([
            Kaboom.sprite('repulsor'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
        ]);
        
        module.affectPepper = (pepper: Pepper) => {
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;

            // Vertical
            if(module.obj.angle % 180 == 0) {
                if(Math.abs(xDist) > 43) return;
                if(module.obj.angle == 0 && yDist > 43) return;
                if(module.obj.angle == 180 && yDist < -43) return;
                
                // Adjust distances to be correct sign
                if(module.obj.angle == 180) {
                    yDist = Math.max(yDist, 1);
                } else {
                    yDist = Math.min(yDist, -1)
                }
                
                // Linear distance weighting, directness has a factor
                let directness = 1 - Math.max(0, (Math.abs(xDist)-25)/18);
                let power = Math.min(250, 5e5 / (Math.abs(yDist)-25)**2);
                pepper.speedY += power * directness * Kaboom.dt() * Math.sign(yDist);
            }

            // Horizontal
            else if(module.obj.angle % 180 == 90) {
                if(Math.abs(yDist) > 43) return;
                if(module.obj.angle == 90 && xDist < -43) return;
                if(module.obj.angle == 270 && xDist > 43) return;

                // Adjust distances to be correct sign
                if(module.obj.angle == 90) {
                    xDist = Math.max(xDist, 1);
                } else {
                    xDist = Math.min(xDist, -1)
                }
                
                // Linear distance weighting, directness has a factor
                let directness = 1 - Math.max(0, (Math.abs(yDist)-25)/18);
                let power = Math.min(250, 5e5 / (Math.abs(xDist)-25)**2);
                pepper.speedX += power * directness * Kaboom.dt() * Math.sign(xDist);
            }
        }

        module.delete = () => {
            Kaboom.destroy(module.obj);
        }

        return module;
    }

    // suck
    static Attractor(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Attractor.price;
        
        module.obj = Kaboom.add([
            Kaboom.sprite('attractor'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
        ]);
        
        module.affectPepper = (pepper: Pepper) => {
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;

            // Vertical
            if(module.obj.angle % 180 == 0) {
                if(Math.abs(xDist) > 43) return;
                if(module.obj.angle == 0 && yDist > 43) return;
                if(module.obj.angle == 180 && yDist < -43) return;

                // Adjust distances to be correct sign
                if(module.obj.angle == 180) {
                    yDist = Math.max(yDist, 1);
                } else {
                    yDist = Math.min(yDist, -1)
                }
                
                // Linear distance weighting, directness has a factor
                let directness = 1 - Math.max(0, (Math.abs(xDist)-25)/18);
                let power = Math.min(250, 5e5 / (Math.abs(yDist)-25)**2);
                pepper.speedY -= power * directness * Kaboom.dt() * Math.sign(yDist);
            }

            // Horizontal
            else if(module.obj.angle % 180 == 90) {
                if(Math.abs(yDist) > 43) return;
                if(module.obj.angle == 90 && xDist < -43) return;
                if(module.obj.angle == 270 && xDist > 43) return;

                // Adjust distances to be correct sign
                if(module.obj.angle == 90) {
                    xDist = Math.max(xDist, 1);
                } else {
                    xDist = Math.min(xDist, -1)
                }

                // Linear distance weighting, directness has a factor
                let directness = 1 - Math.max(0, (Math.abs(yDist)-25)/18);
                let power = Math.min(250, 5e5 / (Math.abs(xDist)-25)**2);
                pepper.speedX -= power * directness * Kaboom.dt() * Math.sign(xDist);
            }
        }

        module.delete = () => {
            Kaboom.destroy(module.obj);
        }

        return module;
    }

    // 45 degree angle bounce off of thing
    static Slope(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Slope.price;

        module.obj = Kaboom.add([
            Kaboom.sprite('slope'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.rotate(0),
            Kaboom.origin('center'),
            Kaboom.layer('gamebottom')
        ]);

        // why do 45 deg angles make it 10 times harder to hardcode i stg
        module.affectPepper = (pepper, Pepper) => {
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;
            let prevXDist = pepper.prevPos.x - module.gameX;
            let prevYDist = pepper.prevPos.y - module.gameY;

            if(Math.abs(xDist) > 25 || Math.abs(yDist) > 25) return;
            
            if(module.obj.angle % 180 == 0) {
                // If dot product sign onto line stays same, no collision 
                let ds1 = Math.sign(xDist + yDist);
                let ds2 = Math.sign(prevXDist + prevYDist);
                if(ds1 == ds2) return;
                
                let newY = -pepper.speedX;
                pepper.speedX = -pepper.speedY;
                pepper.speedY = newY;

                // Get pepper out of way of next collision
                pepper.prevPos = Kaboom.vec2(pepper.obj.pos.x, pepper.obj.pos.y);
                pepper.obj.move(pepper.speedX, pepper.speedY);
            } else {
                // If dot product sign onto line stays same, no collision 
                let ds1 = Math.sign(xDist - yDist);
                let ds2 = Math.sign(prevXDist - prevYDist);
                if(ds1 == ds2) return;
                
                let newY = pepper.speedX;
                pepper.speedX = pepper.speedY;
                pepper.speedY = newY;

                // Get pepper out of way of next collision
                pepper.prevPos = Kaboom.vec2(pepper.obj.pos.x, pepper.obj.pos.y);
                pepper.obj.move(pepper.speedX, pepper.speedY);
            }
        };

        module.delete = () => {
            Kaboom.destroy(module.obj);
        }
        
        return module;
    }

    // Bounces thing
    static Bouncer(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Bouncer.price;

        module.obj = Kaboom.add([
            Kaboom.sprite('bouncer'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
        ]);

        module.affectPepper = (pepper: Pepper) => {
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;
            let prevXDist = pepper.prevPos.x - module.gameX;
            let prevYDist = pepper.prevPos.y - module.gameY;
            if(Math.abs(xDist) > 36 || Math.abs(yDist) > 43) return;

            // Make distances relative to closest side
            if(pepper.speedX > 0) {
                xDist += 36;
                prevXDist += 36;
            } else {
                xDist -= 36;
                prevXDist -= 36;
            }
            if(pepper.speedY > 0) {
                yDist += 43;
                prevYDist += 43;
            } else {
                yDist -= 43;
                prevYDist -= 43;
            }

            // Not an else statement because small chance of hitting corner
            if(Math.sign(xDist) != Math.sign(prevXDist)) pepper.speedX *= -1.3;
            if(Math.sign(yDist) != Math.sign(prevYDist)) pepper.speedY *= -1.3;
        }

        module.delete = () => {
            module.obj.destroy();
        };
        return module;
    }

    // collect peper
    static Collector(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Collector.price;
        module.scoville = 0;
        
        module.obj = Kaboom.add([
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.rect(50, 50),
            Colors.rightSaturated,
            Kaboom.origin('center'),
            Kaboom.rotate(0),
            Kaboom.outline(2, Kaboom.hsl2rgb(0, 0, 0.3))
        ]);
        
        // Confirm center of pepper touching or in edge
        module.affectPepper = (pepper: Pepper, game: Game) => {
            if(Math.abs(pepper.obj.pos.x - module.gameX) > 25) return;
            if(Math.abs(pepper.obj.pos.y - module.gameY) > 25) return;

            Kaboom.destroy(pepper.obj);
            pepper.deleted = true;
            game.collected += Pepper.types[pepper.type].scoville;
        };

        module.delete = () => {
            Kaboom.destroy(module.obj);
        };
        
        return module;
    }
}