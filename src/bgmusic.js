// bgmusic.js

bgmusic = {
  setup: function(){
    this.songStack = [];
    this.playing = '';
  },
  play: function(song, volume, currentTime) {
    volume = (typeof volume === "undefined") ? 0.7 : volume;
    currentTime = (typeof currentTime === "undefined") ? 0 : currentTime;
    if(!(song in resources.music))
      return

    var playSong = (function(that,song, volume, currentTime){
        return function() {
          that.playing = song;
          resources.music[song].volume = volume;
          resources.music[song].currentTime = currentTime;
          resources.music[song].play();
        }
      })(this,song, volume, currentTime);

    if(this.playing != song){
      if(this.playing in resources.music){
        resources.music[this.playing].pause();

        //setTimeout will help with race conditions
        //needed for Firefox Mobile
        setTimeout(playSong,150)
      } else {
        setTimeout(playSong,150)
      }


    }
  },
  changeVolume: function(volume){
    if(this.playing in resources.music){
      resources.music[song].setVolume(volume);
    }
  },
  pushSong: function(){
    var song = this.playing;
    this.songStack.push({ song: song,
                          volume: resources.music[song].volume,
                          currentTime: resources.music[song].currentTime,
                        });
  },
  popSong: function(){
    var sp = this.songStack.pop();
    this.play(sp.song, sp.volume, sp.currentTime)
  }
}
