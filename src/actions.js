// actions.js
//  This code are the basic support of the fgmk actions system
// the idea is that each method of the object actions is an
// action.
//
//  Each frame, the engine will execute all functions pushed
// to the atomStack until it meets the keyword "block" or
// until the atomStack is empty. The atomStack is actually a
// buffer. Note that engine frames and screen frames may not
// align, the engine executes 60 frames per seconds even if
// the screen didn't draw 60 frames at that second.
//
//  The atomStack accepts always an array with three positions
// the first position is the name of a function, the second is
// usually an array of parameters defined by the game logic in
// json files, and the third position is usually a parameter
// dependent of the current engine state to help the action
// reach it's goal.
//
//  Note that actions are executed instantaneously at when an
// event occurs, but the functions pushed to the atomStack are
// not.

/** creation of the object actions and the helpers.
 *  helpers are not actions, but they are necessary functions
 * that are reused by actions.
 */
var actions = {};
actions.helpers = {};

/** supportive function to allow IF function to support nesting.
 *  This is not an action.
 */
actions.helpers.lastBlock = function() {
    var value = 0
    var bstk = actions.blockStack.slice(0)
    if (bstk.length > 1) {
        value = bstk[bstk.length - 1];
    } else if (bstk.length == 1) {
        value = bstk[0];
    }
    return value
}

/** supportive function to process text and substitute variables
 */
actions.helpers.preText = function(text) {
    var pretexted = text.slice(0)
    return (text.slice(0)).replace(/(var:)([a-zA-Z0-9]+)/g,
        function(varname) {
            return engine.evalNum(varname)
        })
}

/** the action changePlayerAnimation
 *
 */
actions.changePlayerAnimation = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.changePlayerAnimation, params])
}

actions.charAutoDelete = function(param, position, charatodel) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.charAutoDelete, params, charatodel])
}

actions.moveChara = function(param, position, charatodel) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.moveChara, params, charatodel])
}

actions.blockInput = function(param, position) {
    var params = param.split(';')
    var shouldblock = false;
    if(params[0] == true || params[0] == 'true' || params[0] == 'block' || params[0] == 'Block'){
      var shouldblock = true;
    }
    engine.atomStack.push([engine.actions.blockInput, [shouldblock]])
}

actions.questionBox = function(param, position) {
    var params = param.split(';')
    engine.questionBoxAnswer = engine.questionBoxUndef
    engine.atomStack.push([engine.actions.questionBox, params])
    engine.atomStack.push(["block", null]);
    engine.atomStack.push(["block", null]);
}

actions.stopPicture = function(param, position) {
    engine.atomStack.push([engine.actions.stopPicture, ''])
}

actions.showPicture = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.showPicture, params])
}

actions.changeState = function(param, position) {
    var params = param.split(';');
    engine.atomStack.push([engine.actions.changeState, params])
}

actions.changePan = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.changePan, params])
}

actions.setCharaInvisibility = function(param, position) {
    var params = param.split(';')
    var invisible = false;
    if(params[1] == 'invisible' || params[1] == 'true' || params[1] == 'Invisible' ){
      invisible = true;
    }
    engine.atomStack.push([engine.actions.setCharaInvisibility, [params[0],invisible]])
}

actions.IF = function(param, position) {
    var params = param.split(';');
    actions.blockCounter++;
    actions.blockStack.push(actions.blockCounter.valueOf());
    engine.atomStack.push([engine.actions.IF, params, actions.helpers.lastBlock()]);
}

actions.ELSE = function(param, position) {
    engine.atomStack.push([engine.actions.ELSE, '', actions.helpers.lastBlock()]);
}

actions.END = function(param, position) {
    engine.atomStack.push([engine.actions.END, '', actions.helpers.lastBlock()]);
    var popped = actions.blockStack.pop();
}

actions.showStatus = function(param, position) {
    var params = param.split(';')
    var herotoshow = battle.heroes[params[0]]
    engine.atomStack.push([function(herotosh) {
        battle.herotoshowstatus = herotosh
    }, herotoshow]);
    engine.atomStack.push([engine.waitForKey, true]);
    engine.atomStack.push(["block", null]);
    engine.atomStack.push([function() {
        battle.herotoshowstatus = false;
        engine.waitTime(400);
    }, '']);
};

actions.showText = function(param, position) {
    var params = param.split(';')
    var text = actions.helpers.preText(params[0]);
    engine.atomStack.push([printer.showText, text]);
};

actions.playMusic = function(param) {
  var params = param.split(';')
  engine.atomStack.push([engine.actions.playMusic, params]);
}

actions.playSound = function(param) {
  var params = param.split(';')
  engine.atomStack.push([engine.actions.playSound, params]);
}

actions.teleport = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([function() {
        screen.paused = true;
    }, '']);
    engine.atomStack.push([engine.actions.teleport, params]);
    engine.atomStack.push([function() {
        screen.paused = false;
    }, '']);
};

actions.teleportInPlace = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([function() {
        screen.paused = true;
    }, '']);
    engine.atomStack.push([engine.actions.teleportInPlace, params]);
    engine.atomStack.push([function() {
        screen.paused = false;
    }, '']);
};

