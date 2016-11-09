// title.js
//  This module deals with the Title Screen.
//  Not enough thought was put on this module, a way to
// configure the title screen and some effects would probably
// be a good idea.

var title = {};

title.setup = function() {
    title.startMenu = new menu({
        start: {
            action: [function() {
                    actions.showText("let's play!");
                    engine.atomStack.push([function() {
                        feedbackEng.play('gamestart')
                    }, '']);
                    actions.fadeOut("blackFadeOut;keepEffect");
                    actions.teleport(Math.floor(resources.init['Player']['initPosX']/32)+";"+
                                     (Math.floor(resources.init['Player']['initPosY']/32)+1)+";"+
                                     resources.init['World']['initLevel'])
                    engine.actions.runScript(resources.init['World']['initActions'])
                },
                function() {
                    actions.stopPicture("")
                },
                function() {
                    actions.fadeIn("blackFadeIn;doNotKeep")
                },
                'exit'
            ],
            index: 0
        },
        exit: {
            action: 'exit',
            index: 1
        }
    }, undefined, true);
    menus.setParent(title.startMenu);
    var onTitleLoad = function (){
      title.startMenu.activate()
      actions.showPicture("title;0;0;sys")
      setTimeout(function() {
          if (engine.state == "startScreen") {
              engine.actions.showPicture(["controllers", "8", (screen.GHEIGHT - 32).toString(), "sys"])
          }
      }, 1000);

      setTimeout(function() {
          if (engine.state == "startScreen") {
              engine.actions.showPicture(["keys2", "160", "24", "sys"])
          }
      }, 4000);
      setTimeout(function() {
          if (engine.state == "startScreen") {
              engine.actions.stopPicture("");
              engine.actions.showPicture(["title", "0", "0", "sys"])
              engine.actions.showPicture(["keys1", "150", "16", "sys"]);
              engine.actions.showPicture(["controllers", "8", (screen.GHEIGHT - 32).toString(), "sys"])

          }
      }, 10000);

    };

    engine.atomStack.push([onTitleLoad]);
    //actions.playMusic()
}

title.startScreen = function() {
    title.update()
}

title.update = function() {
    if (printer.isShown)
        return;

    if (player.steps == 0) {
        if (HID.inputs["cancel"].active) {
            HID.inputs["cancel"].active = false
            title.startMenu.activate()
        }
    }
};

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
