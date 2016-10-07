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

    resources.finalCallback = callback
    var DESCRIPTORS = "descriptors/"
    var CHARASETS = "charaset/"
    var LEVELS = "levels/"

    this.faceset = document.getElementById("faceset");
    this.charasetimg = document.getElementById("charasetimg");
    this.printerset = document.getElementById("printerimg");
    this.monsterimg = document.getElementById("monsterbattleimg");
    this.tile = {}
    this.pictures = {}
    this.syspictures = {}
    this.syspictures.title = document.getElementById("titleimg");
    this.syspictures.keys0 = document.getElementById("keys0");
    this.syspictures.keys1 = document.getElementById("keys1");
    this.syspictures.keys2 = document.getElementById("keys2");
    this.syspictures.controllers = document.getElementById("controllers");

    resources.loadingList = [];

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
        resDict.isScheduled = true
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

    var checkAllLoaded = function(){
        var allLoaded = true
        for(var i=0; i<resources.loadingList.length ; i++){
            var resDict = resources.loadingList[i]
            allLoaded = allLoaded && resDict.loaded;
        }
       
        if(allLoaded){
            resources.finalCallback()
        }
    };

    this.doLoad = function(i){
        var resDict = resources.loadingList[i]
        if(resDict.isScheduled){
            return;
        }

        if(resDict.fileType == 'json'){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if(resDict.fileType == '')
                    resDict.to = JSON.parse(this.responseText); //this is fake code!!!!
                    resDict.loaded = true
                    resDict.tinyCallback();
                }
            };
            request.open('GET', resDict.from, true);
            request.send();
            resDict.isScheduled = true;
        }
    };
    
    this.loadAfterInit = function(){
        var LevelsList = resources.init['LevelsList'];
        for (var level in LevelsList) {
            var levelItem = LevelsList[level];
            scheduleLoad(['levels',level],
                         DESCRIPTORS + LEVELS + levelItem,
                         'json',
                         function(){
                            var tileimage = resources['levels'][level]['Level']['tileImage'];
                            if (resources.tileslist.indexOf(tileimage) < 0) {
                                resources.tileslist.push(tileimage);
                            }            
                         });        
        }
        var CharasetFileList = this.init['CharasetFileList'];
        for (var charasetfilep in CharasetFileList) {
            var charasetfile = CharasetFileList[charasetfilep];
            scheduleLoad(['charasets'],
                         DESCRIPTORS + CHARASETS + charasetfile,
                         'json');
                         
        }
        
    };

    /** jsonGet is deprecated and should vanish soon enough
     *  every part of the code should be updated
     */
    var jsonGet = function(urlToGet) {
        var request = new XMLHttpRequest();
        request.open('get', urlToGet, false /*async*/ );
        request.send(); // blocks because async is false
        var json = request.responseText; // string
        return JSON.parse(json); // do string parsing and returns an object
    }

    document.getElementsByTagName('canvas')[0].getContext('2d').fillStyle = '#FFFFFF';

    var filecount = 0;
    var getresource = function(getthis) {
        var toreturn = jsonGet(getthis)

        filecount += 1
        if (!(typeof toreturn.Level === "undefined")) {
            document.getElementsByTagName('canvas')[0].getContext('2d').fillText(".", filecount, filecount)
        }
        return toreturn
    }

    this.init = jsonGet(DESCRIPTORS+'init.json');



    this.tileset = []

    this.feedback = getresource(DESCRIPTORS + "feedback.json")['Feedback'];
    this.tileslist = []

    LevelsList = this.init['LevelsList']
    for (var level in LevelsList) {
        var levelItem = LevelsList[level]
        console.log(DESCRIPTORS + LEVELS + levelItem)
        resources['levels'][level] = getresource(DESCRIPTORS + LEVELS + levelItem);
        var tileimage = resources['levels'][level]['Level']['tileImage']
        if (this.tileslist.indexOf(tileimage) < 0) {
            this.tileslist.push(tileimage)
        }
    }
    CharasetFileList = this.init['CharasetFileList']
    for (var charasetfilep in CharasetFileList) {
        var charasetfile = CharasetFileList[charasetfilep]
        console.log(DESCRIPTORS + CHARASETS + charasetfile)
        resources['charasets'] = getresource(DESCRIPTORS + CHARASETS + charasetfile)['Charaset'];
    }
    resources['charas'] = getresource(DESCRIPTORS + "charas.json")['Charas'];
    this.playerCharaset = resources['charasets'][this.init['Player']['charaSet']];
    this.hms = getresource(DESCRIPTORS + this.init["HMSFile"])
    this.items = getresource(DESCRIPTORS + this.init["itemsFile"])['Items']

    this.pictureList = this.init['PictureList']

    pic_count = 0
    index = 0

    function loadImages(src, callback) {
        if(index < resources.tileslist.length){
            resources.tile[src] = new Image();
            resources.tile[src].onload = function() {
                index++;
                if (index < resources.tileslist.length) {
                    loadImages(resources.tileslist[index], callback);
                } else if (pic_count < resources.pictureList.length){
                    loadImages(resources.pictureList[pic_count], callback);
                } else {
                    callback()
                }
            };
            resources.tile[src].src = src;
        } else {
            var name = src
            resources.pictures[name] = new Image();
            resources.pictures[name].onload = function() {
                pic_count++;
                if(pic_count < resources.pictureList.length){
                    loadImages(resources.pictureList[pic_count], callback)
                } else {
                    callback()
                }
            };
            resources.pictures[name].src = 'img/pictures/'+name+'.png'
        }
    }

    loadImages(resources.tileslist[index], callback)

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
