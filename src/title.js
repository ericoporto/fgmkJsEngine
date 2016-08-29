var title = {};

title.setup = function() {
    title.startMenu = new menu({
        start: {
            action: [function() {
                    actions.showText("let's play!");
                    actions.fadeOut("blackFadeOut;keepEffect");
                    actions.changeState("map")
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
    title.startMenu.activate()
    actions.showPicture("title;0;0;sys")
    setTimeout(function() {
        if (engine.state == "startScreen") {
            engine.showPicture(["keys0", "160", "8", "sys"])
            engine.showPicture(["controllers", "8", (screen.GHEIGHT - 32).toString(), "sys"])
        }
    }, 1000);

    setTimeout(function() {
        if (engine.state == "startScreen") {
            engine.showPicture(["keys2", "160", "24", "sys"])
        }
    }, 4000);
    setTimeout(function() {
        if (engine.state == "startScreen") {
            engine.stopPicture("");
            engine.showPicture(["title", "0", "0", "sys"])
            engine.showPicture(["keys1", "150", "16", "sys"]);
            engine.showPicture(["controllers", "8", (screen.GHEIGHT - 32).toString(), "sys"])
        }
    }, 10000);
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
