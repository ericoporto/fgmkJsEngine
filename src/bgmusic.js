// bgmusic.js

bgmusic = {
  setup: function(){
    for(var song in resources.music){
      resources.music[song].onended =  (function(song){
        return function(ev) {
          ev.preventDefault()
          resources.music[song].currentTime = 0;
          resources.music[song].play();
        }
      })(song);
    }
  },
  play: function(song) {
    resources.music[song].play();
  }
}
