class UniversalFunc {
    constructor() {

    }

    dialog(string, name) {
        var boxStroke = createSprite(310, 480, 606, 146);
        boxStroke.shapeColor = color(164, 135, 108);
        var box = createSprite(310, 480, 600, 140);
        box.shapeColor = color(184, 194, 180);

        var picture = createSprite(80, 480, 120, 120);
        picture.shapeColor = 'black';

        textSize(18);
        text(name, 150, 440);

        textSize(12);
        var t = string.match(/[\s\S]{1,80}(?!\S)/g, '$&\n');
        for (let i = 0; i < t.length; i++) {
            text(t[i], 150, 460 + (15 * i));
        }

        text('> Pressione "E" para continuar', 430, 540);
    }

    walk(entity) {
        if (!state.isWalking) {
            entity.sprite.changeAnimation("idle");
        } else {
            entity.sprite.changeAnimation(state.isWalking);
        }

        if (keyDown("w")) {
            state.isWalking = 'up';
            entity.sprite.position.y -= 8.5;
        } else if (keyDown("a")) {
            state.isWalking = 'left';
            entity.sprite.position.x -= 8.5;
        } else if (keyDown("s")) {
            state.isWalking = 'down';
            entity.sprite.position.y += 8.5;
        } else if (keyDown("d")) {
            state.isWalking = 'right';
            entity.sprite.position.x += 8.5;
        } else {
            state.isWalking = false;
        }
    }
}