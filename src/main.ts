import { GameObj } from 'kaboom';

import {
    Kaboom,
    DeathMessages,
    Colors,
    LoadingScene,
    Game
} from './initialize';

import { Pepper } from './peppers';
import { Module } from './modules';
import Draw from './draw';


function drawLevel(level, message) {
    Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.rect(900, 600),
        Kaboom.color(Kaboom.BLACK)
    ]);
    Kaboom.add([
        Kaboom.pos(20, 200),
        Kaboom.text('Level ' + level, {
            font: 'apl386',
            size: 40
        }),
        Kaboom.color(Kaboom.WHITE),
    ]);
    Kaboom.add([
        Kaboom.pos(20, 260),
        Kaboom.text(message, {
            font: 'apl386',
            size: 32,
        }),
        Kaboom.color(222, 222, 222)
    ]); 
    Kaboom.add([
        Kaboom.pos(880, 580),
        Kaboom.text('Press [Enter] to start', {
            font: 'sink',
            size: 20,
        }),
        Kaboom.origin('botright'),
        Kaboom.color(191, 191, 191)
    ]);   
}

// Just levels
Kaboom.scene('level1', () => {
    const game: Game = {
        chances: { 'banana': 1 },
        dropRate: 0.5,
        money: 100,
        health: 30,
        scoville: 10,
        level: 1
    };

    drawLevel(1, "Start of your journey");
    Kaboom.onKeyPress('enter', () => Kaboom.go('playing', game));
});
Kaboom.scene('level2', () => {
    const game: Game = {
        chances: { 'banana': 0.8, 'jalapeno': 0.2 },
        dropRate: 1,
        money: 100,
        health: 30,
        scoville: 20,
        level: 2
    };

    drawLevel(2, "Learning the ropes");
    Kaboom.onKeyPress('enter', () => Kaboom.go('playing', game));
});
Kaboom.scene('level3', () => {
    const game: Game = {
        chances: { 'banana': 0.6, 'jalapeno': 0.4 },
        dropRate: 1,
        money: 100,
        health: 50,
        scoville: 50,
        level: 3
    };

    drawLevel(3, "Getting the hang of it");
    Kaboom.onKeyPress('enter', () => Kaboom.go('playing', game));
});


