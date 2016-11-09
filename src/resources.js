// resources.js
//  This module should be responsable for loading things.
// every request made by the engine should be centralized in
// this module.

var resources = {
    init: {},
    tileset: null,
    playerChara: null,
    printerset: null,
    playerCharaset: null,
    faceset: null,
    items: {},
    levels: {},
    charasets: {},
    charas: {},
    hms: {}
};

resources.harvest = function(callback) {
    // the idea here is to loadInit, and then
    // analyze the init file in loadAfterInit
    // and scheduleLoad of all needed json files.
    //
    // than, ask for the loading of all of them with
    // loadFromSchedule.
    //
    // doLoad should be asked in the return and
    // if checkAllLoaded, should load all needed
    // images and then, after all images are loaded
    // throw the finalCallback
    //
    //

    resources.finalCallback = callback;
    var DESCRIPTORS = "descriptors/";
    var CHARASETS = "charaset/";
    var LEVELS = "levels/";
    var MUSIC = "audio/music/";

    this.faceset = document.getElementById("faceset");
    this.charasetimg = document.getElementById("charasetimg");
    this.printerset = document.getElementById("printerimg");
    this.monsterimg = document.getElementById("monsterbattleimg");
    this.tile = {};
    this.actx = {};
    this.pictures = {};
    this.syspictures = {};
    this.music = {};
    this.syspictures.title = document.getElementById("titleimg");
    this.syspictures.keys1 = document.getElementById("keys1");
    this.syspictures.keys2 = document.getElementById("keys2");
    this.syspictures.controllers = document.getElementById("controllers");
    this.errors = 0;
    this.tileslist = [];
    this.loadingList = [];

    //let's see if webAudioAPI is supported. If it isn't we will default to html5Audio
    //this is either true (supported) or false (webAudioAPI not supported)
    this.webAudioApiSupport = (function(){
      var context;
      try {
        // still needed for Safari
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        // create an AudioContext
        context = new AudioContext();
        return true
      } catch(e) {
        // API not supported
        return false;
      }
    })();

    //let's see what audio codecs are supported
    this.audioSupport = (function() {
        var audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;

        if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return {
            mp3: false,
            ogg: false,
            wav: false,
            aac: false
          };
        }

        var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

        return {
            mp3: !!(mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, '')),
            ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
            wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
            aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, '')
        };

    })();

    var reportLoadingErrors = function(resDict){
      document.getElementsByTagName('canvas')[0].getContext('2d').fillStyle = '#FF6677';
      document.getElementsByTagName('canvas')[0].getContext('2d').fillText(resDict.from + " failed!", 64, 96+32*resources.error )
      resources.error += 1
    }

    var loadInit = function(){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resources.init = JSON.parse(this.responseText); //this is fake code!!!!
                resources.loadAfterInit();
            }
        };
        request.open('GET', DESCRIPTORS + 'init.json', true);
        request.send();
    };

    var scheduleLoad = function(toWhere, fromUrl, fileType, tinyCallback){
        resources.loadingList.push({
            to: toWhere,
            from: fromUrl,
            fileType: fileType,
            loaded: false,
            isScheduled: false,
            tinyCallback: tinyCallback
        });
    };

    var loadFromSchedule = function(){
        for(var i=0; i<resources.loadingList.length ; i++){
            resources.doLoad(i);
        }
    };

    var loadAllImages = function(){

        pic_i = 0
        tile_i = 0

        function loadImages(src, callback) {
            if(tile_i < resources.tileslist.length){
                resources.tile[src] = new Image();
                resources.tile[src].onload = function() {
                    tile_i++;
                    if (tile_i < resources.tileslist.length) {
                        loadImages(resources.tileslist[tile_i], callback);
                    } else if (pic_i < resources.pictureList.length){
                        loadImages(resources.pictureList[pic_i], callback);
                    } else {
                        callback();
                    }
                };
                resources.tile[src].src = src;
            } else {
                var name = src;
                resources.pictures[name] = new Image();
                resources.pictures[name].onload = function() {
                    pic_i++;
                    if(pic_i < resources.pictureList.length){
                        loadImages(resources.pictureList[pic_i], callback);
                    } else {
                        callback();
                    }
                };
                resources.pictures[name].src = 'img/pictures/'+name+'.png';
            }
        }

        loadImages(resources.tileslist[tile_i], resources.finalCallback);
    };

    this.checkAllLoaded = function(){
        var allLoaded = true;
        for(var i=0; i<resources.loadingList.length ; i++){
            var resDict = resources.loadingList[i];
            allLoaded = allLoaded && resDict.loaded;
        }

        if(allLoaded){
            loadAllImages();
        }
    };

    this.doLoad = function(i){
        var resDict = resources.loadingList[i];
        if(resDict.isScheduled){
            return;
        }

        //it's a json, so we will read it and parse it as object!
        if(resDict.fileType == 'json'){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if(resDict.to[0]=='charasets'){
                        resources['charasets'] = JSON.parse(this.responseText)['Charaset'];
                    } else if (resDict.to[0]=='charas'){
                        resources['charas'] = JSON.parse(this.responseText)['Charas'];
                    } else if (resDict.to[0]=='items'){
                        resources['items'] = JSON.parse(this.responseText)['Items'];
                    } else {
                        if(resDict.to.length == 1){
                            resources[resDict.to[0]] = JSON.parse(this.responseText);
                        } else if(resDict.to.length == 2){
                            resources[resDict.to[0]][resDict.to[1]] = JSON.parse(this.responseText);
                        } else  if(resDict.to.length == 3){
                            resources[resDict.to[0]][resDict.to[1]][resDict.to[2]] = JSON.parse(this.responseText);
                        }
                    }
                    resDict.loaded = true;
                    if(typeof resDict.tinyCallback === 'function'){
                        resDict.tinyCallback();
                    }
                    resources.checkAllLoaded();
                }
            };
            request.open('GET', resDict.from, true);
            request.send();
            resDict.isScheduled = true;
        }

        //if it's an ogg, a mp3 or a wav, must be audio!
        //we will try to dinamically add an audio element.
        if(resDict.fileType == 'ogg' || resDict.fileType == 'mp3' || resDict.fileType == 'wav' ){
          var internetMediaType={'ogg':'audio/ogg','mp3':'audio/mpeg','wav':'audio/wav'}
          //when an audio is successfully loaded we need to throw a party
          //but for now this will suffice.
          var loadeddata = (function(resDict){
              return function() {
                //prevents a new load just in case
                if(resDict.loaded)
                  return;

                //mark it as loaded!
                resDict.loaded = true;
                //audio probably has no tinyCallback, but let's be consistent
                if(typeof resDict.tinyCallback === 'function'){
                    resDict.tinyCallback();
                }
                //check the status of everyon, if ok, let's callback!
                resources.checkAllLoaded();
              }
            })(resDict);

          //we will load the audio with XMLHttpRequest no matter what
          //it's more reliable and we can add retries!
          var request = new XMLHttpRequest();

          //is the webAudioApi supported?
          if(this.webAudioApiSupport){
            //let's create a context to play this audio!
            resources[resDict.to[0]][resDict.to[1]] = {};

            if( typeof resources.actx[resDict.to[0]] === 'undefined')
              resources.actx[resDict.to[0]] = new AudioContext();
            //the request will be an arraybuffer because of decodeAudioData!
            request.responseType = 'arraybuffer';

            request.onreadystatechange = (function(resDict,request){
              return function() {
              //isolating the context

                //is the request a success?
                if (request.readyState == 4 && request.status == 200) {
                  // request.response is encoded... so decode it now
                  resources.actx[resDict.to[0]].decodeAudioData(request.response, (function(resDict,request){
                      return function(buffer) {
                        resources[resDict.to[0]][resDict.to[1]].buffer = buffer;
                        if(resDict.to[0] == 'music'){
                          resources[resDict.to[0]][resDict.to[1]].loop = true; //music should be loopable!
                        }
                        resources[resDict.to[0]][resDict.to[1]].currentTime = 0;
                        resources[resDict.to[0]][resDict.to[1]].pause = function(){
                          if(resources.actx[resDict.to[0]].state === 'running') {
                            resources[resDict.to[0]][resDict.to[1]].source.stop();
                          }
                        }
                        resources[resDict.to[0]][resDict.to[1]].play = function(){
                          //I really hope there's an easier way. Since I couldn't find, when you play, this all happens!
                          resources[resDict.to[0]][resDict.to[1]].source = resources.actx[resDict.to[0]].createBufferSource();
                          resources[resDict.to[0]][resDict.to[1]].source.buffer = resources[resDict.to[0]][resDict.to[1]].buffer;
                          //make it loop
                          resources[resDict.to[0]][resDict.to[1]].source.loop = resources[resDict.to[0]][resDict.to[1]].loop;
                          // create a gain node
                          resources[resDict.to[0]][resDict.to[1]].gainNode = resources.actx[resDict.to[0]].createGain();
                          // connect the source to the gain node
                          resources[resDict.to[0]][resDict.to[1]].source.connect(resources[resDict.to[0]][resDict.to[1]].gainNode);
                          // connect gain node to destination
                          resources[resDict.to[0]][resDict.to[1]].gainNode.connect(resources.actx[resDict.to[0]].destination);
                          //
                          //sets the volume!
                          resources[resDict.to[0]][resDict.to[1]].gainNode.gain.value = resources[resDict.to[0]][resDict.to[1]].volume;
                          // play sound
                          resources[resDict.to[0]][resDict.to[1]].source.start(resources[resDict.to[0]][resDict.to[1]].currentTime);
                        }
                      }
                    })(resDict,request) /* decodeAudioData success */, function(err) {
                      throw new Error(err);
                    }); //end of decodeAudioData
                  request.onerror = null;
                  loadeddata();
                }// end of the if request...
              }
            })(resDict,request);


          } else {
            //the request will be a blob because it's needed to createObjectURL!
            request.responseType = 'blob'
            //create an audio element, make it loopable and let it empty for now.
            resources[resDict.to[0]][resDict.to[1]]  = document.createElement('audio');
            resources[resDict.to[0]][resDict.to[1]].id = resDict.to[1];
            resources[resDict.to[0]][resDict.to[1]].loop = true;

            //I am having trouble loading using audio.src, instead a XMLHttpRequest
            //is a more flexible way to load audio. I don't know if the problem
            //is github pages, but this is working better!
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                  //since the response is the binary audio, we will get it as blob
                  var blob = new Blob([this.response], {type: internetMediaType[resDict.fileType]});
                  //now we need to fake an url to shove in audio.src
                  //this has more support than big base64 src.
                  var objectUrl = window.URL.createObjectURL(blob);
                  resources[resDict.to[0]][resDict.to[1]].src = objectUrl;
                  // Release resource when it's loaded
                  resources[resDict.to[0]][resDict.to[1]].onload = function(evt) {
                    window.URL.revokeObjectURL(objectUrl);
                  };
                  this.onerror = null;
                  loadeddata()
                }
            };
          }

          //let's retry loading the audio
          request.onerror = (function(resDict,request){
            return function() {
              reportLoadingErrors(resDict)
              if(request.retry < request.maxRetries){
                request.open('GET', resDict.from, true);
                request.send();
                request.retry+=1;
              } else {
                //it failed, report the error
                alert('error loading: '+resDict.from)
              }
            }
          })(resDict,request);
          request.retry = 0;
          request.maxRetries = 3;
          request.open('GET', resDict.from, true /* async */);
          //actually do the request!
          request.send();

          //mark the resource as already scheduled
          resDict.isScheduled = true;
        }
    };

    this.loadAfterInit = function(){
        resources.pictureList = resources.init['PictureList']
        var LevelsList = resources.init['LevelsList'];
        for (var level in LevelsList) {
            var levelItem = LevelsList[level];
            scheduleLoad(['levels',level],
                         DESCRIPTORS + LEVELS + levelItem,
                         'json',
                         (function(level){
                              return function(){
                                  var tileimage = resources['levels'][level]['Level']['tileImage'];
                                  if (resources.tileslist.indexOf(tileimage) < 0) {
                                      resources.tileslist.push(tileimage);
                                  }
                              };})(level)
                         );
        }
        var CharasetFileList = this.init['CharasetFileList'];
        for (var charasetfilep in CharasetFileList) {
            var charasetfile = CharasetFileList[charasetfilep];
            scheduleLoad(['charasets'],
                         DESCRIPTORS + CHARASETS + charasetfile,
                         'json',
                          function(){
                              resources.playerCharaset = resources['charasets'][resources.init['Player']['charaSet']];
                          });

        }
        scheduleLoad(['charas'],
                     DESCRIPTORS + "charas.json",
                     'json');
        scheduleLoad(['hms'],
                     DESCRIPTORS + resources.init["HMSFile"],
                     'json');
        scheduleLoad(['items'],
                     DESCRIPTORS + resources.init["itemsFile"],
                    'json');


        var MusicList = this.init['MusicList'];
        for (var music in MusicList) {
            var musicFile = MusicList[music];
            //the if cases here assure only one type is loaded
            //and that they will be supported if available.
            if(this.audioSupport.ogg && 'ogg' in musicFile){
              scheduleLoad(['music',music],
                           MUSIC + musicFile.ogg,
                           'ogg');
            } else if(this.audioSupport.mp3 && 'mp3' in musicFile){
              scheduleLoad(['music',music],
                           MUSIC + musicFile.mp3,
                           'mp3');
            } else if(this.audioSupport.wav && 'wav' in musicFile){
              scheduleLoad(['music',music],
                           MUSIC + musicFile.wav,
                           'wav');
            }
        }

        loadFromSchedule();

    };

    loadInit()
}

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
