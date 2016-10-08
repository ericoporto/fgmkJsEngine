// bootstrap.js
//  This code contains the function bootstrap.onLoadDOM that
// is the first function called after the html, js, css and
// files linked directly in the html have loaded.
//
//  This function is responsible for starting all the engine,
// dealing with each part of the code in the correct order.

var bootstrap = {};

window.forceMobile=false

var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++)
{
    if (query[i] === "") // check for trailing & with no param
        continue;

    var param = query[i].split("=");
    if(param[0]=="forceMobile" && (param[1]=="true" ||param[1]=="True" || param[1]=="1"))
        window.forceMobile=true

	if(param[0]=="debug" && (param[1]=="true" ||param[1]=="True" || param[1]=="1"))
		window.addEventListener('unload', function (e) { e.preventDefault(); jsonGet("http://127.0.0.1:8081/exit.json");  }, false);

}


bootstrap.onLoadDOM = function(){
	try{
		var child = document.getElementById("loading");
		child.parentNode.removeChild(child);
		document.ontouchmove = function(e){ e.preventDefault();}
		document.getElementsByTagName('canvas')[0].getContext('2d').fillStyle = '#FFFFFF';
		document.getElementsByTagName('canvas')[0].getContext('2d').fillText("LOADING...", 64, 64)
		resources.harvest(function(){
      screen.init();
      player.setup();
      engine.setup();
      screen.setEngine(engine);
      HID.setup(screen)
      engine.currentLevel = resources['levels'][resources.init['World']['initLevel']];
      resources.tileset = resources.tile[engine.currentLevel.Level.tileImage]
      screen.printBox.setup(resources.printerset);
      feedbackEng.setup();
      title.setup();
      battle.setup();
      menus.setAllDrawables();
      engine.loop();
      screen.requestAnimationFrame.call(window,function(){screen.loop()})
      debug.FPS.loop();
      chars = new charalist();
      chars.push(player)
      fullscreen.setup()
    });

	}catch (err){
		alert("Error on bootstrap! "+err);
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
