// menu.js
//  Menus are the basic user interface of the game engine,
// they should be concise and fast since using this user
// interface is generally not fun.
//  They are important for doing things like using an item in
// the map state, asking questions and configuration.
//  This code creates the basic elements needed for creating
// menus but it doesn't call it or define the mapMenu, this
// is left as a task to the engine do deal with.

var menus = {
    allMenus: [],
    isAnyMenuEnabled: function() {
        var returnValue = false
        for (var _menu in this.allMenus) {
            if (this.allMenus[_menu].enabled) {
                returnValue = true;
            }
        }
        return returnValue;
    },
    updateMenuEnabled: function() {
        var returnValue = null
        for (var _menu in this.allMenus) {
            if (this.allMenus[_menu].enabled) {
                this.allMenus[_menu].update();
            }
        }
        return returnValue;
    },
    setParent: function(o) {
        if (o.items != undefined) {
            for (n in o.items) {
                o.items[n].parent = o;
                this.setParent(o.items[n]);
            }
        }
    },
    setDrawables: function(menuToDraw) {
        var maxOnScreen = menuToDraw.maxOnScreen
        var maxItems = menuToDraw.itemsLength
        var finalItem = Math.min(maxItems,maxOnScreen)

        if (menuToDraw.parent == null) {
            menuToDraw['drawx'] = 16;
            menuToDraw['drawy'] = 16;
            menuToDraw['height'] = finalItem * menuToDraw.fontHeight + 32;
            menuToDraw['width'] = menuToDraw.maxItemStringSize() + 32;
        } else {
            menuToDraw['drawx'] = menuToDraw.parent.drawx + menuToDraw.parent.width;
            menuToDraw['drawy'] = menuToDraw.parent.drawy;
            menuToDraw['height'] = finalItem * menuToDraw.fontHeight + 32;
            menuToDraw['width'] = menuToDraw.maxItemStringSize() + 32;
        }
    },
    setAllDrawables: function() {
        for (var anotherMenu in this.allMenus) {
            for (var aMenu in this.allMenus) {
                this.setDrawables(this.allMenus[aMenu]);
            }
        }
    }
};

