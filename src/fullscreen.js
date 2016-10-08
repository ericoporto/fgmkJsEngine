// fullscreen.js
//  Add fullscreen controls to the engine.
// Makes easier to go into and go out of fullscreen
// in mobile.
var fullscreen = {
    waitTC: false,
    isFullscreen: false,
    exitFullscreen: function() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        this.isFullscreen = false;
    },
    launchIntoFullscreen: function(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        this.isFullscreen = true;
        actions.alert('in fullscreen!')
    },
    setup: function() {
        var createButton = function(buttonname, context, func) {
            var button = document.createElement("input");
            button.type = "button";
            button.value = buttonname;
            button.id = 'fullscreen_button'

            //make flat
            button.style['appearance'] = 'none';
            button.style['box-shadow'] = 'none';
            button.style['border-radius'] = 0;
            button.style['color'] = '#bbb';
            button.style['background-color'] = '#111';
            button.style['border'] = 'none';
            button.style['font-size'] = '32px'
            button.style['font-family'] = 'INFO56';

            //place at bottom left
            button.style.position = 'fixed';
            button.style['z-index'] = 1000;
            button.style.bottom = '0px';
            button.style.left = '0px';

            button.addEventListener('click', func)
            button.addEventListener('touchstart', func)

            context.appendChild(button);

        };

        createButton('[  ]', document.documentElement, function() {
            if(fullscreen.waitTC){
              return
            } else {
              fullscreen.waitTC = true
              setTimeout(function(){fullscreen.waitTC=false;},100)
            }

            if (fullscreen.isFullscreen) {
                fullscreen.exitFullscreen();
                document.getElementById('fullscreen_button').value = '[  ]'
                document.getElementById('fullscreen_button').style['color'] = '#bbb';
            } else {
                fullscreen.launchIntoFullscreen(document.documentElement);
                document.getElementById('fullscreen_button').value = '>[]<'
                document.getElementById('fullscreen_button').style['color'] = '#666';
            }
        })
    }
}
