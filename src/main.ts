import { GameObj } from 'kaboom';

import { Pepper } from './peppers';
import { Module } from './modules';
import Draw from './draw';
import Tutorial from './tutorial';
import './levels';

import {
    Kaboom,
    DeathMessages,
    Colors,
    LoadingScene,
    TitleScene,
    Game,
    Screen,
    ComputeScreen
} from './initialize';


// Main game part
Kaboom.scene('playing', async (game: Game) => {
    game.modules = [];
    game.peppers = [];
    
    const music = Kaboom.play("spicySong", {
        volume: 0.8,
        loop: true
    });
    
    const objects = Draw(game);
    game.currentHealth = game.health;
    let prevDrop = Date.now();
    let paused = false;
    let escaped = false;
    let dead = 0; // Time of death
    game.collected = 0;

    // Make types of peppers in round opaque
    for(const type of game.types) objects[type].opacity = 1;

    for(const mb of game.layout) {
        const module = Module[mb.type](mb.x, mb.y);
        module.obj.angle = mb.angle || 0;
        module.noDelete = true;
        module.noRotate = true;
        game.modules.push(module);
    }

    // X and Y range from 0-11 in the 12x12 grid of 50px x 50px
    const pointer = {
        x: 0,
        y: 10,
        selection: 0,
        selectedModule: Module[Object.keys(Module.types)[0]](13, 3),
        rotation: 0,
        obj: Kaboom.add([
            Kaboom.pos(Screen.maxLeft, 550),
            Kaboom.rect(50, 50),
            Kaboom.color(Kaboom.WHITE),
            Kaboom.outline(2, Kaboom.hsl2rgb(0, 0, 0.2)),
            Kaboom.opacity(0.5),
            Kaboom.layer('ui')
        ])
    };
    pointer.selectedModule.obj.pos = Kaboom.vec2(Screen.centerRight, 225);
    let type = pointer.selectedModule.type;
    objects.moduleTitle.text = type;
    objects.modulePrice.text = '$' + Module.types[type].price;
    objects.moduleDescription.text = Module.types[type].description;
    pointer.selectedModule.obj.layer = 'uitop';

    // Move pointer with keys
    function movePointer(x: number, y: number) {
        if(escaped) return;
        pointer.x = (pointer.x + x + 12) % 12
        pointer.y = (pointer.y + y + 11) % 11
        pointer.obj.pos.x = Screen.maxLeft + 50 * pointer.x;
        pointer.obj.pos.y = 50 * pointer.y + 50;
    }

    if(game.tutorial) await Tutorial(game.tutorial);
    
    Kaboom.onKeyPressRepeat('w', () => movePointer(0, -1));
    Kaboom.onKeyPressRepeat('a', () => movePointer(-1, 0));
    Kaboom.onKeyPressRepeat('s', () => movePointer(0, 1));
    Kaboom.onKeyPressRepeat('d', () => movePointer(1, 0));

    // Move pointer with mouse
    Kaboom.onMouseMove(mp => {
        if(escaped) return;
        // toWorld not working as expected :(
        const pos = {
            x: mp.x / window.innerHeight * 600,
            y: mp.y / window.innerHeight * 600
        };
        pointer.x = Math.min(11, Math.max(0, Math.round((pos.x - Screen.maxLeft - 25) / 50)));
        pointer.y = Math.min(10, Math.max(0, Math.round((pos.y - 75) / 50)));
        pointer.obj.pos.x = Screen.maxLeft + 50 * pointer.x;
        pointer.obj.pos.y = 50 * pointer.y + 50;
    });
 
    // Sort through items
    Kaboom.onKeyPress('up', () => {
        if(escaped) return;
        const selections = Object.keys(Module.types).length;
        pointer.selection = (pointer.selection + 1) % selections;
        pointer.rotation = 0;
        
        Kaboom.destroy(pointer.selectedModule.obj);
        const type = Object.keys(Module.types)[pointer.selection]; 
        pointer.selectedModule = Module[type](13, 3);
        pointer.selectedModule.obj.layer = 'uitop';
        pointer.selectedModule.obj.pos = Kaboom.vec2(Screen.centerRight, 225);

        objects.moduleTitle.text = type;
        objects.modulePrice.text = '$' + Module.types[type].price;
        objects.moduleDescription.text = Module.types[type].description;
    });
    Kaboom.onKeyPress('down', () => {
        if(escaped) return;
        const selections = Object.keys(Module.types).length;
        pointer.selection = (pointer.selection || selections) - 1;
        pointer.rotation = 0;

        Kaboom.destroy(pointer.selectedModule.obj);
        const type = Object.keys(Module.types)[pointer.selection]; 
        pointer.selectedModule = Module[type](13, 3);
        pointer.selectedModule.obj.layer = 'uitop';
        pointer.selectedModule.obj.pos = Kaboom.vec2(Screen.centerRight, 225);
        
        objects.moduleTitle.text = type;
        objects.modulePrice.text = '$' + Module.types[type].price;
        objects.moduleDescription.text = Module.types[type].description;
    });

    // Rotate objects
    Kaboom.onKeyPress('left', () => {
        if(escaped) return;
        const module = game.modules.find(v => v.x == pointer.x && v.y == pointer.y);
        if(!module) {
            pointer.rotation += pointer.rotation == 0 ? 270 : -90;
            pointer.selectedModule.obj.angle = pointer.rotation;
            return;
        }
        if(module.noRotate) {
            Kaboom.shake(2);
            return;
        }
        module.obj.angle += module.obj.angle == 0 ? 270 : -90;
        
        // Make rotation of module preview to equal module
        const type = Object.keys(Module.types)[pointer.selection];
        if(module.type == type) {
            pointer.rotation = module.obj.angle;
            pointer.selectedModule.obj.angle = pointer.rotation;
        }
    });
    Kaboom.onKeyPress('right', () => {
        if(escaped) return;
        const module = game.modules.find(v => v.x == pointer.x && v.y == pointer.y);
        if(!module) {
            pointer.rotation += pointer.rotation == 270 ? -270 : 90;
            pointer.selectedModule.obj.angle = pointer.rotation;
            return;
        }
        if(module.noRotate) {
            Kaboom.shake(2);
            return;
        }
        module.obj.angle += module.obj.angle == 270 ? -270 : 90;

        // Make rotation of module preview to equal module
        const type = Object.keys(Module.types)[pointer.selection];
        if(module.type == type) {
            pointer.rotation = module.obj.angle;
            pointer.selectedModule.obj.angle = pointer.rotation;
        }
    });
    Kaboom.onKeyPress('o', () => {
        if(game.level == 1) return;
        Kaboom.go("level" + (game.level-1)) 
    });
    Kaboom.onKeyPress('p', () => {
        if(game.level == 9) return;
        Kaboom.go('level' + (game.level+1));
    });

    // Delete object at pointer
    function remove() {
        if(escaped) return;
        const index = game.modules.findIndex(v => v.x == pointer.x && v.y == pointer.y); 
        const module = index != -1 ? game.modules[index] : null;
        if(!module || module.noDelete) {
            Kaboom.shake(2);
            return;
        }

        game.money += module.price;
        objects.money.text = `$${game.money}`;
        module.delete();
        game.modules.splice(index, 1);       
    }
    Kaboom.onKeyPress('x', remove);
    Kaboom.onKeyPress('delete', remove);

    // Place module at pointer
    function place() {
        if(escaped) return;
        const index = game.modules.findIndex(v => v.x == pointer.x && v.y == pointer.y); 
        const module = index != -1 ? game.modules[index] : null;
        if(module?.noDelete) {
            Kaboom.shake(2);
            return;
        }
        
        let type = Object.keys(Module.types)[pointer.selection];

        // Check if enough money
        if(Module.types[type].price > (module?.price || 0) + game.money) {
            Kaboom.shake(2);
            return;
        }

        // Delete old module and place new module
        if(module) {
            module.delete();
            game.money += module.price;
            game.modules.splice(index, 1);
        }
        let m = Module[type](pointer.x, pointer.y);
        m.obj.angle = pointer.rotation;
        game.modules.push(m);
        
        game.money -= m.price;
        objects.money.text = `$${game.money}`;
    }
    Kaboom.onMousePress(pos => {
        const mp = {
            x: pos.x / window.innerHeight * 600,
            y: pos.y / window.innerHeight * 600
        };
        if(escaped) {
            if(mp.x < Screen.kaboomWidth/2-200 || mp.x > Screen.kaboomWidth/2+200) {
                escaped = false;
                objects.settings.opacity = 0;
                objects.settingsOutline.opacity = 0;
                objects.settingsBackground.opacity = 0;
                objects.settingsText.opacity = 0;
                objects.settingsLevel.opacity = 0;
                objects.settingsBackText.opacity = 0;
            }
            return;
        }
        if(mp.x < Screen.maxLeft || mp.x > Screen.minRight) {
            if(!paused) return;
            return;
        }
        place();
    });
    Kaboom.onKeyPress("enter", () => {
        if(escaped) return;
        place();
    });
    

    // Start game
    let started = false;
    Kaboom.onKeyPress("backspace", () => {
        if(escaped) return;
        Kaboom.destroy(objects.startText);
        started = true;
    });
    Kaboom.onKeyPress('escape', () => {
        if(escaped) {
            escaped = false;
            objects.settings.opacity = 0;
            objects.settingsOutline.opacity = 0;
            objects.settingsBackground.opacity = 0;
            objects.settingsText.opacity = 0;
            objects.settingsLevel.opacity = 0;
            objects.settingsBackText.opacity = 0;
            return;
        }
        escaped = true;
        objects.settings.opacity = 1;
        objects.settingsOutline.opacity = 1;
        objects.settingsBackground.opacity = 0.7;
        objects.settingsLevel.opacity = 1;
        objects.settingsText.opacity = 1;
        objects.settingsBackText.opacity = 1;
    });
    Kaboom.onKeyPress('r', () => {
        music.stop();
        Kaboom.go('level' + game.level)
    });
    Kaboom.onKeyPress('space', () => {
        if(!started) return;
        paused = !paused;
        objects.pausedText.opacity = paused ? 1 : 0;
    });
    
    
    // Game loop
    Kaboom.onUpdate(() => {
        // If user changes viewing box size, recompute values
        if(window.innerWidth != Screen.innerWidth || window.innerHeight != Screen.innerHeight) {
            ComputeScreen();
            music.stop();
            Kaboom.go('level' + game.level);
        }
        
        if(!started || escaped) return;
        
        if(dead) {
            // Exponential interpolation from 0 to 1 opacity
            if(objects.death.opacity != 1) objects.death.opacity = Math.exp((Date.now() - dead) / 1000 - 2) - 0.2;
            objects.death.opacity = Math.max(0, Math.min(1, objects.death.opacity));
            objects.deathText.opacity = Math.max(0, Math.min(1, objects.death.opacity*2-1));
            music.speed(Math.max(0, 1-(Date.now()-dead)/3000));
            if(Date.now() - dead > 3000) {
                music.stop();
                objects.deathReplay.opacity = 1;
                Kaboom.onKeyPress('enter', () => {
                    Kaboom.go('level' + game.level);
                });
            }
            return;
        }
        if(paused) return;

        // Approximately every second create a new pepper
        if(Date.now() - prevDrop > 1000 / game.dropRate) {
            prevDrop = Date.now();
            let pepper = game.types[Math.floor(Math.random() * game.types.length)];
            game.peppers.push(new Pepper(pepper));
        }

        pepperLoop: for(let i=0; i<game.peppers.length; i++) {
            const pepper = game.peppers[i];
            pepper.move();
            for(const module of game.modules) {
                module.affectPepper(pepper, game);
                if(pepper.deleted) {
                    game.peppers.splice(i, 1);
                    i--;
                    continue pepperLoop;
                }
            }
            pepper.checkCollisions();

            // Pepper fell below bottom
            if(pepper.obj.pos.y > 600) {
                game.currentHealth--;
                pepper.obj.destroy();
                game.peppers.splice(i--, 1);
            }
        }

        // Update UI
        let dec = Math.min(1, Math.max(0, game.currentHealth / game.health));
        if(dec == 0) dead = Date.now();
        objects.healthTracker.use(Kaboom.scale(dec, 1));

        let colDec = game.collected / game.scoville;
        objects.sauce.use(Kaboom.scale(1, -colDec));
        objects.collected.text = Math.floor(colDec * 100) + '%';

        if(colDec >= 1) {
            music.stop();
            Kaboom.go(`level${game.level + 1}`);
        }
    });
});

Kaboom.scene('title', TitleScene);
Kaboom.scene('loading', LoadingScene);
Kaboom.go('loading');