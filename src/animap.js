//animap.js

//depends on camera.js and screen.js


animap = {}
animap.inMapAnimation = []

animap.drawAnimationFromImage = function(animationImage, animationLine, frameNumber, position, box) {
    if (position[0] < screen.GSTARTX - box || position[0] > screen.GWIDTH + box || position[1] < screen.GSTARTY - box || position[1] > screen.GHEIGHT + box) {
        return
    }

    screen.ctx.drawImage(animationImage,
        box * frameNumber, box * animationLine,
        box, box,
        screen.GSTARTX + position[0]-16, screen.GSTARTY+16 + position[1],
        box, box);
}

animap.removeById = function(id){
  var index=-1;
  for(var i=0; i<animap.inMapAnimation.length; i++){
    if(animap.inMapAnimation[i].id == id){
      index=i;
      break;
    }
  }
  if (index > -1) {
    animap.inMapAnimation.splice(index, 1);
  }
}

function mapAnimationSprite(animationImgName, animationLine, x, y) {
  this['draw'] = function(){ animap.drawMapAnimation(this) };
  this['mapx'] = x * 32;
  this['mapy'] = (y - 1) * 32;
  this['box'] = 64;
  this['img'] = resources.animations[animationImgName];
  this['animationLine'] = animationLine;
  this['frame'] = 0;
  this['maxframe'] = Math.floor(resources.animations[animationImgName].width/64);
  this['id'] = Math.floor(Math.random()*100000);
}

animap.playMapAnimation = function(params) {
  var animationImgName = params[0];
  var animationLine = params[1];
  var x = params[2];
  var y = params[3];

  animap.inMapAnimation.push(
    new mapAnimationSprite(animationImgName, animationLine, x, y));
}

animap.drawMapAnimation = function(mapAS) {
    if(mapAS.frame < mapAS.maxframe){
        var screenx = mapAS.mapx - (camera.x * 32 + camera.finex);
        var screeny = mapAS.mapy - (camera.y * 32 + camera.finey);

        animap.drawAnimationFromImage(mapAS.img, mapAS.animationLine, mapAS.frame, [screenx, screeny], mapAS.box);
        mapAS.frame +=1;
    } else {
        animap.removeById(mapAS.id);
    }
}
