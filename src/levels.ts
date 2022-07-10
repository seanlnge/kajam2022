import { Game, Kaboom, Screen, ComputeScreen } from './initialize';

function drawLevel(game: Game) {
    Kaboom.onKeyPress('0', () => Kaboom.go('level6'));
    
    // Background
    Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.rect(2400, 600),
        Kaboom.color(Kaboom.BLACK)
    ]);

    // Level text and tagline
    Kaboom.add([
        Kaboom.pos(20, 200),
        Kaboom.text('Level ' + game.level, {
            font: 'apl386',
            size: 40
        }),
        Kaboom.color(Kaboom.WHITE),
    ]);
    Kaboom.add([
        Kaboom.pos(20, 260),
        Kaboom.text(game.tagline, {
            font: 'apl386',
            size: 32,
            width: Screen.kaboomWidth/2
        }),
        Kaboom.color(222, 222, 222)
    ]);

    // Self explanatory, just looked nice having comment here
    Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth-20, 580),
        Kaboom.text('Click or press [Enter] to start', {
            font: 'sink',
            size: 16,
        }),
        Kaboom.origin('botright'),
        Kaboom.color(191, 191, 191)
    ]);

    // If user changes viewing box size, recompute values
    Kaboom.onUpdate(() => {
        if(window.innerWidth != Screen.innerWidth || window.innerHeight != Screen.innerHeight) {
            ComputeScreen();
            Kaboom.go('level' + game.level);
        }
    });

    // Start level
    Kaboom.onKeyPress('enter', () => Kaboom.go('playing', game));
    Kaboom.onMousePress(() => Kaboom.go('playing', game));
}

Kaboom.scene('level1', () => drawLevel({
    level: 1,
    tagline: 'You gotta start somewhere',
    types: ['banana'],
    dropRate: 1,
    money: 10,
    health: 1, // literally doesnt matter
    scoville: 6,
    layout: [
        { x: 0, y: 8, type: 'Block' },
        { x: 1, y: 8, type: 'Block' },
        { x: 2, y: 8, type: 'Block' },
        { x: 3, y: 8, type: 'Block' },
        { x: 4, y: 8, type: 'Block' },
        { x: 5, y: 8, type: 'Block' },
        { x: 6, y: 8, type: 'Block' },
        { x: 7, y: 8, type: 'Block' },
        { x: 8, y: 8, type: 'Block' },
        { x: 9, y: 8, type: 'Block' },
        { x: 10, y: 8, type: 'Block' },
        { x: 11, y: 8, type: 'Block' },
        
        { x: 11, y: 5, type: 'Collector' },
        { x: 11, y: 7, type: 'Fan' },
    ],

    tutorial: [
        { textX: 20, textY: 200, text: "Peppers are falling from the sky and it's your job to collect them all!\n\n\nUsing fans, magnets, slopes and more, you need to create a system to catch enough peppers before too many fall into the milk below!" },
        { w: Screen.maxLeft, h: 600, textX: Screen.maxLeft + 20, textY: 200, text: "This is the game information side.\n\nIt tells you the how far through the level you are in percent and hot sauce form, as well as your health bar and which peppers show up in this level" },
        { x: Screen.minRight, w: Screen.kaboomWidth - Screen.minRight, h: 600, textX: 20, textY: 200, text: "This is the object information side.\n\nIt tells you the amount of money you have to spend, the object selector, and the selected object's description and price" },
        { x: Screen.maxLeft, w: 600, h: 600, textX: Screen.maxLeft+20, textY: 100, textW: 560, textColor: Kaboom.BLACK, text: "This is where you are going to be spending most of your time.\n\n\nWhen the game starts peppers will fall from the sky and your goal is to get them into that red box." },
        { x: Screen.maxLeft+550, y: 400, w: 50, h: 50, textX: 20, textY: 200, text: "That yellow fellow there is a fan.\n\n\nA fan is a object that pushes peppers away from it, and this one is rotated upwards, towards the red box.\n\n\nMaybe you can find a way to push peppers over there..." },
        { textX: 20, textY: 100, text: "Oh I should probably tell you the controls!\n\n\nUse WASD or mouse to move pointer\n\nPress Enter or click to place object\n\nPress X or Del to delete a object\n\nPress the left or right arrows to rotate object\n\n\nGood luck!" },
    ]
}));

