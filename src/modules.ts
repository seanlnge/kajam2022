import { Pepper } from './peppers';
import { Kaboom, Colors, Game, Screen } from './initialize';

export class Module {
    x: number;
    y: number;
    gameX: number;
    gameY: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.gameX = Screen.maxLeft + 25 + x*50;
        this.gameY = 75 + y*50;
    }

    static types = {
        "Fan": { price: 10, description: 'Pushes peppers in direction of nozzle' },
        "Slope": { price: 15, description: 'A 45 degree angle perfect for bouncing off of' },
        "Bouncer": { price: 15, description: 'Hitting this makes peppers go faster? Must\'ve made a typo in my code' },
        "Magnet": { price: 20, description: 'A pepper magnet, for when metal magnets aren\'t enough' },
        "Block": { price: 25, description: 'It just sits there menacingly' },
        "Helium": { price: 20, description: 'Cuts both speed and, temporarily, gravity in half' },
        "Stopper": { price: 40, description: 'Powerful for spicy peppers, but it comes at a high cost' },
    }

    // like a fan
    static Fan(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Fan.price;
        module.type = "Fan";
        
        module.obj = Kaboom.add([
            Kaboom.sprite('fan'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.layer('gamebottom'),
            Kaboom.rotate(0),
        ]);
        
        module.affectPepper = (pepper: Pepper, game: Game) => {
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

                // Check if modules exist to stop pushing
                for(const gm of game.modules) {
                    if(!gm.solid) continue;
                    if(gm.x == module.x && Math.sign(gm.y-module.y) == Math.sign(yDist)) {
                        if(Math.abs(yDist) > Math.abs(gm.gameY - module.gameY)) return;
                    }
                }
                
                // Linear distance weighting, directness has a factor
                let directness = 1 - Math.max(0, (Math.abs(xDist)-25)/18);
                let power = Math.min(250, 5e5 / Math.max(0, Math.abs(yDist)-25)**1.4);
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
                
                // Check if modules exist to stop pushing
                for(const gm of game.modules) {
                    if(!gm.solid) continue;
                    if(gm.y == module.y && Math.sign(gm.x-module.x) == Math.sign(xDist)) {
                        if(Math.abs(xDist) > Math.abs(gm.gameX - module.gameX)) return;
                    }
                }
                
                // Directness has a factor
                let directness = 1 - Math.max(0, (Math.abs(yDist)-25)/18);
                let power = Math.min(250, 5e5 / Math.max(0, Math.abs(xDist)-25)**1.4);
                pepper.speedX += power * directness * Kaboom.dt() * Math.sign(xDist);
            }
        }

        module.delete = () => {
            Kaboom.destroy(module.obj);
        }

        return module;
    }

    // suck
    static Magnet(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Magnet.price;
        module.type = "Magnet";
        
        module.obj = Kaboom.add([
            Kaboom.sprite('magnet'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.layer('gamebottom'),
            Kaboom.rotate(0),
        ]);
        
        module.affectPepper = (pepper: Pepper) => {
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;

            let magn = xDist ** 2 + yDist**2;
            let power = Math.min(250, 1e6 / magn);

            pepper.speedX -= power * Kaboom.dt() * xDist / Math.sqrt(magn);
            pepper.speedY -= power * Kaboom.dt() * yDist / Math.sqrt(magn);
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
        module.type = "Slope";
        module.solid = true;

        module.obj = Kaboom.add([
            Kaboom.sprite('slope'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.rotate(0),
            Kaboom.layer('gamebottom'),
            Kaboom.origin('center')
        ]);

        // why do 45 deg angles make it 10 times harder to hardcode i stg
        module.affectPepper = (pepper, Pepper) => {
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;
            let prevXDist = pepper.prevPos.x - module.gameX;
            let prevYDist = pepper.prevPos.y - module.gameY;

            if(Math.abs(xDist) > 30 || Math.abs(yDist) > 43) return;

            if(module.obj.angle % 180 == 0) {
                // Coming from top left
                if(pepper.speedX + pepper.speedY > 0) {
                    xDist += 5;
                    yDist += 18;
                }
                // Coming from bottom right
                else {
                    xDist -= 5;
                    yDist -= 18;
                }
                
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
                // Coming from top right
                if(pepper.speedX < pepper.speedY) {
                    xDist -= 5;
                    yDist += 18;
                }
                // Coming from bottom right
                else {
                    xDist += 5;
                    yDist -= 18;
                }
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
        module.type = "Bouncer";
        module.solid = true;

        module.obj = Kaboom.add([
            Kaboom.sprite('bouncer'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
            Kaboom.layer('gamebottom')
        ]);

        module.affectPepper = (pepper: Pepper) => {
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;
            let prevXDist = pepper.prevPos.x - module.gameX;
            let prevYDist = pepper.prevPos.y - module.gameY;
            if(Math.abs(xDist) > 25 || Math.abs(yDist) > 43) return;

            // Make distances relative to closest side
            if(pepper.speedX > 0) {
                xDist += 25;
                prevXDist += 25;
            } else {
                xDist -= 25;
                prevXDist -= 25;
            }
            if(pepper.speedY > 0) {
                yDist += 43;
                prevYDist += 43;
            } else {
                yDist -= 43;
                prevYDist -= 43;
            }

            // Not an else statement because small chance of hitting corner
            if(Math.sign(xDist) != Math.sign(prevXDist)) pepper.speedX *= -1.5;
            if(Math.sign(yDist) != Math.sign(prevYDist)) pepper.speedY *= -1.5;
        }

        module.delete = () => {
            module.obj.destroy();
        };
        return module;
    }

    // Bouncer with no bounce
    static Block(x: number, y: number) {
        const module = new Module(x, y);
        module.price = Module.types.Block.price;
        module.type = "Block";
        module.solid = true;
        
        module.obj = Kaboom.add([
            Kaboom.sprite('block'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
            Kaboom.layer('gamebottom')
        ]);

        module.affectPepper = (pepper: Pepper) => {
            // god how i love coding collision resolution :|
            let xDist = pepper.obj.pos.x - module.gameX;
            let yDist = pepper.obj.pos.y - module.gameY;
            let prevXDist = pepper.prevPos.x - module.gameX;
            let prevYDist = pepper.prevPos.y - module.gameY;
            if(Math.abs(xDist) > 30 || Math.abs(yDist) > 43) return;

            // Make distances relative to closest side
            if(pepper.speedX > 0) {
                xDist += 30;
                prevXDist += 30;
            } else {
                xDist -= 30;
                prevXDist -= 30;
            }
            if(pepper.speedY > 0) {
                yDist += 43;
                prevYDist += 43;
            } else {
                yDist -= 43;
                prevYDist -= 43;
            }

            // Not an else statement because small chance of hitting corner
            if(Math.sign(xDist) != Math.sign(prevXDist)) {
                pepper.speedX *= -0.1;
                pepper.obj.pos.x = pepper.prevPos.x + Math.sign(prevXDist);
            }
            if(Math.sign(yDist) != Math.sign(prevYDist)) {
                pepper.speedY *= -0.1;
                pepper.obj.pos.y = pepper.prevPos.y + Math.sign(prevYDist);
            }
        }

        module.delete = () => {
            Kaboom.destroy(module.obj);
        }

        return module;
    }
    
    // stopper
    static Stopper(x: number, y: number) {
        const module = new Module(x, y);
        module.type = 'Stopper';
        module.price = Module.types.Stopper.price;
        module.scoville = 0;
        module.alreadyHit = {};
        
        module.obj = Kaboom.add([
            Kaboom.sprite('stopper'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
            Kaboom.layer('gamebottom'),
        ]);
        
        // Confirm center of pepper touching or in edge
        module.affectPepper = (pepper: Pepper, game: Game) => {
            if(Math.abs(pepper.obj.pos.x - module.gameX) > 30
            || Math.abs(pepper.obj.pos.y - module.gameY) > 43) {  
                if(pepper.obj._id in module.alreadyHit) {
                    delete module.alreadyHit[pepper.obj._id];
                }
                return;
            };
            if(pepper.obj._id in module.alreadyHit) return;
            module.alreadyHit[pepper.obj._id] = true;
            pepper.speedX *= 0;
            pepper.speedY *= 0;
        };

        module.delete = () => {
            Kaboom.destroy(module.obj);
        };
        
        return module;
    }

    // lighter
    static Helium(x: number, y: number) {
        const module = new Module(x, y);
        module.type = "Helium";
        module.price = Module.types.Helium.price;
        module.scoville = 0;
        module.alreadyHit = {};
        
        module.obj = Kaboom.add([
            Kaboom.sprite('helium'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
            Kaboom.layer('gamebottom'),
        ]);
        
        // Confirm center of pepper touching or in edge
        module.affectPepper = (pepper: Pepper, game: Game) => {
            if(Math.abs(pepper.obj.pos.x - module.gameX) > 30
            || Math.abs(pepper.obj.pos.y - module.gameY) > 43) {  
                if(pepper.obj._id in module.alreadyHit) {
                    pepper.accY *= 2;
                    delete module.alreadyHit[pepper.obj._id];
                }
                return;
            };
            if(pepper.obj._id in module.alreadyHit) return;
            module.alreadyHit[pepper.obj._id] = true;
            pepper.accY *= 1/2;
            pepper.speedX *= 1/2;
            pepper.speedY *= 1/2;
        };

        module.delete = () => {
            Kaboom.destroy(module.obj);
        };
        
        return module;
    }

    // collect peper
    static Milk(x: number, y: number) {
        const module = new Module(x, y);
        module.type = "Milk";
        module.scoville = 0;
        module.solid = true;
        
        module.obj = Kaboom.add([
            Kaboom.sprite('milk'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
            Kaboom.layer('gamebottom'),
        ]);
        
        // Confirm center of pepper touching or in edge
        module.affectPepper = (pepper: Pepper, game: Game) => {
            if(Math.abs(pepper.obj.pos.x - module.gameX) > 30) return;
            if(Math.abs(pepper.obj.pos.y - module.gameY) > 43) return;

            Kaboom.destroy(pepper.obj);
            pepper.deleted = true;
            game.currentHealth--;
        };

        module.delete = () => {
            Kaboom.destroy(module.obj);
        };
        
        return module;
    }
    
    // collect peper
    static Collector(x: number, y: number) {
        const module = new Module(x, y);
        module.type = "Collector";
        module.scoville = 0;
        module.solid = true;
        
        module.obj = Kaboom.add([
            Kaboom.sprite('collector'),
            Kaboom.pos(module.gameX, module.gameY),
            Kaboom.origin('center'),
            Kaboom.rotate(0),
            Kaboom.layer('gamebottom'),
        ]);
        
        // Confirm center of pepper touching or in edge
        module.affectPepper = (pepper: Pepper, game: Game) => {
            if(Math.abs(pepper.obj.pos.x - module.gameX) > 30) return;
            if(Math.abs(pepper.obj.pos.y - module.gameY) > 43) return;

            Kaboom.destroy(pepper.obj);
            pepper.deleted = true;
            game.collected++;
        };

        module.delete = () => {
            Kaboom.destroy(module.obj);
        };
        
        return module;
    }
}