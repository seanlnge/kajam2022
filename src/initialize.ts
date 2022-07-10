import kaboom from 'kaboom';

export const Kaboom = kaboom({
    global: false,
    canvas: document.querySelector('#canvas'),
    width: 2400,
    height: 600
});

export const ComputeScreen = () => {
    Screen.innerWidth = window.innerWidth;
    Screen.innerHeight = window.innerHeight;
    Screen.width = window.innerWidth;
    Screen.height = window.innerHeight;
    Screen.ratio = window.innerWidth/window.innerHeight;
    Screen.kaboomWidth = window.innerWidth/window.innerHeight*600;
    Screen.centerLeft = window.innerWidth/window.innerHeight*150 - 150;
    Screen.centerRight = window.innerWidth/window.innerHeight*450 + 150;
    Screen.maxLeft = window.innerWidth/window.innerHeight*300 - 300;
    Screen.minRight = window.innerWidth/window.innerHeight*300 + 300;
}

export const Screen = {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: window.innerWidth/window.innerHeight,
    kaboomWidth: window.innerWidth/window.innerHeight*600,
    centerLeft: window.innerWidth/window.innerHeight*150 - 150,
    centerRight: window.innerWidth/window.innerHeight*450 + 150,
    maxLeft: window.innerWidth/window.innerHeight*300 - 300,
    minRight: window.innerWidth/window.innerHeight*300 + 300
};

export const DeathMessages = [
    "You couldn't handle the heat.",
    "You weren't spicy enough.",
    "You lost to a vegetable.",
    "L.",
    "Go outside.",
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
    rightLight: Kaboom.color(255, 191, 155),
    rightDark: Kaboom.color(181, 22, 0),
    rightSaturated: Kaboom.color(255, 44, 0),
    left: Kaboom.color(255, 216, 94),
    leftSaturated: Kaboom.color(255, 194, 0),
    leftComplementary: Kaboom.color(219, 32, 255)
};

export const TitleScene = async() => {
    const background = Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.sprite('titleBackground')
    ]);
    
    Kaboom.onKeyPress('enter', () => Kaboom.go('level1'));
    Kaboom.onMouseDown(() => Kaboom.go('level1'));
}
export const LoadingScene = async () => {
    const loadingBackground = Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.rect(2400, 600),
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

    // All peppers
    await Kaboom.loadSprite('redPepper', 'https://i.imgur.com/sPjXzke.png');
    await Kaboom.loadSprite('orangePepper', 'https://i.imgur.com/QzhGV8E.png');
    await Kaboom.loadSprite('yellowPepper', 'https://i.imgur.com/nAvxjj6.png');
    await Kaboom.loadSprite('greenPepper', 'https://i.imgur.com/zNkVO7e.png');

    // All modules
    await Kaboom.loadSprite('slope', 'https://i.imgur.com/owSAolg.png');
    await Kaboom.loadSprite('fan', 'https://i.imgur.com/rEdOhyU.png');
    await Kaboom.loadSprite('magnet', 'https://i.imgur.com/wBePjB2.png');
    await Kaboom.loadSprite('bouncer', 'https://i.imgur.com/IzR6gS5.png');
    await Kaboom.loadSprite('block', 'https://i.imgur.com/TyewfZt.png');
    await Kaboom.loadSprite('stopper', 'https://i.imgur.com/AvqJwkj.png');
    await Kaboom.loadSprite('helium', 'https://i.imgur.com/b0H6HR5.png');
    await Kaboom.loadSprite('milk', 'https://i.imgur.com/P6es4JK.png');
    await Kaboom.loadSprite('collector', 'https://i.imgur.com/ZIcXn2W.png');

    // Miscellaneous
    await Kaboom.loadSprite('hotsauce', 'https://i.imgur.com/FEf44xX.png');
    await Kaboom.loadSprite('sawtooth', 'https://i.imgur.com/fX8OBRH.png');
    await Kaboom.loadSprite('background', 'https://i.imgur.com/iUAYcv2.png');
    await Kaboom.loadSprite('key', 'https://i.imgur.com/04T9tNJ.png');
    await Kaboom.loadSprite('click', 'https://i.imgur.com/zrGJAmv.png');
    await Kaboom.loadSprite('titleBackground', 'https://i.imgur.com/0ADmTnj.jpg');
    await Kaboom.loadSound('spicySong', 'assets/spicy.mp3');
    
    Kaboom.destroy(loadingBackground);
    Kaboom.destroy(loadingText);
    Kaboom.go('title');
};

export interface Game {
    chances: { [string]: number },
    dropRate: number,
    money: number,
    health: number,
    scoville: number,
    level: number,
    layout: {
        x: number,
        y: number,
        type: string,
        angle: number,
        noDelete: boolean,
        noRotate: boolean
    }[],
    tutorial?: {
        x?: number,
        y?: number,
        w?: number,
        h?: number,
        textX: number,
        textY: number,
        text: string
    }[]
}