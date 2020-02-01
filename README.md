# unrealworld-saves
my unreal world savegames for machine replication

> Requires:
> - node.js >=6

## UnReal World save files for postdawn / storjarn

This project is maintained in git as not only a toolset, but a persistence layer for savegames.

- Save files (for each character as well as the ancestors)
- Tool files (this file i.e. gulpfile.js, .gitignore, package.json, etc.)
- Various state files that might be of interest in UnReal World, like debug_ter-tiles.txt
- READMEs and other doc files

The `.gitignore` file is the key to not saving everything and the kitchen sink.

The zip file is created in the `compress` task, with saves each character's folder as well as the ancestors folder.

The git commands are basic and probably could use some work for a certain refineness.

If you're wondering, this does circumvent the idea of pure roguelike death, in that with this toolset
you can revive a character from a savegame file state once it's been persisted in a zipfile.

Another crazy idea is that although this project is just for me, as I work through it, it could become a tool
for anyone playing UnReal World to be able to use this toolset (including their own modifications) to persist
their own savegame files, in their own git repo.  With forking, you can even maintain your own fork against any originating script
or configuration changes from my own (this) repo.  Read more below for the issues and concerns with forking.

### Getting Started

You will want to install in the root where your save files are stored in their own folders.

For example, on macOS Catalina and Steam for me, this was:

> ~/Library/ApplicationSupport/Steam/steamapps/common/UnRealWorld/UrW.app/Contents/Resources

Next, you'll want to initialize this repo in the root folder above.

- `git init`
- `git remote add origin git@github.com:storjarn/unrealworld-saves.git`
- `git fetch origin`
- `git pull`
- `npm install`

Doing this proceeds to install this toolset into your current UnReal World game to have my save game characters.
Your ANCESTORS folder might get wiped out though, in this case.

It's better, but experimental at this point, to instead fork this project so you can implement your own toolset and savefile changes.
See below for more information.

---

#### Forking

If you fork this repo, you can then init your new git repo in your game root folder and take advantage of
persisting your savegame files and having a backup.

For example, you can init the git connection like so, where `<url>` is the github url for your fork:

- `git init`
- `git remote add origin <url>`
- `git fetch origin`
- `git pull`

You can always add this project as another remote, something other than `origin`, so you can pull the latest tool files.  I am working on making the project more modular and flexible for forking, so take note that this is absolutely an experimental thing to try at this point.

---

#### Running the scripts

After pulling the latest from git, just:

```
$ npm install
```

## PULL the latest savefiles

```
gulp load
```

## PUSH the latest savefiles

```
gulp save --message 'My commit message'
```

## Default task

```
gulp
```

This produces something like this:

```
[14:53:29] Using gulpfile ~/Library/Application Support/Steam/steamapps/common/UnRealWorld/UrW.app/Contents/Resources/gulpfile.js
[14:53:29] Starting 'default'...

-=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-=

Choose a task:

   * compress - Zip up all the character and ancestor save files
   * commit - Git commit and push the zip file, i.e. gulp commit --message "My commit message"
   * load - Pull down the latest zip from the repo and unzip
   * save - Compresses and uploads the latest changes.  Runs `compress` then `commit`.
   * default - Lists the tasks

-=-=-=-=-=-=-=-=-=-=-=-=-===-=-=-=-=-=-=-=

 ? compress
[14:53:32] Starting 'compress'...
[14:53:32] Finished 'default' after 2.82 s
[14:53:39] Finished 'compress' after 7.17 s

```