Kaboom.scene('level2', () => drawLevel({
    level: 2,
    tagline: 'A couple new objects',
    types: ['banana'],
    dropRate: 1,
    money: 15,
    health: 10,
    scoville: 8,
    layout: [
        { x: 1, y: 1, type: 'Block' },
        { x: 2, y: 1, type: 'Block' },
        { x: 3, y: 1, type: 'Block' },
        { x: 4, y: 1, type: 'Block' },
        { x: 5, y: 1, type: 'Block' },
        { x: 6, y: 1, type: 'Block' },
        { x: 7, y: 1, type: 'Block' },
        { x: 8, y: 1, type: 'Block' },
        { x: 9, y: 1, type: 'Block' },
        { x: 10, y: 1, type: 'Block' },
        { x: 11, y: 1, type: 'Block' },
        
        { x: 11, y: 0, type: 'Fan', angle: 270 },
        
        { x: 4, y: 4, type: 'Collector' },
        { x: 4, y: 5, type: 'Milk' }
    ],
    tutorial: [            
        { textX: 20, textY: 200, text: "Sometimes you may not be sure if something will work.\n\n\nLuckily, you can reset a level by pressing R, or pause a level by pressing Space.\n\nClicking Escape opens up the settings panel (Which also shows the controls if you forget)" },
        { x: Screen.minRight, y: 137.5, w: Screen.kaboomWidth-Screen.minRight, h: 175, textX: 20, textY: 200, text: "Repulsors aren't the only object you have at your disposal.\n\nUse the up and down arrow keys to change your selected object" }
    ]
}));

Kaboom.scene('level3', () => drawLevel({
    level: 3,
    tagline: 'Getting the hang of things...',
    types: ['banana'],
    dropRate: 1,
    money: 15,
    health: 10,
    scoville: 12,
    layout: [
        { x: 0, y: 1, type: 'Block' },
        { x: 1, y: 1, type: 'Block' },
        { x: 2, y: 1, type: 'Block' },
        { x: 3, y: 1, type: 'Block' },
        { x: 4, y: 1, type: 'Block' },
        { x: 5, y: 1, type: 'Block' },
        { x: 6, y: 1, type: 'Block' },
        { x: 7, y: 1, type: 'Block' },
        { x: 8, y: 1, type: 'Block' },
        { x: 9, y: 1, type: 'Block' },
        { x: 10, y: 1, type: 'Block' },
        
        { x: 0, y: 0, type: 'Fan', angle: 90 },

        { x: 11, y: 1, type: 'Stopper' },
        { x: 11, y: 3, type: 'Slope' },
        { x: 1, y: 3, type: 'Collector' },
    ]
}));

