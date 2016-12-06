// camera.js
// The logic behind drawing the tilemap.
//  The camera enables drawing things in the map. It must be
// attached to a chara, and the screen will scroll following
// that chara - it's hard coded panToChara(player), so it
// will follow the player, but this can be loosen to follow
// any chara.

var camera = {};
//camera.width = 16;
//camera.height = 10;
camera.x = 0;
camera.y = 0;
camera.finex = 0;
camera.finey = 0;

camera.setupMap = function(_worldLevel, _engine) {
    this.maxWorldWidth = _worldLevel["Level"]["layer1"][0].length;
    this.maxWorldHeight = _worldLevel["Level"]["layer1"].length;
}

camera.setupCanvas = function() {
    this.yerror = 1 - (screen.GHEIGHT / 32) % 2;
    this.xerror = 1 - (screen.GWIDTH / 32) % 2;
    this.width = Math.floor(screen.GWIDTH / 32) + 1;
    this.height = Math.floor(screen.GHEIGHT / 32) + 1;
    this.halfWidth = Math.floor(this.width / 2);
    this.halfHeight = Math.floor(this.height / 2);
}

camera.panToChara = function(chara) {

    charatilex = Math.floor(chara.mapx / 32);
    charatiley = Math.floor(chara.mapy / 32) + 1;

    if (charatilex > this.halfWidth && charatilex < this.maxWorldWidth - this.halfWidth) {
        this.x = charatilex;
        this.finex = chara.mapx % 32;
    } else {
        if (charatilex == this.halfWidth) {
            this.x = this.halfWidth;
            this.finex = chara.mapx % 32;
        } else if (charatilex < this.halfWidth) {
            this.x = this.halfWidth;
            this.finex = 0
        } else if (charatilex == this.maxWorldWidth - this.halfWidth - this.xerror) {
            this.x = this.maxWorldWidth - this.halfWidth - this.xerror;
            this.finex = chara.mapx % 32;
        } else {
            this.x = this.maxWorldWidth - this.halfWidth - this.xerror;
            this.finex = 30
        }
    }

    if (charatiley > this.halfHeight && charatiley < this.maxWorldHeight - this.halfHeight) {
        this.y = charatiley;
        this.finey = chara.mapy % 32;
    } else {
        if (charatiley == this.halfHeight) {
            this.y = this.halfHeight;
            this.finey = chara.mapy % 32;
        } else if (charatiley < this.halfHeight) {
            this.y = this.halfHeight;
            this.finey = 0
        } else if (charatiley == this.maxWorldHeight - this.halfHeight - this.yerror) {
            this.y = this.maxWorldHeight - this.halfHeight - this.yerror;
            this.finey = chara.mapy % 32;
        } else {
            this.y = this.maxWorldHeight - this.halfHeight - this.yerror;
            this.finey = 30
        }
    }

    this.x -= this.halfWidth
    this.y -= this.halfHeight

}

camera.drawMapLayer = function(_worldLevel, _zIndex) {

    var targetFrame = Math.floor(screen.frameCount / 8) % 4;

    var vx = 0,
        vy = 0,
        currentTile, tileNumber;

    var screenx = 0,
        screeny = 0;

    this.panToChara(engine.charaToPan)

    initX = Math.max(0, this.x)
    initY = Math.max(0, this.y)
    EndX = Math.min(this.maxWorldWidth, this.x + this.width)
    EndY = Math.min(this.maxWorldHeight, this.y + this.height)


    for (vx = initX, screenx = 0; vx < EndX; vx++, screenx++) {
        for (vy = initY, screeny = 0; vy < EndY; vy++, screeny++) {
            tileNumber = _worldLevel.Level[_zIndex][vy][vx]
            currentTile = _worldLevel.Level.tiles[tileNumber];
            if (_worldLevel.Level.tilesAnimated[tileNumber]) {
                currentTile = _worldLevel.Level.tilesAnimated[tileNumber][targetFrame]
            }


            if (!currentTile || tileNumber == 0) continue;
            screen.drawTile(resources.tileset, currentTile, [32 * screenx - this.finex, 32 * screeny - this.finey]);
        }
    }

}

camera.drawChar = function(chara) {
    var charaAnimation = null
    if(chara.invisible){
      return;
    }

    if(chara.curr_animation){
        charaAnimation = chara.charaset[chara.curr_animation][chara.facing]
    } else if (chara.steps){
        charaAnimation = chara.charaset.walking[chara.facing]
    } else {
        charaAnimation = chara.charaset.standing[chara.facing]
    }

    var targetFrame = Math.floor(screen.frameCount / 4) % charaAnimation.length;

    var screenx = 0,
        screeny = 0;

    screenx = chara.mapx - (this.x * 32 + this.finex)
    screeny = chara.mapy - (this.y * 32 + this.finey)

    screen.drawChara(resources.charasetimg, charaAnimation, targetFrame, [screenx, screeny])

}

function compareSprites(a, b) {
    if (a.mapy == b.mapy) {
        return (a.mapx < b.mapx) ? -1 : (a.mapx > b.mapx) ? 1 : 0;
    } else {
        return (a.mapy < b.mapy) ? -1 : 1;
    }
}

camera.drawSprites = function() {
    var spritesInMap = []
    spritesInMap = spritesInMap.concat(chars,animap.inMapAnimation);
    spritesInMap.sort(compareSprites);
    var count = spritesInMap.length;
    for (var i = 0; i < count; i++) {
        var item = spritesInMap[i];
        item.draw();
    }
}
