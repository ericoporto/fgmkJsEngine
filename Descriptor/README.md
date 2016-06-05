Welcome to the FanGaMk wiki!

FGMK is the Fan Game Maker, it's made to resemble a little the RPG Maker 2000 - from memory, I haven't used it in ten years - but aims at easier to distribute games, and easier to modify. It's engine is made to be hacked, the descriptor files are meant to be human readable and even the editor is to be changed as needed.
Important information:


    d Game folder
    |
    ¦--d audio
    ¦--d font
    ¦--d img
    ¦--d descriptors
       |
       ¦--d charaset
       ¦--d levels
       |
       ¦--f init.json
       ¦--f feedback.json
       ¦--f hms.json
       ¦--f charas.json
       ¦--f items.json

##charaset Folder

Contains a json file descriptor for all charaset. 

##levels Folder

Contain a json file descriptor for each map.

##init.json

Describe initial parameters, like where in which map the hero begins and who is in the party at start.

##feedback.json

Vibration and sound settings

##hms.json

Hero, Monsters and Skills settings. This is important for the battles.

##charas.json

Set interaction, actions and animations for a chara. A chara can be placed in any map in the folder levels.

##items.json

Configure available items,that can be add or removed from the inventory during the game.

[Vocabulary and Definitions](terms.md)

[Actions](actions.md)



Right now, it's code is hacked together, with help of code floating around the web and stackoverflow, because I'm no professional programmer - I do plan on later, with the help of others evolve the idea. If you feel some code here belongs to you and want to be credited for it, tell me, I will try my best to make your name appear here and in the Maker interface. Some other things to have in mind:

* The computer I use for development uses Linux, specifically Ubuntu 14.04 and Firefox, so even though Javascript and Python can run in other platforms, I current have no way to thoroughly test in them. Also the there 's little to none sanity tests - so if you feed the software with garbage data the result is unpredictable.

* Until this being published here in GitHub it's being a single man effort - so expect bugs, shitty coding style... Also at first I didn't have the intent to release the code, it was something I was making for myself, but some friends saw and motivate me to release it here.

* Language support is for plain English, there is now no intend on supporting other languages - this is due the way text string is manipulated in the code. If you think your language deserves attention, submit a issue, and later, when the code is more stable, I will think on doing this.

* The Javascript code is based on the source of the original game Redo, made by Lino, in the Global Game Jam 2012. In this article, he is the crazy guy with only an Ipad and I'm the electric engineer

Fork, modify, hack, make it your own. Go ahead and have fun! :)