Kaboom.scene('level4', () => drawLevel({
    level: 4,
    tagline: 'A new addition?',
    types: ['banana', 'jalapeno'],
    dropRate: 1,
    money: 20,
    health: 10,
    scoville: 18,
    layout: [
        { x: 11, y: 0, type: 'Fan', angle: 270 },
        { x: 0, y: 1, type: 'Fan', angle: 270 },
        
        { x: 1, y: 1, type: 'Block' },
        { x: 2, y: 1, type: 'Block' },
        { x: 3, y: 1, type: 'Block' },
        { x: 4, y: 1, type: 'Block' },
        { x: 5, y: 1, type: 'Block' },
        { x: 6, y: 1, type: 'Block' },
        { x: 7, y: 1, type: 'Block' },
        { x: 8, y: 1, type: 'Block' },
        { x: 9, y: 1, type: 'Block' },
        { x: 10, y: 1, type: 'Block' },
        { x: 11, y: 1, type: 'Block' },

        { x: 1, y: 2, type: 'Block' },
        { x: 2, y: 2, type: 'Fan', angle: 90 },
        
        { x: 0, y: 5, type: 'Slope', angle: 90 },
        { x: 1, y: 6, type: 'Slope', angle: 90 },
        { x: 2, y: 6, type: 'Fan' },
        { x: 3, y: 6, type: 'Fan' },
        { x: 2, y: 7, type: 'Block' },
        { x: 3, y: 7, type: 'Block' },

        { x: 6, y: 4, type: 'Milk' },
        { x: 6, y: 5, type: 'Milk' },
        
        { x: 10, y: 3, type: 'Collector' },
    ],
    tutorial: [
        { x: 10, y: 410, w: Screen.maxLeft-20, h: 180, textX: 20, textY: 200, text: "This section lets you know what types of peppers you have.\n\n\nThe redder the pepper, the faster it falls.\n\nI wonder if there's a way to lighten these peppers a bit..." }
    ]
}));

Kaboom.scene('level5', () => drawLevel({
    level: 5,
    tagline: 'A layer or two ... or three',
    types: ['jalapeno'],
    dropRate: 1,
    money: 60,
    health: 10,
    scoville: 12,
    layout: [
        { x: 11, y: -1, type: 'Fan', angle: 270 },
        
        { x: 2, y: 0, type: 'Block' },
        { x: 3, y: 0, type: 'Block' },
        { x: 4, y: 0, type: 'Block' },
        { x: 5, y: 0, type: 'Block' },
        { x: 6, y: 0, type: 'Block' },
        { x: 7, y: 0, type: 'Block' },
        { x: 8, y: 0, type: 'Block' },
        { x: 9, y: 0, type: 'Block' },
        { x: 10, y: 0, type: 'Block' },
        { x: 11, y: 0, type: 'Block' },
        
        { x: 0, y: 3, type: 'Block' },
        { x: 1, y: 3, type: 'Block' },
        { x: 2, y: 3, type: 'Block' },
        { x: 3, y: 3, type: 'Block' },
        { x: 4, y: 3, type: 'Milk' },
        
        { x: 11, y: 6, type: 'Block' },
        { x: 10, y: 6, type: 'Block' },
        { x: 9, y: 6, type: 'Block' },
        { x: 8, y: 6, type: 'Block' },
        { x: 7, y: 6, type: 'Milk' },
                
        { x: 1, y: 5, type: 'Collector' },
    ]
}));

Kaboom.scene('level6', () => drawLevel({
    level: 6,
    tagline: 'Even spicier?',
    types: ['habanero'],
    dropRate: 1,
    money: 100,
    health: 10,
    scoville: 15,
    layout: [
        { x: 0, y: -1, type: 'Fan', angle: 90 },
        { x: 11, y: 0, type: 'Fan', angle: 270 },
        { x: 2, y: 1, type: 'Fan', angle: 270 },
        
        { x: 0, y: 0, type: 'Block' },
        { x: 1, y: 0, type: 'Block' },
        { x: 0, y: 1, type: 'Block' },
        { x: 1, y: 1, type: 'Block' },
        { x: 3, y: 1, type: 'Block' },
        { x: 4, y: 1, type: 'Block' },
        { x: 5, y: 1, type: 'Block' },
        { x: 6, y: 1, type: 'Block' },
        { x: 7, y: 1, type: 'Block' },
        { x: 8, y: 1, type: 'Block' },
        { x: 9, y: 1, type: 'Block' },
        { x: 10, y: 1, type: 'Block' },
        { x: 11, y: 1, type: 'Block' },
        
        { x: 2, y: 3, type: 'Slope', angle: 90 },
        
        { x: 0, y: 5, type: 'Milk' },
        { x: 1, y: 5, type: 'Milk' },
        { x: 2, y: 5, type: 'Milk' },
        { x: 3, y: 5, type: 'Milk' },
        { x: 4, y: 5, type: 'Milk' },
        { x: 5, y: 5, type: 'Milk' },
        { x: 6, y: 5, type: 'Milk' },
        { x: 10, y: 5, type: 'Milk' },
        { x: 11, y: 5, type: 'Milk' },

        { x: 2, y: 6, type: 'Collector' },
    ]
}));

