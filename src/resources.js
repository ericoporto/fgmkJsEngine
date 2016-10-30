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
    feedback: {},
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
    this.pictures = {};
    this.syspictures = {};
    this.music = {};
    this.syspictures.title = document.getElementById("titleimg");
    this.syspictures.keys1 = document.getElementById("keys1");
    this.syspictures.keys2 = document.getElementById("keys2");
    this.syspictures.controllers = document.getElementById("controllers");

    this.tileslist = [];

    this.loadingList = [];

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

        if(resDict.fileType == 'json'){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if(resDict.to[0]=='charasets'){
                        resources['charasets'] = JSON.parse(this.responseText)['Charaset'];
                    } else if (resDict.to[0]=='feedback') {
                        resources['feedback'] = JSON.parse(this.responseText)['Feedback'];
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
        if(resDict.fileType == 'ogg'){
          resources[resDict.to[0]][resDict.to[1]]  = new Audio();
          resources[resDict.to[0]][resDict.to[1]].addEventListener('canplaythrough',
            function() {
              resDict.loaded = true;
              if(typeof resDict.tinyCallback === 'function'){
                  resDict.tinyCallback();
              }
              resources.checkAllLoaded();
            });
          resources[resDict.to[0]][resDict.to[1]].src = resDict.from;
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
        scheduleLoad(['feedback'],
                     DESCRIPTORS + "feedback.json",
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
            scheduleLoad(['music',music],
                         MUSIC + musicFile,
                         'ogg');

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
