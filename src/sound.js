// sound.js

sound = {
  setup: function(){
    this.playing = '';
  },
  play: function(s, volume) {
    volume = (typeof volume === "undefined") ? 0.7 : volume;
    if(!(s in resources.sound))
      return

    var playSound = (function(that,s, volume){
        return function() {
          resources.sound[s].volume = volume;
          resources.sound[s].play();
        }
      })(this,s, volume);

    setTimeout(playSound,50);
    }
}
