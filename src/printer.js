// printer.js
//  This code deals with the basics of writing text in the
// screen - the canvas.

var printer = {};

printer.currentText = null;
printer.dialogLines = null;
printer.currentLine = 0;
printer.isShown = false;

function wordWrap(str, width, brk, cut) {

    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;

    if (!str) {
        return str;
    }

    var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');

    return str.match(RegExp(regex, 'g')).join(brk);

}

printer.textLines = function(_text) {
    var textResult = wordWrap(_text, 31);
    var numberOfLines = ((textResult.split("\n")).filter(Boolean)).length;
    return numberOfLines;
};

printer.showText = function(_text) {

    printer.currentText = wordWrap(_text, 31);
    printer.currentLine = 0;
    printer.isShown = true;
    printer.dialogLines = (printer.currentText.split("\n")).filter(Boolean);
    printBox.show();

    printer.LineWords = [];

    if ((printer.dialogLines.length - printer.currentLine) < 1) {
        printer.wordIndexLine = [];
        printer.LineWords = null;
    } else {
        if ((printer.dialogLines.length - printer.currentLine) < 2) {
            printer.LineWords.push(printer.dialogLines[printer.currentLine].split(' '));
            printer.wordIndexLine = [0];
        } else {
            printer.LineWords.push(printer.dialogLines[printer.currentLine].split(' '));
            printer.LineWords.push(printer.dialogLines[printer.currentLine + 1].split(' '));
            printer.wordIndexLine = [0, 0];
        }
    }

    printer.Line = ['', ''];
    printer.LineLine = 0;
}

printer.dismissText = function() {
    printer.currentText = null;
    printer.currentLine = 0;
    printer.isShown = false;
    printer.dialogLines = null;
    printBox.close();

    printer.LineWords = [];
    printer.wordIndexLine = [];
    printer.Line = ['', ''];
    printer.LineLine = 0;
}

printer.nextLine = function() {

    printer.LineWords = [];
    printer.currentLine += 2;
    if (printer.currentLine >= printer.dialogLines.length) {
        printer.dismissText();
        return
    }


    printer.LineWords = [];

    if ((printer.dialogLines.length - printer.currentLine) < 1) {
        printer.wordIndexLine = [];
        printer.LineWords = null;
    } else {
        if ((printer.dialogLines.length - printer.currentLine) < 2) {
            printer.LineWords.push(printer.dialogLines[printer.currentLine].split(' '));
            printer.wordIndexLine = [0];
        } else {
            printer.LineWords.push(printer.dialogLines[printer.currentLine].split(' '));
            printer.LineWords.push(printer.dialogLines[printer.currentLine + 1].split(' '));
            printer.wordIndexLine = [0, 0];
        }
    }


    printer.Line = ['', ''];
    printer.LineLine = 0;
}

printer.update = function() {

    var lines = null,
        i = 0,
        j = 0,
        l = 0,
        k = 0;

    if (printer.currentText) {

        if (printer.dialogLines.length) {
            if (printBox.isShown()) {



                if (Math.floor(screen.frameCount / 4) % 2) {
                    if (this.LineLine < printer.wordIndexLine.length && printer.LineWords != null) {
                        feedbackEng.play('word');
                        if (printer.wordIndexLine[this.LineLine] < printer.LineWords[this.LineLine].length) {
                            printer.Line[this.LineLine] += printer.LineWords[this.LineLine][printer.wordIndexLine[this.LineLine]] + ' ';
                            printer.wordIndexLine[this.LineLine] += 1
                        } else {
                            this.LineLine += 1
                        }
                    }
                }
                for (i = printer.currentLine, j = 0; i < printer.dialogLines.length && j < 2; i += 1, j += 1) {
                    screen.drawText(printer.Line[i % 2], screen.printBox.X + 16, screen.printBox.Y + 40 + j * 34);
                }
            }

        }
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
