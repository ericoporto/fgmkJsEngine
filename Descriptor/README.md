#FGMK

FGMK is the Fan Game Maker, it's made to resemble a little the RPG Maker 2000 - from memory, I haven't used it in ten years - but aims at easier to distribute games, and easier to modify. It's engine is made to be hacked, the descriptor files are meant to be human readable and even the editor is to be changed as needed.

#Vocabulary and Definitions

For making describing things easier and fast I had to invent some terms, [read more about them here](terms.md).

Basically the visual part of things that move in a map are **charasets**, the description on how that thing interact is a **chara** and the character you control is called **hero**. In battle, the characters you control are the **heroes** and whatever you are fighting are the **monsters**. Anything you can add to your inventory is a **item**.

#Files and folders organization

[`d Game folder        `](#game-folder)

`|                    `

[`¦--d audio           `](#audio-folder)

[`¦--d font            `](#font-folder)

[`¦--d img             `](#img-folder)

[`¦--d descriptors     `](#descriptors-folder)

`   |                 `

[`   ¦--d charaset     `](#charaset-folder)

[`   ¦--d levels       `](#levels-folder)

`   |                 `

[`   ¦--f init.json    `](#initjson)

[`   ¦--f feedback.json`](#feedbackjson)

[`   ¦--f hms.json     `](#hmsjson)

[`   ¦--f charas.json  `](#charasjson)

[`   ¦--f items.json   `](#itemsjson)

##Game Folder

This folder should contain the html engine, and the folders listed here. This folder can have any name, while all others have expected names that are as defined here.

###Audio Folder

This folder should contain all plain audio files that are going to be used, these can be wav and ogg files.

###Font Folder

This folder should contain the fonts you wish to use in your game - for rendering text.

###Img Folder

This folder should contain all the images you wish to use in your game, which includes how windows are draw, the images for charasets, the monsters image, the heros images and pictures.

###Descriptors Folder

All json descriptors that defines everything about your game.

####charaset Folder

Contains a json file descriptor for all charaset.

####levels Folder

Contain a json file descriptor for each map.

####init.json
Describe initial parameters, like where in which map the hero begins and who is in the party at start.

####feedback.json

Vibration and sound settings

####hms.json

Hero, Monsters and Skills settings. This is important for the battles.

####charas.json

Set interaction, actions and animations for a chara. A chara can be placed in any map in the folder levels.

####items.json

Configure available items,that can be add or removed from the inventory during the game.


#Engine fifo system

Everytime you interact with something in the game, actions will trigger. Each action works by placing engine atomic functions in the engine fifo buffer. These fuctions are then executed in the order they were placed in the buffer, in engine time. There are some functions that can alter a little which functions get executed - like IF cases.

#Actions

Whenever the hero interact with something (pressing action key or by being in a location), whenever something  happens, a list of actions is read. Actions will then place atomic functions in the Engine Fifo Buffer. An action can show a picture in the screen, add an item to the inventory, or show a text in the screen. You can [read more about them here](actions.md).

#Author and License

The Javascript code is inspired on the source of the original game Redo, made by Lino, in the Global Game Jam 2012. In this article, he is the crazy guy with only an Ipad and I'm the electric engineer

Fork, modify, hack, make it your own. Go ahead and have fun! If you make a game, share any modifications you do to the engine.

This code is written by Érico Vieira Porto, and it's here licensed as GPLv2.
