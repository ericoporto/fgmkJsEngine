//this file defines how the engine deals with items
////
//depends on battle.js; because of the heroes and monsters stats.
//depends on actions.js; because of actions items can perform.
//depends on menu.js; because of creation of the inventory menu.
//depends on engine.js; because the inventory menu is pushed to the mapMenu

items = {}
items.setup = function(itemsjson) {
    this.inventory = {}
    this.allitems = {}
    this.allitems = itemsjson
    this.defaultItem = function() {
        return {
            "equipable": false,
            "equiped": false,
            "usable": false,
            "reusable":false,
            "unique": false,
            "effect": null,
            "statMod": null,
            "description": false,
            "name": null,
            "icon": null,
            "category": null,
            //common category are armor, weapon, ...
            "action": null,
            "quantity": 1
        }
    }
    this.addItem = function(itemname) {
        if (itemname in this.inventory) {
            if (!(this.inventory[itemname].unique)) {
                this.inventory[itemname].quantity += 1
            }
        } else if (itemname in this.allitems) {
            var item = this.defaultItem()
                //merges the item to default item.
                //since copy is shallow, won't duplicate extensive items
            for (var key in this.allitems[itemname]) {
                item[key] = this.allitems[itemname][key];
            }
            if (item["name"] == null) {
                item["name"] = itemname
            }

            this.inventory[itemname] = item

        }
        this.menuUpdate(engine.mapMenu)
    }
    this.subtractItem = function(itemname) {
        this.inventory[itemname].quantity -= 1
        if (this.inventory[itemname].quantity <= 0) {
            this.deleteItem(itemname)
        }

        this.menuUpdate(engine.mapMenu)
    }

    this.deleteItem = function(itemname) {
        delete this.inventory[itemname]
    }

    this.effect = {}
    this.pts = function(itemname, itemuser) {
        var attributbonus = 0
        if(typeof itemuser !== 'undefined'){
            var currHero = battle.heroes[itemuser]
            var attribut = getkey0(this.inventory[itemname].effect)
            if(attribut == 'st' || attribut == 'iq' || attribut == 'dx'){
                 attributbonus = currHero[attribut]
            }
        }
        var baseplus = getkey0(this.inventory[itemname].effect, "basep")
        var plus = getkey0(this.inventory[itemname].effect, "plus")

        return Math.max(battle.diceroll(baseplus + attributbonus) + plus, 0)
    }

    this.effect.hpup = function(target, pts) {
        target.hp = Math.min(target.hp + pts, target.hpmax)
    }

    this.useItem = function(item_name) {
        var itemname = item_name
        if(this.inventory[itemname].effect != null){
            var points = this.pts(itemname)
            var target = []
            target.push(battle.heroes[player.party[0]])
            var effects = this.inventory[itemname].effect.effect

            for (var j = 0; j < target.length; j++) {
                for (var i = 0; i < effects.length; i++) {
                    this.effect[effects[i]](target[j], points)
                }
            }
        }

        if(this.inventory[itemname].action != null){
            var position = [Math.floor(player.mapx / 32), Math.floor(player.mapy / 32) + 1]
            for (var i = 0; i < this.inventory[itemname].action.length; i++) {
                var actionAndParam = this.inventory[itemname].action[i]
                engine.translateActions(actionAndParam[0], actionAndParam[1], position);
            }
        }

        if(this.inventory[itemname].reusable == false){
            this.subtractItem(itemname)
        }
    }

    this.equipItem = function(itemname) {
        if (player.party.length == 1) {
            var currHero = battle.heroes[player.party[0]]
            var heroname = player.party[0]
            var eq_item = this.inventory[itemname]
            if (currHero.equiped[eq_item.category]) {

            } else {
                eq_item.equiped = heroname
                currHero.equiped[eq_item.category] = itemname
                if (eq_item.statMod) {
                    if (!(typeof eq_item.statMod.st === "undefined")) {
                        currHero.mod.st += eq_item.statMod.st
                    }
                    if (!(typeof eq_item.statMod.dx === "undefined")) {
                        currHero.mod.dx += eq_item.statMod.dx
                    }
                    if (!(typeof eq_item.statMod.iq === "undefined")) {
                        currHero.mod.iq += eq_item.statMod.iq
                    }
                }
            }
        }

        this.menuUpdate(engine.mapMenu)
    }

    this.unequipItem = function(itemname) {
        if (player.party.length == 1) {
            var currHero = battle.heroes[player.party[0]]
            var heroname = player.party[0]
            var eq_item = this.inventory[itemname]
            if (currHero.equiped[eq_item.category] == itemname && eq_item.equiped == heroname) {
                if (eq_item.statMod) {
                    if (!(typeof eq_item.statMod.st === "undefined")) {
                        currHero.mod.st -= eq_item.statMod.st
                    }
                    if (!(typeof eq_item.statMod.dx === "undefined")) {
                        currHero.mod.dx -= eq_item.statMod.dx
                    }
                    if (!(typeof eq_item.statMod.iq === "undefined")) {
                        currHero.mod.iq -= eq_item.statMod.iq
                    }
                }
                eq_item.equiped = false
                currHero.equiped[eq_item.category] = false
            } else {
                console.log("tried to unequip item, but it wasn't equiped!")
            }
        }

        this.menuUpdate(engine.mapMenu)
    }

    this.lookItem = function(itemname) {
        if (this.inventory[itemname].description) {
            actions.showText(this.inventory[itemname].description)
        }
    }

    this.dropItem = function(itemname) {
        this.subtractItem(itemname)

        //will update on subtract
    }

    this.getMenu = function() {
        return this.menu
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

        var items2add = {}
        var i = 0
        for (var iitem in this.inventory) {
            var item = this.inventory[iitem].name

            var k = 0
            var itemactions = {}

            if (this.inventory[iitem].equipable) {
                if (this.inventory[iitem].equiped) {
                    itemactions["unequip"] = {}
                    itemactions["unequip"]["index"] = k
                    itemactions["unequip"]["action"] = [(function(the_item){
                        return function() {
                        items.unequipItem(the_item)}
                    })(iitem), 'exit']
                } else {
                    itemactions["equip"] = {}
                    itemactions["equip"]["index"] = k
                    itemactions["equip"]["action"] = [(function(the_item){
                        return function() {
                        items.equipItem(the_item)}
                    })(iitem), 'exit']
                }
                k++
            }
            if (this.inventory[iitem].usable) {
                itemactions["use"] = {}
                itemactions["use"]["index"] = k
                itemactions["use"]["action"] = [(function(the_item){
                    return function() {
                    items.useItem(the_item)}
                })(iitem), 'exit']
                k++
            }
            if (this.inventory[iitem].description) {
                itemactions["look"] = {}
                itemactions["look"]["index"] = k
                itemactions["look"]["action"] = [(function(the_item){
                    return function() {
                    items.lookItem(the_item)}
                })(iitem), 'exit']
                k++
            }
            if (!(this.inventory[iitem].unique)) {
                itemactions["drop"] = {}
                itemactions["drop"]["index"] = k
                itemactions["drop"]["action"] = [(function(the_item){
                    return function() {
                    items.dropItem(the_item)}
                })(iitem), 'exit']
                k++
            }

            itemactions["back"] = {}
            itemactions["back"]["action"] = 'exit'
            itemactions["back"]["index"] = k++

                items2add[item] = new menu(itemactions, i,false,this.inventory[iitem].icon)


            i++
        }

        if (i == 0) {
            items2add["empty"] = {}
            items2add["empty"]["action"] = function() {}
            items2add["empty"]["index"] = i
            i++
        }

        items2add["back"] = {}
        items2add["back"]["action"] = 'exit'
        items2add["back"]["index"] = i
        i++


        this.menu = new menu(items2add, 0)
        if (typeof mapmenu === "undefined") {
            menus.setParent(this.menu);
        } else {
            mapmenu.items.items = this.menu
            mapmenu.updateOrder()
            menus.setParent(mapmenu);
        }

        menus.setAllDrawables()

        this.menu.enabled = wasenable

    }

}
