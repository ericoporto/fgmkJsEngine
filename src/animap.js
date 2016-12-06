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

function mapAnimationSprite(animationImgName, animationLine, x, y, block, speed) {
  //check if different box
  //if animationImgName ends with _number like _32 , _72,
  //use this number as boxsize instead of 64
  this['box'] = 64;
  var tmp = animationImgName.split('_');
  tmp = parseInt(tmp[tmp.length-1]);
  if(tmp>1){
    this['box'] = tmp;
  }

  this['draw'] = function(){ animap.drawMapAnimation(this) };
  this['mapx'] = x * 32;
  this['mapy'] = (y - 1) * 32;
  this['img'] = resources.animations[animationImgName];
  this['animationLine'] = animationLine;
  this['frame'] = 0;
  this['block'] = block;
  this['maxframe'] = Math.floor(resources.animations[animationImgName].width/this['box']);
  this['id'] = Math.floor(Math.random()*100000);
  this['ispeed'] = speed;
  this['pseudoframe'] = 0;
}

animap.playMapAnimation = function(params) {
  var animationImgName = params[0];
  var animationLine = params[1];
  var x = params[2];
  var y = params[3];
  var block = params[4];
  var speed = params[5];
  if(speed < 1 || speed == false){
    speed = 1;
  }

  if(block){
    engine.waitTimeSwitch = true;
  }
  animap.inMapAnimation.push(
    new mapAnimationSprite(animationImgName, animationLine, x, y, block, speed));
}

animap.drawMapAnimation = function(mapAS) {
    if(mapAS.frame < mapAS.maxframe){
        var screenx = mapAS.mapx - (camera.x * 32 + camera.finex);
        var screeny = mapAS.mapy - (camera.y * 32 + camera.finey);

        animap.drawAnimationFromImage(mapAS.img, mapAS.animationLine, mapAS.frame, [screenx, screeny], mapAS.box);
        mapAS.pseudoframe = mapAS.pseudoframe + 1/mapAS.ispeed;
        mapAS.frame = Math.floor(mapAS.pseudoframe);
        if(mapAS.frame >= mapAS.maxframe && mapAS.block){
            engine.waitTimeSwitch = false;
        }
    } else {
        animap.removeById(mapAS.id);
    }
}
