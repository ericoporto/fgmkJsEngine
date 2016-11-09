/** png-font.js
* MIT License
*
* Copyright (c) 2016 Érico Vieira Porto
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/

 png_font = {
  textDrawed : [],
  textUTF8Array : [],
  fontUrl : null,

  /** to start the png_font writer
  */
  setup : function(drawingContext, fontImageUrl, callback){
    if(typeof callback === 'undefined'){
      callback = function(){};
    }
    this.ctx = drawingContext;
    this.fontImage = new Image();
    this.fontImage.onload = function() {
      var event = new Event('png_font_loaded');
      document.dispatchEvent(event);
      callback()
    }
    if(typeof fontImageUrl === 'undefined'){
      fontImageUrl = 'img/unifont.png';
    }
    this.fontImage.src = fontImageUrl;
  },

  /** to convert str with possible unicode to array of unicode chars
  */
  toCharCodeArray: function(str) {
    var arrCharCode = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        arrCharCode.push(charcode)
    }
    return arrCharCode;
  },

  getCharwidthFromCharcode: function(chr){
    var xchr = (chr % 256);
    var ychr = parseInt(chr/256);
    var charWidth = 16;
    if(ychr<32){
      charWidth = 8;
    }
    return charWidth
  },

  getTextWidth: function(text, size){
    if(typeof size === 'undefined'){
      size=1;
    }
    var textWidth=0;
    var charCodeArray = this.toCharCodeArray(text)
    for(var i=0;i<charCodeArray.length; i++){
      textWidth+=this.getCharwidthFromCharcode(charCodeArray[i]);
    }
    return textWidth*size
  },

  getHeight: function(size){
    return size*16
  },

  /** function to draw a single char
  */
  drawChr : function(ctx, img, chr,pos){
    // I assume that each char is a 16x16px square in a big 4096x4096px Image
    // Than I crop this image and draw in the canvas.
    var xchar = parseInt(16 * (chr % 256));
    var ychar = parseInt(16 * parseInt(chr/256));
    var charWidth = this.getCharwidthFromCharcode(chr)

    ctx.drawImage(img,
        xchar, ychar,
        16, 16,
        pos[0], pos[1],
        16, 16);
    return charWidth
  },

  /** creates pixel art friendly canvas and return it
  *   it's going to be used to create intermediate buffers
  */
  createBufferCanvas: function(width,height){
    var buffer = document.createElement('canvas');
    buffer.style['image-rendering']='pixelated'
    buffer.width = width;
    buffer.height = height;
    var bx = buffer.getContext('2d');
    bx.mozImageSmoothingEnabled = false;
    //bx.webkitImageSmoothingEnabled = false;
    bx.imageSmoothingEnabled = false;
    return buffer
  },

  /** function to draw text in a canvas.
  *    the user show access drawText as entry point though
  */
  drawTextCanvas : function(ctx,utf8Array,pos, color,size){
    var width = 16*utf8Array.length;
    var height = 16;
    var buffer = this.createBufferCanvas(width,height);
    var bx = buffer.getContext('2d');
    var charWidth=0;
    var charTotalWidth=0;

    var chrPos = [0,0];
    for(var i=0; i<utf8Array.length; i++){
      var char = utf8Array[i];
      charWidth= this.drawChr(bx, this.fontImage,char,chrPos);
      chrPos[0]+=charWidth;
      charTotalWidth+=charWidth;
    }

    if(typeof color !== 'undefined' || color !== null){
      bx.fillStyle = color
      bx.globalCompositeOperation = "source-in";
      bx.fillRect(0, 0, width, height);
    }

    //this will resize the image if needed by using an intermediate buffer
    if(typeof size === 'undefined' || size === null || size == 1 ){
      ctx.drawImage(buffer,pos[0],pos[1]);
    } else {
      var bufferSize = this.createBufferCanvas(width*size,height*size);
      var bSx = bufferSize.getContext('2d');

      bSx.drawImage(buffer, 0, 0, width*size , height*size);
      ctx.drawImage(bufferSize,pos[0],pos[1]);
    }
    return charTotalWidth
  },

  /** allows drawing text with shadows
  */
  drawTextShadow: function(utf8Array, color, size, shadowcolor){

    if(typeof size === 'undefined' || size === null){
      size = 1
    }
    var charTotalWidth=0;
    var width = 16*utf8Array.length*size;
    var height = 16*size;
    var buffer = this.createBufferCanvas(width+1,height+1);
    var bx = buffer.getContext('2d');
    this.drawTextCanvas(bx,utf8Array, [size,size], shadowcolor, size);
    charTotalWidth=this.drawTextCanvas(bx,utf8Array, [0,0], color, size);
    return [buffer,charTotalWidth+size]
  }
  ,

  wrapText: function(text, wrap, size){
    if(this.textDrawed!==text){
      this.textUTF8Array = this.toCharCodeArray(text);
      this.textDrawed = text;
    }

    function missingText(text, utf82DArray){
      var flatUtf8Array = [];
      for(var i=0; i<utf82DArray.length; i++){
        flatUtf8Array = flatUtf8Array.concat(utf82DArray[i]);
      }
      var doneText = String.fromCharCode.apply(null, flatUtf8Array);

      var ending = text.substring(doneText.length);
      return ending
    }

    var wrapped2DArray = [];
    var missing = '';
    var width = 0;
    var line = 0;
    var word = [];
    var wordWidth = 0;
    wrapped2DArray[line] = [];
    var spaceWidth = 8*size;

    var maxwidth = 0;

    for(var i=0; i<=this.textUTF8Array.length; i++){
      if(this.textUTF8Array[i]!=32 &&
         i!=this.textUTF8Array.length &&
         this.textUTF8Array[i]!=10){  //if it isn't a space, end or linefeed
        wordWidth = wordWidth + this.getCharwidthFromCharcode(this.textUTF8Array[i])*size
        word.push(this.textUTF8Array[i]);

      } else { //if it is
        if(width+wordWidth<wrap[0]){ //is it smaller then right wrap area?
          wrapped2DArray[line] = wrapped2DArray[line].concat(word).concat([32]); // it is, so add the word to line
          width=width + wordWidth+spaceWidth

          if(this.textUTF8Array[i]==10){

            //this code block advances a line!
            line++;
            if(line*16*size>=wrap[1]){ //has it reached the bottom of wrap area?
              missing=missingText(text,wrapped2DArray)
              return [wrapped2DArray,missing];
              break;
            }
            wrapped2DArray.push([]);  //let's advance to next line!

            width = wordWidth+spaceWidth;
            wrapped2DArray[line] = [];
            //end of line advance code block
          }

          wordWidth = 0; //let's start a new word
          word = [];
        } else { //it's not smaller, so we will go back...

          //this code block advances a line!
          line++;
          if((line+1)*16*size>=wrap[1]){ //has it reached the bottom of wrap area?
            missing=missingText(text,wrapped2DArray)
            return [wrapped2DArray,missing];
            break;
          }
          wrapped2DArray.push([]);  //let's advance to next line!

          width = wordWidth+spaceWidth;
          wrapped2DArray[line] = [];
          //end of line advance code block

          wrapped2DArray[line] = wrapped2DArray[line].concat(word).concat([32]);
          wordWidth = 0; //let's start a new word
          word = [];
        }
      }

      //stores the maximum width
      if(width> maxwidth){
        maxwidth = width;
      }
    }

    return [wrapped2DArray,missing,maxwidth, (line+1)*this.getHeight(size) ];
  },
  /** How to draw texts in a canvas
  *
  * examples:
  *
  * png_font.drawText("hello world!",[32,32])
  * png_font.drawText("한국어!",[48,64],"#559")
  * png_font.drawText("hello world!",[4,4],'blue',2,'red')
  */
  drawText: function(text, pos, color, size, shadow,  wrap, forceResize){
    if(typeof size === 'undefined' || size === null){
      size = 1
    }
    if(typeof forceResize === 'undefined' || forceResize === null){
      forceResize = false
    }
    if(typeof wrap === 'undefined' || wrap === null){
      wrap = [this.ctx.canvas.width-pos[0],this.ctx.canvas.height-pos[1],0];
    }

    var wrapped2DArray;
    var missing;
    var minWidth;
    var minHeight;

    [wrapped2DArray , missing, minWidth, minHeight] = this.wrapText(text,wrap,size);

    if(forceResize){
      //I am adding size below to account for the shadow when present

      this.ctx.canvas.width = minWidth+size*2;
      this.ctx.width = minWidth+size*2;
      this.ctx.canvas.height = minHeight+size*2;
      this.ctx.height = minHeight+size*2;
    }

    for(var i=0; i<wrapped2DArray.length; i++){
      var textUTF8Array = wrapped2DArray[i];

      if(typeof shadow === 'undefined' || shadow === null || shadow == false){
        this.drawTextCanvas(this.ctx,textUTF8Array, [pos[0],pos[1]+i*16*size], color, size);
      } else {
        var buffer;
        [buffer,charTotalWidth] = this.drawTextShadow(textUTF8Array, color, size,shadow)
        this.ctx.drawImage(buffer,
                           pos[0],pos[1]+i*16*size);
      }
    }

    return missing;
  }
};
