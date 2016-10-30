// bgmusic.js

bgmusic = {
  setup: function(){
    this.playing = '';
  },
  play: function(song) {
     if(this.playing != song){
       if(this.playing in resources.music){
         resources.music[this.playing].pause();
       }
       this.playing = song;
       resources.music[song].volume = 0.7
       resources.music[song].currentTime = 0;
       resources.music[song].play();
     }
  }
}
