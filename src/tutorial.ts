import { Kaboom, Game, Screen } from './initialize';

export default async function Tutorial(tutorial): Promise<any> {
    if(!tutorial.length) return;
    const slide = tutorial[0];
    slide.x ||= 0;
    slide.y ||= 0;
    slide.w ||= 0;
    slide.h ||= 0;

    // Rectangles around box
    const r1 = Kaboom.add([
        Kaboom.pos(0, 0),
        Kaboom.rect(Screen.kaboomWidth, slide.y),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.opacity(0.7),
        Kaboom.layer('cover'),
    ]);
    const r2 = Kaboom.add([
        Kaboom.pos(0, slide.y),
        Kaboom.rect(slide.x, slide.h),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.opacity(0.7),
        Kaboom.layer('cover'),
    ]);
    const r3 = Kaboom.add([
        Kaboom.pos(0, slide.y+slide.h),
        Kaboom.rect(Screen.kaboomWidth, 600),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.opacity(0.7),
        Kaboom.layer('cover'),
    ]);
    const r4 = Kaboom.add([
        Kaboom.pos(slide.x+slide.w, slide.y),
        Kaboom.rect(Screen.kaboomWidth, slide.h),
        Kaboom.color(Kaboom.BLACK),
        Kaboom.opacity(0.7),
        Kaboom.layer('cover'),
    ]);

    // Text
    const text = Kaboom.add([
        Kaboom.pos(slide.textX, slide.textY),
        Kaboom.text(slide.text, {
            font: 'apl386',
            size: 24,
            width: slide.textW || Screen.kaboomWidth*2/3
        }),
        Kaboom.color(slide.textColor || Kaboom.WHITE),
        Kaboom.layer('cover'),
    ]);

    // Next
    const nextPage = Kaboom.add([
        Kaboom.pos(Screen.kaboomWidth-20, 580),
        Kaboom.text('Click or press [Enter] to go to next page', {
            font: 'sink',
            size: 16,
        }),
        Kaboom.origin('botright'),
        Kaboom.layer('cover'),
        Kaboom.color(191, 191, 191)
    ]);
    
    await new Promise(resolve => {
        const next = () => {  
            resolve();
            Kaboom.destroy(r1);
            Kaboom.destroy(r2);
            Kaboom.destroy(r3);
            Kaboom.destroy(r4);
            Kaboom.destroy(text);
            Kaboom.destroy(nextPage);
        }
        Kaboom.onKeyPress('enter', next);
        Kaboom.onMousePress(next);
    });
    return await Tutorial(tutorial.slice(1));
}