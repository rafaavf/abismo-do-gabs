class Elements {
    constructor (){

    }

    menuButton (x,y,w,h,color,text) {
        var button = createSprite (x,y,w,h);
        button.shapeColor=color;
        text(text,
            (x-text.lenght)-x-text.lenght/2,
            y/2);
    }
}