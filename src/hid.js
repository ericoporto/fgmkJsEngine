// hid.js
//  This code represents the Human Interaction Device, which
// means things the user really interacts with.
//  Code related to the touch display, gamepad, keyboard, all
// this should be here. This function makes then the resulting
// of this interaction something the rest of the code can use.

var HID = {
    scale: 1,
    bsz: 96,
    offset: 416,
    axeNotNull: 0.4,
    inputs: {
        up: {
            letter: 'W',
            otherKeys: [38], //keys: up arrow
            active: false,
            mapX: 96,
            mapY: 0,
            color: '#111111',
            gamepad: function(pad) {
               if (!(typeof pad === "undefined")){
                   return (pad.axes[1] < -HID.axeNotNull);
               } else {
                   return false
               }
            }
        },
        left: {
            letter: 'A',
            otherKeys: [37], //keys: left arrow
            active: false,
            mapX: 0,
            mapY: 96,
            color: '#111111',
            gamepad: function(pad) {
                if (!(typeof pad === "undefined")){
                    return (pad.axes[0] < -HID.axeNotNull);
                } else {
                    return false
                }
            }
        },
        down: {
            letter: 'S',
            otherKeys: [40], //keys: down arrow
            active: false,
            mapX: 96,
            mapY: 192,
            color: '#111111',
            gamepad: function(pad) {
                if (!(typeof pad === "undefined")){
                    return (pad.axes[1] > HID.axeNotNull);
                } else {
                    return false
                }
            }
        },
        right: {
            letter: 'D',
            otherKeys: [39], //keys: right arrow
            active: false,
            mapX: 192,
            mapY: 96,
            color: '#111111',
            gamepad: function(pad) {
                if (!(typeof pad === "undefined")) {
                    return (pad.axes[0] > HID.axeNotNull);
                } else {
                    return false
                }
            }
        },
        accept: {
            letter: 'I',
            otherKeys: [90, 32, 17, 13], //keys: z, enter, ctrl, space
            active: false,
            mapX: 304,
            mapY: 32,
            color: '#127826',
            gamepad: function(pad) {
                if (!(typeof pad === "undefined")) {
                    return pad.buttons[0].pressed;
                } else {
                    return false
                }
            }
        },
        cancel: {
            letter: 'J',
            otherKeys: [88, 18, 16], //keys: x, alt, shift
            active: false,
            mapX: 304,
            mapY: 160,
            color: '#ed1c24',
            gamepad: function(pad) {
                if (!(typeof pad === "undefined")){
                    return pad.buttons[1].pressed;
                } else {
                    return false
                }
            }
        }
    },
    debugKeys: {
        resize: {
            letter: '0',
            toggle: function() {
                screen.resize()
            }
        },
        layer1: {
            letter: '1',
            toggle: function() {
                debug.showLayer.layer1 = !debug.showLayer.layer1
                if (debug.showLayer.layer1) {
                    actions.alert("layer1 shown.")
                } else {
                    actions.alert("layer1 hidden.")
                }
            }
        },
        layer2: {
            letter: '2',
            toggle: function() {
                debug.showLayer.layer2 = !debug.showLayer.layer2
                if (debug.showLayer.layer2) {
                    actions.alert("layer2 shown.")
                } else {
                    actions.alert("layer2 hidden.")
                }
            }
        },
        layer3: {
            letter: '3',
            toggle: function() {
                debug.showLayer.layer3 = !debug.showLayer.layer3
                if (debug.showLayer.layer3) {
                    actions.alert("layer3 shown.")
                } else {
                    actions.alert("layer3 hidden.")
                }
            }
        },
        layer4: {
            letter: '4',
            toggle: function() {
                debug.showLayer.layer4 = !debug.showLayer.layer4
                if (debug.showLayer.layer4) {
                    actions.alert("layer4 shown.")
                } else {
                    actions.alert("layer4 hidden.")
                }
            }
        }
    },


    processGamepad: function() {
        if (!(typeof HID.gamepads === "undefined")) {

            if(HID.gamepads.length > 0){
                for (var i = 0; i < HID.gamepads.length; ++i) {
                    var pad = navigator.getGamepads()[HID.gamepads[i]];

                    if (!(typeof pad === "undefined")) {
                        for (var tag in HID.inputs) {
                            var HIDItem = HID.inputs[tag];

                            if (HIDItem.gamepad(pad)) {
                                HIDItem.active = true
                            } else {
                                HIDItem.active = false
                            }
                        }
                    }
                }
            }
        }
    },

    clearInputs: function() {
        for (var tag in HID.inputs) {
            var HIDItem = HID.inputs[tag];
            HIDItem.release = false;
        }
    },

    cleanInputs: function() {
        for (var tag in HID.inputs) {
            var HIDItem = HID.inputs[tag];
            HIDItem.active = false;
        }
    },

    log: function(text) {
        var tag = document.getElementById("log");
        tag.innerHTML = text;
    },

    keyDown: function(e) {
        var evtobj = window.event ? event : e;
        var unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;

        if (typeof HID.keyboardMap[unicode] !== 'undefined') {
          e.preventDefault();
          HID.keyboardMap[unicode].active = true;
          return
        }

    },

    keyUp: function(e) {
        var evtobj = window.event ? event : e;
        var unicode = evtobj.charCode ? evtobj.charCode : evtobj.keyCode;

        if (typeof HID.keyboardMap[unicode] !== 'undefined') {
          e.preventDefault();
          HID.keyboardMap[unicode].active = false;
          return
        }

        for (var key in HID.debugKeys) {
            var HIDItem = HID.debugKeys[key];

            if (unicode == HIDItem.unicode) {
                HIDItem.toggle();
                return
            }
        }

    },

    setupTouchZone: function(_screen) {
        this.screen = _screen
        this.touchzone = this.screen.canvas
    },

    setupKeyboardListeners: function() {
        document.onkeydown = HID.keyDown;
        document.onkeyup = HID.keyUp;
    },

    handleTouchDown: function(evnt) {
        evnt.preventDefault();
        HID.processTouches(evnt.touches, "down");
    },

    handleTouchMove: function(evnt) {
        evnt.preventDefault();
        HID.processTouches(evnt.touches, "move");
    },

    handleTouchUp: function(evnt) {
        evnt.preventDefault();
        HID.processTouches(evnt.touches, "up");
    },

    processTouches: function(touches, kind) {
        //HID.log("type:" +kind+" seed: "+Date());
        for (var tag in HID.inputs) {

            var HIDItem = HID.inputs[tag];
            var touched = false;

            var offsetTop = this.screen.canvas.offsetTop,
                offsetLeft = this.screen.canvas.offsetLeft;
            scale = this.screen.currentWidth / this.screen.WIDTH;


            for (var i = 0; i < touches.length; i++) {

                var position = {
                    x: ((touches[i].pageX - offsetLeft) / scale),
                    y: ((touches[i].pageY - offsetTop) / scale)
                };

                if (position.x > HIDItem.mapX && position.y > this.offset + HIDItem.mapY) {
                    if (position.x < HIDItem.mapX + this.bsz && position.y < this.offset + HIDItem.mapY + this.bsz) {
                        touched = true;
                    }
                }

            }

            if (touched) {
                HIDItem.active = true;
                if (kind == "down") {
                    HIDItem.release = true;
                }
            } else {
                HIDItem.active = false;
            }

        }

        for (var menuTag in menus.allMenus) {
            var aMenu = menus.allMenus[menuTag]

            if (aMenu.enabled && !aMenu.wait) {
                var maxItems = aMenu.itemsLength

                for (var menuItemTag in aMenu.items) {
                    var menuItem = aMenu.items[menuItemTag];
                    var touched = false;

                    var offsetTop = this.screen.canvas.offsetTop,
                        offsetLeft = this.screen.canvas.offsetLeft;
                    scale = this.screen.currentWidth / this.screen.WIDTH;


                    for (var i = 0; i < touches.length; i++) {

                        var position = {
                            x: ((touches[i].pageX - offsetLeft) / scale),
                            y: ((touches[i].pageY - offsetTop) / scale)
                        };



                        if (position.x > (screen.GSTARTX + aMenu.drawx) && position.y > (screen.GSTARTY + aMenu.drawy + menuItem.itemy - 32)) {
                            if (position.x < (screen.GSTARTX + aMenu.drawx + aMenu.width) && position.y < (screen.GSTARTY + aMenu.drawy + menuItem.itemy)) {
                                touched = true;
                            }
                        }

                    }

                    if (touched) {
                        if (kind == "down" && menuItem.selected) {
                            HID.inputs["accept"].active = true
                            return;
                        }
                        for (var z = 0; z < maxItems; z += 1) {
                            aMenu.items[Object.keys(aMenu.items)[z]].selected = false
                        }
                        menuItem.selected = true
                        aMenu.selectedItem = menuItem
                    }

                }


            }
        }

    },

    setupListeners: function() {
        window.addEventListener('touchstart', HID.handleTouchDown, false);
        window.addEventListener('touchmove', HID.handleTouchMove, false);
        window.addEventListener('touchend', HID.handleTouchUp, false);
        window.addEventListener("gamepadconnected", function(e) {
            setTimeout(function() {
                if (typeof HID.gamepads === "undefined") {
                    HID.gamepads = [];
                }
                HID.gamepads.push(e.gamepad.index)
                actions.alert("gamepad connected!")
            }, 1200);
        });
        window.addEventListener("gamepaddisconnected", function(e) {
            HID.gamepads = [];
            HID.cleanInputs();
            HID.clearInputs();
            actions.alert("gamepad disconnected.")
        });

        //the following function checks if there is an already connected gamepad
        setTimeout(function() {
            if(navigator.getGamepads().length>0){
               var gamepads = navigator.getGamepads()
               for(var pad=0; pad<gamepads.length ; pad++){
                   if (!(typeof gamepads[pad] === "undefined")) {
                      HID.gamepads = [];
                  }
               }
               for(var pad=0; pad<gamepads.length ; pad++){
                   if (!(typeof gamepads[pad] === "undefined")) {
                      HID.gamepads.push(pad)
                      actions.alert("gamepad connected!")
                  }
               }
            }
        }, 1000);


    },

    setup: function(screentosetup) {
        HID.keyboardMap = {};
        for (var key in HID.inputs) {
            var HIDItem = HID.inputs[key];
            if('letter' in HIDItem){
              HIDItem['unicode'] = HIDItem.letter.charCodeAt(0)
              HID.keyboardMap[HIDItem['unicode']] = HID.inputs[key]
            }
            for(var i in HIDItem.otherKeys) {
                var otherkey = HIDItem.otherKeys[i];
                HID.keyboardMap[otherkey] = HID.inputs[key];
            }

        }

        this.setupTouchZone(screentosetup);
        this.setupListeners();
        this.setupKeyboardListeners();
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
