var achievments = {}
achievments.setup = function(achievmentsjson) {
    this.defaultAchievment = function() {
        return {
            "name": false,
            "description": false,
            "image": false,
            "achieved":false,
            "condition":{}
        }
    }
    this.allachievments = achievmentsjson
    this.achievments = []

    //initialise achievments
    for(var i in allachievments){
        var achievment = this.defaultAchievment()
        for (var key in this.allachievments[i]) {
            achievment[key] = this.allachievments[i][key];
        }
        this.achievments[i] = achievment
    }

    this.achieve = function (achievment){
        this.achievments[achievment]['achieved'] = true
    }

    this.menuUpdate = function(mapmenu) {
        if (!(typeof this.menu === "undefined")) {
            var wasenable = this.menu.enabled
            this.menu.enabled = false
            this.menu.mdelete()
        } else {
            var wasenable = false
            this.menu = {}
        }

        var achievment2add = {}
        var i = 0
        for (var achievment_i in this.achievments) {
            var achievment = this.achievments[achievment_i].name

            achievment2add[achievment] = {}
            achievment2add[achievment]["action"] = function() {}
            achievment2add[achievment]["index"] = i

            i++
        }

        if (i == 0) {
            achievment2add["empty"] = {}
            achievment2add["empty"]["action"] = function() {}
            achievment2add["empty"]["index"] = i
            i++
        }

        achievment2add["back"] = {}
        achievment2add["back"]["action"] = 'exit'
        achievment2add["back"]["index"] = i
        i++


        this.menu = new menu(achievment2add, 0)
        if (typeof mapmenu === "undefined") {
            menus.setParent(this.menu);
        } else {
            mapmenu.items.achievments = this.menu
            mapmenu.updateOrder()
            menus.setParent(mapmenu);
        }

        menus.setAllDrawables()

        this.menu.enabled = wasenable

    }
}

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