Kaboom.scene('level7', () => drawLevel({
    level: 7,
    tagline: 'That\'s a bit of milk',
    types: ['jalapeno'],
    dropRate: 1,
    money: 100,
    health: 10,
    scoville: 15,
    layout: [
        { x: 11, y: -1, type: 'Fan', angle: 270 },
        { x: 0, y: -1, type: 'Fan', angle: 90 },
        
        { x: 0, y: 0, type: 'Block' },
        { x: 1, y: 0, type: 'Block' },
        { x: 2, y: 0, type: 'Block' },
        { x: 3, y: 0, type: 'Block' },
        { x: 4, y: 0, type: 'Block' },
        { x: 5, y: 0, type: 'Stopper' },
        { x: 6, y: 0, type: 'Stopper' },
        { x: 7, y: 0, type: 'Block' },
        { x: 8, y: 0, type: 'Block' },
        { x: 9, y: 0, type: 'Block' },
        { x: 10, y: 0, type: 'Block' },
        { x: 11, y: 0, type: 'Block' },

        { x: 5, y: 2, type: 'Slope' },
        { x: 6, y: 2, type: 'Slope', angle: 90 },
        
        { x: 2, y: 2, type: 'Milk' },
        { x: 5, y: 5, type: 'Milk' },
        { x: 8, y: 3, type: 'Milk' },
                
        { x: 3, y: 8, type: 'Collector' },
        { x: 8, y: 8, type: 'Collector' },
    ]
}));

Kaboom.scene('level8', () => drawLevel({
    level: 8,
    tagline: 'A tight fit',
    types: ['banana'],
    dropRate: 1,
    money: 75,
    health: 10,
    scoville: 4,
    layout: [
        { x: 11, y: -1, type: 'Fan', angle: 270 },
        { x: 0, y: -1, type: 'Fan', angle: 90 },
        
        { x: 0, y: 0, type: 'Block' },
        { x: 1, y: 0, type: 'Block' },
        { x: 2, y: 0, type: 'Block' },
        { x: 3, y: 0, type: 'Block' },
        { x: 4, y: 0, type: 'Block' },
        { x: 5, y: 0, type: 'Fan', angle: 270 },
        { x: 6, y: 0, type: 'Block' },
        { x: 7, y: 0, type: 'Block' },
        { x: 8, y: 0, type: 'Block' },
        { x: 9, y: 0, type: 'Block' },
        { x: 10, y: 0, type: 'Block' },
        { x: 11, y: 0, type: 'Block' },

        { x: 5, y: 3, type: 'Stopper' },
        
        { x: 8, y: 1, type: 'Milk' },
        { x: 8, y: 2, type: 'Milk' },
        { x: 8, y: 4, type: 'Milk' },
        { x: 8, y: 5, type: 'Milk' },
        { x: 8, y: 6, type: 'Milk' },
        { x: 8, y: 7, type: 'Milk' },
        { x: 8, y: 8, type: 'Milk' },
        { x: 8, y: 9, type: 'Milk' },
        { x: 8, y: 10, type: 'Milk' },
        { x: 10, y: 9, type: 'Collector' },
    ]
}));

Kaboom.scene('level9', () => drawLevel({
    level: 9,
    tagline: 'Sandbox',
    types: ['banana', 'jalapeno', 'habanero', 'ghost'],
    dropRate: 1,
    money: 1000000,
    health: 10000000,
    scoville: 39304233,
    tutorial: [
        { textX: 20, textY: 200, text: "Congrats! You've collected all of the hot sauces we've thrown at you\n\n\nSince you've solved everything we have to offer, try making your own level in this sandbox\n\nWith too much money and too much health, what will you make?" }
    ]
}));