import { Screen, DeathMessages, Kaboom, Game, Colors } from './initialize';

function drawKey(character, x, y) {
    Kaboom.add([
        Kaboom.sprite('key'),
        Kaboom.pos(x, y),
        Kaboom.scale(Math.max(0.64, character.length/3), 1),
        Kaboom.layer('ui'),
        Kaboom.origin('center')
    ]);
    Kaboom.add([
        Kaboom.pos(x, y),
        Kaboom.text(character, {
            font: 'sink',
            size: 16
        }),
        Kaboom.origin('center'),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.layer('ui')
    ]);
}

export default function draw(game: Game) {
    Kaboom.layers([
        'cover', // death screen
        'uitop',
        'ui',
        'uibottom',
        'gametop',
        'game', // peppers
        'gamebottom', // modules
        'background'
    ].reverse(), 'game');

    // Background
    Kaboom.add([
        Kaboom.pos(-50, -50),
        Kaboom.rect(2450, 650),
        Kaboom.scale(1.8, 1.2),
        Colors.right,
        Kaboom.layer('background')
    ]);
    
    // Sawtooth pattern over background
    Kaboom.add([
        Kaboom.sprite('sawtooth'),
        Kaboom.pos(Screen.kaboomWidth/2, 300),
        Kaboom.origin('center'),
        Kaboom.layer('background'),
        Kaboom.opacity(0.1)
    ]);
    
    // Spice zone where peppers go
    Kaboom.add([
        Kaboom.sprite('background'),
        Kaboom.pos(Screen.kaboomWidth/2, 300),
        Kaboom.origin('center'),
        Kaboom.layer('background')
    ]);

    // Death screen
    const death = Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.rect(2450, 650),
        Kaboom.color(Kaboom.hsl2rgb(0, 1, 0.22)),
        Kaboom.opacity(0),
        Kaboom.layer('cover')
    ]);

    // I love death messages so much
    const deathText = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2, 200),
        Kaboom.text(DeathMessages[Math.floor(Math.random() * DeathMessages.length)], {
            font: "apl386",
            size: 40,
            lineSpacing: 10,
            letterSpacing: 5
        }),
        Kaboom.color(Kaboom.WHITE),
        Kaboom.origin('center'),
        Kaboom.opacity(0),
        Kaboom.layer('cover')
    ]);

    const deathReplay = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth-20, 580),
        Kaboom.text('Press [Enter] to replay', {
            font: 'sink',
            size: 16
        }),
        Kaboom.opacity(0),
        Kaboom.color(191, 191, 191),
        Kaboom.origin('botright'),
        Kaboom.layer('cover')
    ]);

    // Health bar
    const healthBar = Kaboom.add([
        Kaboom.pos(Screen.centerLeft-50, 360),
        Kaboom.rect(100, 40),
        Kaboom.outline(5),
        Kaboom.color(Kaboom.RED),
        Kaboom.layer('ui')
    ]);
    const healthTracker = Kaboom.add([
        Kaboom.pos(Screen.centerLeft-50, 360),
        Kaboom.rect(100, 40),
        Kaboom.outline(5),
        Kaboom.color(Kaboom.GREEN),
        Kaboom.layer('ui')
    ]);

    // Amount of collected scovilles
    const collected = Kaboom.add([
        Kaboom.pos(Screen.centerLeft, 25),
        Kaboom.text('0%', {
            font: 'apl386o',
            size: 48,
        }),
        Colors.rightDark,
        Kaboom.origin('top')
    ]);

    // Hot sauce bottle
    const bottle = Kaboom.add([
        Kaboom.sprite('hotsauce'),
        Kaboom.scale(0.35),
        Kaboom.pos(Screen.centerLeft-50, 90),
        Kaboom.layer('ui')
    ]);
    const sauce = Kaboom.add([
        Kaboom.pos(Screen.centerLeft-48, 317),
        Kaboom.rect(96, 110),
        Kaboom.scale(1, 0),
        Kaboom.color(255, 203, 14),
        Kaboom.layer('uibottom')
    ])

    // Money
    const money = Kaboom.add([
        Kaboom.pos(Screen.centerRight, 25),
        Kaboom.text(`$${game.money}`, {
            size: 48,
            width: 130,
            font: 'apl386o'
        }),
        Colors.rightDark,
        Kaboom.origin('top'),
        Kaboom.layer('ui')
    ]);

    const startText = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2, 15),
        Kaboom.text(`Press [Backspace] to Start Wave`, {
            size: 28,
            font: 'apl386o'
        }),
        Kaboom.origin('top'),
        Kaboom.layer('ui'),
        Kaboom.color(Kaboom.WHITE)
    ]);
    const pausedText = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2, 15),
        Kaboom.text(`Press [Space] to Unpause`, {
            size: 28,
            font: 'apl386o'
        }),
        Kaboom.origin('top'),
        Kaboom.layer('ui'),
        Kaboom.color(Kaboom.WHITE),
        Kaboom.opacity(0)
    ]);

    // Module selector background
    Kaboom.add([
        Kaboom.pos(Screen.centerRight, 225),
        Kaboom.rect(60, 60),
        Colors.rightLight,
        Kaboom.outline(2, Kaboom.hsl2rgb(0, 0, 0.2)),
        Kaboom.origin('center'),
        Kaboom.layer('ui')
    ]);

    // Module title
    const moduleTitle = Kaboom.add([
        Kaboom.pos(Screen.centerRight, 340),
        Kaboom.text('huh', {
            font: 'apl386',
            width: 140,
            size: 24
        }),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.origin('top'),
        Kaboom.layer('ui')
    ]);
    const modulePrice = Kaboom.add([
        Kaboom.pos(Screen.centerRight, 365),
        Kaboom.text('1 bobux', {
            font: 'apl386',
            width: 140,
            size: 24
        }),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.origin('top'),
        Kaboom.layer('ui')
    ]);
    const moduleDescription = Kaboom.add([
        Kaboom.pos(Screen.centerRight, 400),
        Kaboom.text('description desciptinot sionetp fiodsaoiasf lorem ipsum asdfasdfas', {
            font: 'apl386',
            width: 140,
            size: 20,
            letterSpacing: -2
        }),
        Kaboom.color(33, 33, 33),
        Kaboom.origin('top'),
        Kaboom.layer('ui')
    ]);
    
    drawKey('↑', Screen.centerRight, 160);
    drawKey('↓', Screen.centerRight, 290);
    drawKey('Esc', Screen.kaboomWidth-35, 575);

    // Settings
    const settingsBackground = Kaboom.add([
        Kaboom.pos(-50, -50),
        Kaboom.rect(2500, 700),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.opacity(0),
        Kaboom.layer('cover'),
    ]);
    const settingsOutline = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2, 300),
        Kaboom.rect(410, 570),
        Colors.rightDark,
        Kaboom.origin('center'),
        Kaboom.layer('cover'),
        Kaboom.opacity(0)
    ]);
    const settings = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2, 300),
        Kaboom.rect(400, 560),
        Colors.right,
        Kaboom.origin('center'),
        Kaboom.layer('cover'),
        Kaboom.opacity(0)
    ]);
    const settingsLevel = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2, 30),
        Kaboom.text('Level ' + game.level, {
            font: 'apl386o',
            size: 40
        }),
        Colors.rightDark,
        Kaboom.origin('top'),
        Kaboom.layer('cover'),
        Kaboom.opacity(0)
    ])
    const settingsText = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2-190, 90),
        Kaboom.text('Controls:\n\n\nUse WASD or mouse to move pointer\n\nPress Enter or click to place object\n\nPress X or Del to delete a object\n\nPress the left or right arrows to rotate object\n\nPress R to reset level, press space to pause level\n\nPress O to go back a level, press P to skip a level', {
            font: 'apl386',
            size: 20,
            width: 360
        }),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.origin('topleft'),
        Kaboom.layer('cover'),
        Kaboom.opacity(0)
    ]);
    const settingsBackText = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth/2 + 190, 570),
        Kaboom.text('Press [Esc] to Play', {
            font: 'sinko',
            size: 16
        }),
        Kaboom.origin('botright'),
        Kaboom.color(191, 191, 191),
        Kaboom.layer('cover'),
        Kaboom.opacity(0)
    ]);

    // Peppers
    const banana = Kaboom.add([
        Kaboom.sprite('greenPepper'),
        Kaboom.pos(Screen.centerLeft-30, 460),
        Kaboom.scale(0.085),
        Kaboom.origin('center'),
        Kaboom.opacity(0.25)
    ]);
    const jalapeno = Kaboom.add([
        Kaboom.sprite('yellowPepper'),
        Kaboom.pos(Screen.centerLeft+30, 460),
        Kaboom.scale(0.085),
        Kaboom.origin('center'),
        Kaboom.opacity(0.25)
    ]);
    const habanero = Kaboom.add([
        Kaboom.sprite('orangePepper'),
        Kaboom.pos(Screen.centerLeft-30, 540),
        Kaboom.scale(0.085),
        Kaboom.origin('center'),
        Kaboom.opacity(0.25)
    ]);
    const ghost = Kaboom.add([
        Kaboom.sprite('redPepper'),
        Kaboom.pos(Screen.centerLeft+30, 540),
        Kaboom.scale(0.085),
        Kaboom.origin('center'),
        Kaboom.opacity(0.25)
    ]);
    

    return {
        money,
        sauce,
        bottle,
        collected,
        healthTracker,
        healthBar,
        deathText,
        death,
        deathReplay,
        startText,
        moduleTitle,
        modulePrice,
        moduleDescription,
        pausedText,
        settings,
        settingsOutline,
        settingsBackground,
        settingsLevel,
        settingsText,
        settingsBackText,
        banana,
        jalapeno,
        habanero,
        ghost
    };
}