var state = {
  gamestate: 'menu',
  userData: undefined,
  isWalking: false
}

var db = firebase.database();
const userId = getCookie('_userid');

var mari = {
  sprite: undefined,
  animation: {
    right: undefined,
    left: undefined,
    up: undefined,
    down: undefined,
    idle: undefined
  }
}

function preload() {
  mari.animation.right = loadAnimation('./assets/mariRight1.png', './assets/mariRight2.png', './assets/mariRight3.png');
  mari.animation.left = loadAnimation('./assets/mariLeft1.png', './assets/mariLeft2.png', './assets/mariLeft3.png');
  mari.animation.up = loadAnimation('./assets/mariUp1.png', './assets/mariUp2.png', './assets/mariUp3.png');
  mari.animation.down = loadAnimation('./assets/mariDown1.png', './assets/mariDown2.png', './assets/mariDown3.png');
  mari.animation.idle = loadAnimation('./assets/mariDown2.png');
}

function setup() {
  createCanvas(620, 560);
  menu = new Menu;
  play = new Play;
  universalFunc = new UniversalFunc;

  mari.sprite = createSprite(310, 280, 100, 100);
  mari.sprite.scale=1.7;

  mari.sprite.addAnimation("right", mari.animation.right);
  mari.sprite.addAnimation("up", mari.animation.up);
  mari.sprite.addAnimation("left", mari.animation.left);
  mari.sprite.addAnimation("down", mari.animation.down);
  mari.sprite.addAnimation("idle", mari.animation.idle);

  if (state.gamestate === 'menu') {
    console.log(state.gamestate + ' ' + userId);
    frameRate(27);
    menu.menuButtons();
    initializeData();
  }
  // oi maci


}

function draw() {
  background(220);
  translate(620 / 2 - mari.sprite.x, 560 / 2 - mari.sprite.y);

  universalFunc.walk(mari);

  drawSprites();
}

function initializeData() {
  db.ref('games/games_users/' + userId + '/maconha/')
    .on("value", snapshot => {
      var data = snapshot.val();
      if (data == null) {
        console.log('yeah');
      } else {
        state.userData = snapshot.val();
      }
    })
}

function getCookie(name) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(name + "=") === 0) {
      return cookie.substring(name.length + 1, cookie.length);
    }
  }
  return "";
}