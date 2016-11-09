// printer.js
//  This code deals with the basics of writing text in the
// screen - the canvas.

var printer = {};

printer.buffer = [];
printer.btx =  [];
printer.isShown = false;
printer.startingBox = [];
printer.textWidth = screen.GWIDTH-32;
printer.textHeight = 65;

printer.drawText = function(text,x,y){

  return printer.buffer;
}

printer.textBoxes = function(_text) {
  printer.startingBox.push(printer.buffer.length);
  var i=0;
  var remaining_text = _text;
  while(remaining_text!=''){
    var boxbuffer = document.createElement('canvas')
    boxbuffer.width = printer.textWidth;
    boxbuffer.height = printer.textHeight;
    png_font.ctx = boxbuffer.getContext('2d');
    remaining_text = png_font.drawText(remaining_text,[0,0],'#FFFFFF',2,'#221100');
    printer.buffer.push(boxbuffer);
    i++;
  }

  return i;
};

printer.showText = function(_text) {
    var total_boxes = printer.textBoxes(_text);
    for (var nboxes = 0; nboxes < total_boxes; nboxes++) {
        engine.atomStack.unshift([function() {
            printer.nextBox();
            engine.waitTime(300);
        }, '']);
        engine.atomStack.unshift(["block", null]);
        engine.atomStack.unshift([engine.waitForKey, true]);

    }

    printer.isShown = true;
    printBox.show();
    if(engine.state == 'map')
      feedbackEng.play('openprint');
};

printer.dismissText = function() {
    printer.isShown = false;
    printBox.close();
};

printer.nextBox = function() {
    printer.buffer.shift()
    if (printer.buffer.length <= printer.startingBox[0]) {
        printer.dismissText();
        printer.startingBox.shift()
        return
    }
};

printer.update = function() {
  if (printer.isShown && printBox.isShown()) {
    // console.log('x='+(screen.printBox.X + 16)+'; y='+(screen.printBox.Y+40)  +'; w='+printer.textWidth+'; h='+ printer.textHeight)
    screen.drawImage(printer.buffer[0], [screen.printBox.X + 16, screen.printBox.Y +8]);
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
