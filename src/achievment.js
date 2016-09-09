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
