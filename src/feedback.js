feedbackEng = {}

feedbackEng.setup = function() {
    this.once = false;
    this.timer = null;
    this.vibrationOn = false;
    this.restrictions = false;
    this.soundOn = true;
    this.flist= {};
    this.loadedSounds = {};
    this.vibrate= null;

    this.flist = resources.feedback
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
        // vibration API supported
        this.vibrationOn = true ;
    }
    if(window.isFirefox()) {
        this.soundOn = true;
    }
    for (var sound in this.flist) {
        this.loadedSounds[sound] =  document.getElementById(this.flist[sound].s)
    }

    function mediaPlaybackRequiresUserGesture() {
        // test if play() is ignored when not called from an input event handler
        var video = document.createElement('video');
        video.play();
        return video.paused;
    };

    console.log("test")

    this.removeBehaviorsRestrictions  = function () {
        window.removeEventListener('keydown', feedbackEng.removeBehaviorsRestrictions);
        window.removeEventListener('mousedown',  feedbackEng.removeBehaviorsRestrictions);
        window.removeEventListener('touchstart',  feedbackEng.removeBehaviorsRestrictions);
        for(var sound in feedbackEng.loadedSounds){
            feedbackEng.loadedSounds[sound].play()
        }
    };

    if (mediaPlaybackRequiresUserGesture()) {
        this.restrictions = true
        this.soundOn = false;
        console.log('wait for input event');
        window.addEventListener('keydown',  feedbackEng.removeBehaviorsRestrictions);
        window.addEventListener('mousedown',  feedbackEng.removeBehaviorsRestrictions);
        window.addEventListener('touchstart',  feedbackEng.removeBehaviorsRestrictions);
    }
};

feedbackEng.play = function(feedback) {
    if (this.once == false) {
        if(this.vibrationOn) {
            navigator.vibrate(this.flist[feedback].v);
        }
        if(this.soundOn) {
            if(this.restrictions){
                this.loadedSounds[feedback].currentTime = 0;
                this.loadedSounds[feedback].play()
            } else {
                this.loadedSounds[feedback].cloneNode(true).play();
            }

        }
        //this.once = true;
        //this.turnOnceOffTime();
    }
};


feedbackEng.turnOnceOffTime =function() {
    this.timer = setTimeout(function() {
        feedbackEng.once = false;
    }, 100.0);
};
