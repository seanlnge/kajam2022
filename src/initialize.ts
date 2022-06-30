import kaboom from 'kaboom';

export const Kaboom = kaboom({
    global: false,
    canvas: document.querySelector('#canvas'),
    width: 900,
    height: 600
});

export const DeathMessages = [
    "You couldn't handle the heat.",
    "You weren't spicy enough.",
    "You lost to a vegetable.",
    "L.",
    "Lmfao.",
    "Go outside.",
    "Touch grass.",
    "Capsaicin hurts, doesn't it.",
    "He need some milk.",
];

// color scheme https://paletton.com/#uid=33u0y0kkgwNRcHoFfRS3Hs35lkY
export const Colors = {
    base: Kaboom.color(66, 128, 165),
    baseSaturated: Kaboom.color(9, 147, 229),
    baseDoublySaturated: Kaboom.color(3, 125, 198),
    baseUnsaturated: Kaboom.color(136, 161, 176),
    right: Kaboom.color(255, 122, 94),
    rightSaturated: Kaboom.color(255, 44, 0),
    left: Kaboom.color(255, 216, 94),
    leftSaturated: Kaboom.color(255, 194, 0),
    leftComplementary: Kaboom.color(219, 32, 255)
};

export const LoadingScene = async () => {
    const loadingBackground = Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.rect(900, 600),
        Kaboom.color(Kaboom.BLACK)
    ]);
    const loadingText = Kaboom.add([
        Kaboom.pos(20, 200),
        Kaboom.text("Loading...", {
            font: 'apl386',
            size: 40
        }),
        Kaboom.color(Kaboom.WHITE)
    ]);
    await Kaboom.loadSprite('redPepper', 'https://i.imgur.com/GORZJ5C.png');
    await Kaboom.loadSprite('orangePepper', 'https://i.imgur.com/lB3RBsX.png');
    await Kaboom.loadSprite('yellowPepper', 'https://i.imgur.com/KxeHlMf.png');
    await Kaboom.loadSprite('greenPepper', 'https://i.imgur.com/Hz10RXC.png');

    await Kaboom.loadSprite('slope', 'https://i.imgur.com/owSAolg.png');
    await Kaboom.loadSprite('repulsor', 'https://i.imgur.com/rEdOhyU.png');
    await Kaboom.loadSprite('attractor', 'https://i.imgur.com/6c9ZQyq.png');
    await Kaboom.loadSprite('bouncer', 'https://i.imgur.com/IzR6gS5.png');
    
    await Kaboom.loadSprite('hotsauce', 'https://i.imgur.com/FEf44xX.png');

    Kaboom.destroy(loadingBackground);
    Kaboom.destroy(loadingText);
    Kaboom.go('level1');
};

export interface Game {
    chances: { [string]: number },
    dropRate: number,
    money: number,
    health: number,
    scoville: number,
    level: number,
}