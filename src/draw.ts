import { DeathMessages, Kaboom, Game, Colors } from './initialize';

export default function draw(game: Game) {
    Kaboom.layers([
        'uitop',
        'ui',
        'uibottom',
        'gametop',
        'game',
        'gamebottom',
        'background'
    ].reverse(), 'game');

    // Background
    Kaboom.add([
        Kaboom.pos(-50, -50),
        Kaboom.rect(950, 650),
        Kaboom.scale(1.8, 1.2),
        Colors.right,
        Kaboom.layer('background')
    ]);
    
    // Spice zone where peppers go
    Kaboom.add([
        Kaboom.pos(150, 0),
        Kaboom.rect(600, 600),
        Kaboom.outline(5),
        Colors.baseUnsaturated,
        Kaboom.layer('background')
    ]);

    // Death screen
    const death = Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.rect(900, 600),
        Kaboom.color(Kaboom.hsl2rgb(0, 1, 0.22)),
        Kaboom.opacity(0),
        Kaboom.layer('uitop')
    ]);

    // I love death messages so much
    const deathText = Kaboom.add([
        Kaboom.pos(450, 200),
        Kaboom.text(DeathMessages[Math.floor(Math.random() * DeathMessages.length)], {
            font: "apl386",
            size: 40,
            lineSpacing: 10,
            letterSpacing: 5
        }),
        Kaboom.color(Kaboom.WHITE),
        Kaboom.origin('center'),
        Kaboom.opacity(0),
        Kaboom.layer('uitop')
    ]);

    // Health bar
    const healthBar = Kaboom.add([
        Kaboom.pos(25, 360),
        Kaboom.rect(100, 40),
        Kaboom.outline(5),
        Kaboom.color(Kaboom.RED),
        Kaboom.layer('ui')
    ]);
    const healthTracker = Kaboom.add([
        Kaboom.pos(25, 360),
        Kaboom.rect(100, 40),
        Kaboom.outline(5),
        Kaboom.color(Kaboom.GREEN),
        Kaboom.layer('ui')
    ]);

    // Amount of collected scovilles
    const collected = Kaboom.add([
        Kaboom.pos(75, 25),
        Kaboom.text('0%', {
            font: 'apl386',
            size: 48,
        }),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.origin('top')
    ]);

    // Hot sauce bottle
    const bottle = Kaboom.add([
        Kaboom.sprite('hotsauce'),
        Kaboom.scale(0.35),
        Kaboom.pos(25, 90),
        Kaboom.layer('ui')
    ]);
    const sauce = Kaboom.add([
        Kaboom.pos(27, 317),
        Kaboom.rect(96, 110),
        Kaboom.scale(1, -1),
        Kaboom.color(255, 203, 14),
        Kaboom.layer('uibottom')
    ])

    // Money
    const money = Kaboom.add([
        Kaboom.pos(825, 25),
        Kaboom.text(`$${game.money}`, {
            size: 48,
            width: 130,
            font: 'apl386'
        }),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.origin('top'),
        Kaboom.layer('ui')
    ]);

    return {
        money,
        sauce,
        bottle,
        collected,
        healthTracker,
        healthBar,
        deathText,
        death
    }
}