function menu(_items, _index, _noexit, _icon) {

    var tempArray = [];

    _index = (typeof _index === "undefined") ? null : _index;
    _icon = (typeof _icon === "undefined") ? null : _icon;
    _noexit = (typeof _noexit === "undefined") ? false : _noexit;
    this.items = _items;
    this.noexit = _noexit;

    this.menuScale = 1;
    this.maxOnScreen = 5;
    this.parent = null;
    this.index = _index;
    this.icon = _icon;
    this.enabled = false;
    this.selectedItem = null;
    this.wait = false;
    this.isMenu = true;

    this.updateOrder = function() {

        for (var i = 0; i < Object.keys(this.items).length; i++) {
            var _itemKey = Object.keys(this.items)[i];

            tempArray[i] = [_itemKey, this.items[_itemKey].index]

        }
        tempArray.sort(function(a, b) {
            return a[1] - b[1]
        })

        this.selectedItem = this.items[tempArray[0][0]]

        for (var i = 0; i < tempArray.length; i++) {

            if (i == 0) {
                this.items[tempArray[i][0]].previous = tempArray[0][0]
                this.items[tempArray[i][0]].next = tempArray[i + 1][0]
            } else if (i == tempArray.length - 1) {
                this.items[tempArray[i][0]].previous = tempArray[i - 1][0]
                this.items[tempArray[i][0]].next = tempArray[i][0]
            } else {
                this.items[tempArray[i][0]].previous = tempArray[i - 1][0]
                this.items[tempArray[i][0]].next = tempArray[i + 1][0]
            }

            this.items[tempArray[i][0]].itemy = 32 + i * 32

        }

        if (this.selectedItem == null)
            this.selectedItem = this.items[Object.keys(this.items)[0]]


        this.selectedItem.selected = true

    };

    this.updateOrder();

    this.fontHeight = png_font.getHeight(this.menuScale);

    this.maxItemStringSize = function() {
        var returnValue = 0

        for (var i = 0; i < Object.keys(this.items).length; i++) {
            var _itemKey = Object.keys(this.items)[i];
            var _itemKeyLength = png_font.getTextWidth(_itemKey,this.menuScale)

            if (returnValue < _itemKeyLength) {
                returnValue = _itemKeyLength;
            }
        }

        return returnValue
    };

    this.itemsLength = Object.keys(_items).length

    this.exit = function() {
        this._counter = 0;
        this.enabled = false;
        HID.inputs["cancel"].active = false;
        engine.waitTime(200)

        if (this.parent != null) {
            this.parent.wait = false;
            this.parent.menuKeyWasPressed = 32
        } else {
            engine.atomStack.push(engine.atomStack.push([function() {
                engine.atomStack = menus.holdAtomStack
            }, '']), '')
        }
    };
    this.activate = function() {
        this.enabled = true;
        if (this.parent != null) {
            this.parent.wait = true;
        } else {
            menus.holdAtomStack = engine.atomStack
            engine.atomStack = new Array();
        }
    };
    this._counter = 0; //this counter is here to solve a bug with the gamepad cancel button
    this.menuKeyWasPressed = 0;
    this.update = function() {
        if (this._counter < 20)
            this._counter += 1;

        if (this.menuKeyWasPressed == 0) {
            if (!this.wait) {
                if (HID.inputs["up"].active) {
                    this.selectedItem.selected = false
                    this.selectedItem = this.items[this.selectedItem.previous]
                    this.selectedItem.selected = true
                    HID.inputs["up"].active = false
                    this.menuKeyWasPressed = 32
                } else if (HID.inputs["left"].active) {


                } else if (HID.inputs["right"].active) {


                } else if (HID.inputs["down"].active) {
                    this.selectedItem.selected = false
                    this.selectedItem = this.items[this.selectedItem.next]
                    this.selectedItem.selected = true
                    HID.inputs["down"].active = false
                    this.menuKeyWasPressed = 32
                } else if (HID.inputs["accept"].active) {

                    HID.inputs["accept"].active = false
                    if (this.selectedItem.action == 'exit') {
                        this.exit();
                    } else if (Object.prototype.toString.call(this.selectedItem.action) === '[object Array]') {
                        for (var i = 0; i < this.selectedItem.action.length; i++) {
                            if (this.selectedItem.action[i] == 'exit') {
                                this.exit()
                            } else if (this.selectedItem.action[i] == 'goWait') {
                                engine.atomStack.push([function() {
                                    this.wait = true;
                                }, '']);
                            } else if (this.selectedItem.action[i] == 'stopWait') {
                                engine.atomStack.push([function() {
                                    this.wait = false;
                                }, '']);
                            } else {
                                this.selectedItem.action[i]();
                            }
                        }
                    } else {
                        if (typeof this.selectedItem.isMenu === "undefined") {
                            this.selectedItem.action();
                        } else {
                            this.selectedItem.menuKeyWasPressed = 32
                            this.selectedItem.action();
                        }
                    }
                    this.menuKeyWasPressed = 32
                } else if (HID.inputs["cancel"].active) {
                    if (this._counter >= 20 && this.noexit == false) {
                        HID.inputs["cancel"].active = false
                        this.exit()
                        engine.waitTime(200)
                        this.menuKeyWasPressed = 32
                    }
                }
            }
        } else {
            this.menuKeyWasPressed -= 4
        }
    };

    this.action = this.activate;
    this.mdelete = function() {
        for (var i = 0; i < menus.allMenus.length; i++) {
            if (menus.allMenus[i] == this) {
                menus.allMenus.splice(i, 1)
                break
            }
        }

    }

    menus.allMenus.push(this);

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
