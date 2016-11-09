// playbutton.js

playbutton = {
  setup: function(callback){


    playbutton.callback = callback;
    if(window.mobilecheck()){
      var createButton = function(buttonname, context, func) {
          var button = document.createElement("input");
          button.type = "button";
          button.value = buttonname;
          button.id = 'play_button'

          //make flat
          button.style['appearance'] = 'none';
          button.style['box-shadow'] = 'none';
          button.style['border-radius'] = 0;
          button.style['color'] = '#bbb';
          button.style['background-color'] = '#111';
          button.style['border'] = 'none';
          button.style['font-size'] = '60px'
          button.style['font-family'] = 'INFO56';

          //place at center
          button.style.position = 'absolute';
          button.style['z-index'] = 1000;
          button.style.top = '50%';
          button.style.left = '50%';
          button.style.margin = '-100px -200px';
          button.style.height = '200px'
          button.style.width = '400px'

          button.addEventListener('click', func)
          button.addEventListener('touchend', func)


          context.appendChild(button);

      };

      this.gameStart = function(){
        var button = document.getElementById('play_button');
        for(var sound in feedbackEng.loadedSounds){
            feedbackEng.loadedSounds[sound].play()
            feedbackEng.loadedSounds[sound].pause();
        }
        if(!resources.webAudioApiSupport){
          for(var song in resources.music){
            resources.music[song].play();
            resources.music[song].pause();
          }
        }

        bgmusic.play(resources.init['World']['initMusic']);
        button.removeEventListener('click',this.gameStart)
        button.removeEventListener('touchend',this.gameStart)
        playbutton.callback();
        playbutton.callback = 0;
        button.parentNode.removeChild(button);
        button = 0;
        return false;
      }

      //create a button
      createButton('PLAY GAME',
                   document.documentElement,
                   this.gameStart
                 );

    } else {
      playbutton.callback();
      bgmusic.play(resources.init['World']['initMusic']);
      playbutton.callback = 0;
    }
  }
}