// Actual game part
Kaboom.scene('playing', (game: Game) => {
    let health = game.health;
    let prevDrop = Date.now();
    let dead = 0; // Time of death
    game.collected = 0;

    const {
        money,
        sauce,
        bottle,
        collected,
        healthTracker,
        healthBar,
        deathText,
        death
    } = Draw(game);

    // X and Y range from 0-11 in the 12x12 grid of 50px x 50px
    const pointer = {
        x: 0,
        y: 11,
        selection: 0,
        obj: Kaboom.add([
            Kaboom.pos(150, 550),
            Kaboom.rect(50, 50),
            Kaboom.color(Kaboom.WHITE),
            Kaboom.outline(2, Kaboom.hsl2rgb(0, 0, 0.2)),
            Kaboom.opacity(0.5),
            Kaboom.layer('ui')
        ])
    };

    // I think this moves the pointer im not sure
    function movePointer(x: number, y: number) {
        pointer.x = (pointer.x + x + 12) % 12
        pointer.y = (pointer.y + y + 12) % 12
        pointer.obj.pos.x = 50 * pointer.x + 150;
        pointer.obj.pos.y = 50 * pointer.y;
    }
    Kaboom.onKeyPressRepeat('w', () => movePointer(0, -1));
    Kaboom.onKeyPressRepeat('a', () => movePointer(-1, 0));
    Kaboom.onKeyPressRepeat('s', () => movePointer(0, 1));
    Kaboom.onKeyPressRepeat('d', () => movePointer(1, 0));
 
    // Sort through items
    Kaboom.onKeyPress('up', () => pointer.selection = (pointer.selection + 1) % Object.keys(Module.types).length);
    Kaboom.onKeyPress('down', () => pointer.selection = (pointer.selection || Object.keys(Module.types).length) - 1);

    // Rotate objects
    Kaboom.onKeyPress('left', () => {
        const module = modules.find(v => v.x == pointer.x && v.y == pointer.y);
        if(!module) return;
        module.obj.angle += module.obj.angle == 0 ? 270 : -90;
    });
    Kaboom.onKeyPress('right', () => {
        const module = modules.find(v => v.x == pointer.x && v.y == pointer.y);
        if(!module) return;
        module.obj.angle += module.obj.angle == 270 ? -270 : 90;
    });

    // Delete object 
    Kaboom.onKeyPress('x', () => {
        const index = modules.findIndex(v => v.x == pointer.x && v.y == pointer.y); 
        const module = index != -1 ? modules[index] : null;
        if(!module) {
            Kaboom.shake(2);
            return;
        }

        game.money += module.price;
        money.text = `$${game.money}`;
        module.delete();
        modules.splice(index, 1);
    });
    Kaboom.onKeyPress('delete', () => {
        const index = modules.findIndex(v => v.x == pointer.x && v.y == pointer.y); 
        const module = index != -1 ? modules[index] : null;
        if(!module) {
            Kaboom.shake(2);
            return;
        }

        game.money += module.price;
        money.text = `$${game.money}`;
        module.delete();
        modules.splice(index, 1);        
    });

    // Use selector
    Kaboom.onKeyPress('enter', () => {
        const index = modules.findIndex(v => v.x == pointer.x && v.y == pointer.y); 
        const module = index != -1 ? modules[index] : null;
        
        // Pointer, if module at location
        if(pointer.selection == Object.keys(Module.types).length) {
            if(!module) return;
            sidebar.right.bottom = module.infoBar;
        }

        // Place an item somewhere
        else {
            let type = Object.keys(Module.types)[pointer.selection];

            // Check if enough money
            if(Module.types[type].price > (module?.price || 0) + game.money) {
                Kaboom.shake(5);
                return;
            }

            // Delete old module and place new module
            if(module) {
                module.delete();
                game.money += module.price;
                modules.splice(index, 1);
            }
            let m = Module[type](pointer.x, pointer.y);
            modules.push(m);
            game.money -= m.price;
            money.text = `$${game.money}`;
        }
    });

    // Start game
    const peppers: Peppers[] = [];
    const modules: Modules[] = [];
    
    let started = false;
    Kaboom.onKeyPress("backspace", () => started = true);
    Kaboom.onUpdate(() => {
        if(!started) return;
        if(dead) {
            // Exponential interpolation from 0 to 1 opacity
            if(death.opacity != 1) death.opacity = Math.exp((Date.now() - game.dead) / 1000 - 2) - 0.2;
            death.opacity = Math.max(0, Math.min(1, death.opacity));
            deathText.opacity = Math.max(0, Math.min(1, death.opacity*2-1));
            return;
        }

        // Approximately every second create a new pepper
        if(Date.now() - prevDrop > 1000 / game.dropRate) {
            prevDrop = Date.now();
            
            let chance = Math.random();
            let pepper = Object.keys(game.chances).find(v => (chance -= game.chances[v]) <= 0);
            peppers.push(new Pepper(pepper));
        }

        pepperLoop: for(let i=0; i<peppers.length; i++) {
            const pepper = peppers[i];
            pepper.move();
            for(const module of modules) {
                module.affectPepper(pepper, game);
                if(pepper.deleted) {
                    peppers.splice(i, 1);
                    i--;
                    continue pepperLoop;
                }
            }
            pepper.checkCollisions();

            // Pepper fell below bottom
            if(pepper.obj.pos.y > 600) {
                health -= Pepper.types[pepper.type].scoville;
                pepper.obj.destroy();
                peppers.splice(i--, 1);
            }
        }

        // Update UI
        let dec = Math.min(1, Math.max(0, health / game.health));
        if(dec == 0) dead = Date.now();
        healthTracker.use(Kaboom.scale(dec, 1));

        let colDec = game.collected / game.scoville;
        sauce.use(Kaboom.scale(1, -colDec));
        collected.text = Math.floor(colDec * 100) + '%';

        if(colDec >= 1) Kaboom.go(`level${game.level + 1}`);
    });
});

Kaboom.scene('loading', LoadingScene);
Kaboom.go('loading');