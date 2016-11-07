// textbuffer.js
// small trick to make text drawing faster. Up to the last 24 texts
// drawed by using the textBuffer.drawText function will be stored.
// then if they are needed again, we just copy then to the screen
// canvas.
// I needed to do this because the current version of the png font
// uses too much resources by coloring text and other things, so
// the garbage collection was slow to catch all the homeless canvas...

textBuffer = {
  buffer: [],
  drawText: function(text, posx, posy, size) {
    for(var i=0; i<this.buffer.length; i++){
      if(this.buffer[i]['posx'] == posx &&
         this.buffer[i]['size'] == size &&
         this.buffer[i]['posy'] == posy){
        if(this.buffer[i]['text']==text){
          screen.ctx.drawImage(this.buffer[i]['canvas'],screen.GSTARTX +posx,screen.GSTARTY-28+posy);
          return
        }
      }
    }

    //let's make the maximum number of texts 24.
    if(this.buffer.length>24){
      this.buffer.shift()
    }

    //since we couldn't find the text, we need to store it.
    var newcanvas = document.createElement('canvas');
    newcanvas.width = screen.GWIDTH-posx;
    newcanvas.height = screen.GHEIGHT;
    png_font.ctx =newcanvas.getContext('2d');

    png_font.drawText(text,[ 0,0],'#FFFFFF',size,'#221100',null, true);

    var img = new Image();   // Create new img element
    img.src = newcanvas.toDataURL('image/png');
    this.buffer.push({text: text,
                 posx: posx,
                 posy: posy,
                 size: size,
                 canvas: img});
    newcanvas=0;
  }
}
