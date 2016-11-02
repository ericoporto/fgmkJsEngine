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

    if(this.playing != song){
      if(this.playing in resources.music){
        resources.music[this.playing].pause();
      }

      this.playing = song;
      resources.music[song].volume = volume;
      resources.music[song].currentTime = currentTime;
      resources.music[song].play();
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