actions.changeTile = function(param, position) {
    //param[4] location (current or x,y,level)
    var collisionDict = {
        keep: -1,
        nocollision: 0,
        collidable: 1
    }
    var params3Value
    var params = param.split(';')

    var aTileType = params[0]
    var aLayer = params[1]
    var acollision = collisionDict[params[2]];
    if (params[3] == "keep") {
        params3Value = -1;
    } else if (params[3] == "remove") {
        params3Value = 0;
    } else {
        params3Value = parseInt(params[3], 10);
    }

    var aEvent = params3Value;
    var aPositionX
    var aPositionY
    var aLevel

    if (params[4] == "current") {
        aPositionY = parseInt(position[0], 10)
        aPositionX = position[1]
        aLevel = null
    } else {
        aPositionX = params[4]
        aPositionY = params[5]
        aLevel = params[6]
    }

    engine.atomStack.push([engine.actions.changeTile, [aTileType,
        aLayer, acollision, aEvent, aPositionY, aPositionX,
        aLevel
    ]]);
};


actions.changeAllTiles = function(param, position) {
  //param = [otileType,newtiletype, layer,collision,event,level]
  //          0      ,     1      ,   2  ,   3    , 4   , 5
  ///////////////////////////////////////////////////////////////////
    var collisionDict = {
        keep: -1,
        nocollision: 0,
        collidable: 1
    }
    var params3Value
    var params = param.split(';')

    var originalTileType = params[0]
    var newTileType = params[1]
    var aLayer = params[2]
    var acollision = collisionDict[params[3]];
    if (params[4] == "keep") {
        params3Value = -1;
    } else if (params[4] == "remove") {
        params3Value = 0;
    } else {
        params3Value = parseInt(params[4], 10);
    }

    var aEvent = params3Value;
    var aLevel = params[5]

    engine.atomStack.push([
        engine.actions.changeAllTiles, [originalTileType, newTileType,
                            aLayer, acollision, aEvent, aLevel]
    ]);
};

actions.fadeIn = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([screen.effects.fadeIn, params]);
    for (var i = 0; i < 8; i++) {
        engine.atomStack.push(["block", null]);
    }
};


actions.fadeOut = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([screen.effects.fadeOut, params]);
    for (var i = 0; i < 8; i++) {
        engine.atomStack.push(["block", null]);
    }
};

//playAnimationInMap
// this enables playing an animation in the sprite/chara space of the map.
// examples:
// "playAnimationInMap","forest;0;current"
// "playAnimationInMap","forest;0;current;block"
// "playAnimationInMap","forest;0;5;3;block"
actions.playAnimationInMap = function(param, position){
    var params = param.split(';')
    var animationImage = params[0];
    var animationLine = params[1];
    var aPositionY;
    var aPositionX;
    var block = false;
    var speed = 1;
    if (params[2] == 'current') {
        aPositionY = position[0];
        aPositionX = position[1];
        if(params[3] == 'block'){
          block = true;
        }
        if(typeof params[4] !== 'undefined'){
          speed = parseInt(params[4]);
        }
    } else {
        aPositionX = params[2];
        aPositionY = params[3];
        if(params[4] == 'block'){
          block = true;
        }
        if(typeof params[5] !== 'undefined'){
          speed = parseInt(params[5]);
        }
    }

    engine.atomStack.push([
      animap.playMapAnimation,
      [animationImage, animationLine, aPositionX, aPositionY, block, speed]
    ]);
    if(block){
        engine.atomStack.push(["block", null]);
    }
}

actions.shakeScreen = function(param, position) {
    var params = param.split(';')
    var vorh = 'h';

    if( params[0]=='v' ||
        params[0]=='vertical' ||
        params[0] == 'VERTICAL' ||
        params[0] == 'Vertical' ){
            vorh='v';
    }

    engine.atomStack.push([screen.shakeScreen, vorh]);
    for (var i = 0; i < 8; i++) {
        engine.atomStack.push(["block", null]);
    }
};

actions.setVar = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.setVar, params]);
};

actions.varPlusOne = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.varPlusOne, params]);
};

actions.noEffect = function(param, position) {
    engine.atomStack.push([screen.effects.noEffect, '']);
};

actions.battle = function(param, position) {
    var params = param.split(';')
    actions.fadeOut('tension1;keepEffect')
    dist.setup(screen.canvas, 'bgimg1', 1)
    actions.changeState('battle')
    engine.atomStack.push([engine.actions.battle, params]);
};

actions.addItem = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.addItem, params]);
}

actions.dropItem = function(param, position) {
    var params = param.split(';')
    engine.atomStack.push([engine.actions.subtractItem, params]);
}

actions.proceedBattleTurn = function(param, position) {
    battle.herodecision = ""
    engine.questionBoxAnswer = engine.questionBoxUndef
    engine.atomStack.push([engine.actions.proceedBattleTurn, [""]])
}

actions.alert = function(param, position) {
    var params = param.split(';')
    var text = actions.helpers.preText(params[0]);
    engine.atomStack.push([engine.actions.alert, text])
}

actions.waitCycle = function(param, position) {
    var params = param.split(';')
    var cycles = parseInt(params[0])
    for (var i = 0; i < cycles; i++) {
        engine.atomStack.push(["block", null]);
    }
};

actions.insideOutside = function(param, position) {
    var params = param.split(';');

    engine.atomStack.push([engine.actions.insideOutside, params]);

}

actions.rain = function(param, position) {
    var params = param.split(';')

    if (params[0] == 'start') {
        engine.atomStack.push([function() {
                screen.rains.startRain()
            },
            [""]
        ])
    } else {
        engine.atomStack.push([function() {
                screen.rains.stopRain()
            },
            [""]
        ])
    }
}

// MIT LICENSE
// Copyright (c) 2016 Érico Vieira Porto
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// You can't claim ownership, use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell any software, images or
// documents that includes characters, assets, or story elements
// of the game distributed along with this engine.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
