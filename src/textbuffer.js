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

    if(this.buffer.length>29){
      this.buffer.shift()
    }

    var newcanvas = document.createElement('canvas')
    newcanvas.width = screen.GWIDTH-posx
    newcanvas.height = screen.GHEIGHT-posy
    png_font.ctx =newcanvas.getContext('2d')
    png_font.drawText(text,[ 0,0],'#FFFFFF',size,'#221100');
    this.buffer.push({text: text,
                 posx: posx,
                 posy: posy,
                 size: size,
                 canvas: newcanvas});
  }
}
