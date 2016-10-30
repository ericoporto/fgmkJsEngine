// feedback.js
//  Some engine related things needs that happen, needs to be
// passed back to the user in non visual ways. The feedbackEng
// deals with sounds and vibration for these informatives
// that are not graphical. This allows the player using the
// smartphone or tablet with sound disabled to still have some
// minimum feedback from what's happening even without sounds.
//  At the same time, sounds are always important to the person
// playing in a computer.
//  Game dependent sounds are not part of the feedbackEng, these
// will be part of a new, still not implemented js file.

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

    if (mediaPlaybackRequiresUserGesture()) {
        this.restrictions = true
        this.soundOn = false;
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

// MIT LICENSE
// Copyright (c) 2016 Érico Vieira Porto
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the
// Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute,
// sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// You can't claim ownership, use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell any software, images or
// documents that includes characters, assets, or story elements
// of the game distributed along with this engine.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
