# Unmob
This is how 1000's of voters work together to democratically determine the best 4 (or so) questions to ask the candidates of an [undebate](github.com/EnCiv/undebate).  It's also a great way for constituents to figure out the top 4 (or so) priorities for the representatives to address.

**Copyright 2021 EnCiv, Inc.** This work is licensed under the terms described in [LICENSE.txt](https://github.com/EnCiv/undebate/blob/master/LICENSE.txt) which is an MIT license with a Public Good License Condition

# Getting Started

You will need to install the following, if you do not already have them.

1. Git: On windows go to https://git-scm.com/download/win and install it. If you are on a Mac, install brew first, https://brew.sh/ and then `brew install git`
2. Node.js: https://nodejs.org/en/download/
3. Heroku: https://devcenter.heroku.com/articles/heroku-cli
4. I use visual studio code, but you can use another environment, but you will need to be able to run git-bash terminal windows in your environment.
   https://code.visualstudio.com/

## Setup

On your browser go to your github account and login

If you have just installed VSC you need to setup the bash shell. Use Control-Shift-P
In the input field type "Select Default Shell"
Choose "Git Bash"

Then open a git-bash shell - on VSC use Control-\`
```
    mkdir my-app
    git clone https://github.com/EnCiv/unmob
    cd unmob
    npm install
```
### MongoDB
This app uses MONGODB and you will need a mongodb uri to get started.   Cloud.mongodb.com has free accounts, you can go there and follow these [instructions](https://docs.google.com/presentation/d/10fEk_OdfN-dYh9PlqG6nTFlu4ENvis_owdHbqWYDpBI/present?slide=id.gb4a0dbf10b_0_93)

you should end up with a .bashrc file that looks like this
```
#!/bin/bash
export NODE_ENV="development"
export MONGODB_URI="mongodb+srv://user-name:secret-password@cluster0.vwxyz.mongodb.net/db-name?retryWrites=true&w=majority"
```
Note that it's confusing but user-name and db-name can be anything.  You pick them when you create the database, and you use them in this URI string.  That's all.  
### Run it
```
source .bashrc
npm run dev
```
You will now be able to go to http://localhost:3012 


### Run it in the cloud on heroku
This assumes you have already created your heroku account at heroku.com and that you have installed the heroku command line interface (CLI) from https://devcenter.heroku.com/articles/heroku-cli



You will need to think of your own unique application name.  If you get an error from this step, it may be because the name you thought of is not unique.
```
heroku create my-unique-app-name
```
First, lets do a few things to setup the enviromment
```
echo export EDITOR="code --wait" >> .bashrc
source .bashrc
heroku config:set MONGODB_URI=""
heroku config:edit MONGODB_URI
```
The last step will open up a new Visual Studio Code window, with nothing in it.
Paste in the URI again, just the URI like:
```
mongodb+srv://any-name-you-want:Znkx8UyAZAV15xRK@cluster0.xtpzi.mongodb.net/anydbname?retryWrites=true&w=majority
```
&nbsp;&nbsp;&nbsp;&nbsp;Then do Control-s Control-w to save and exit

Back in the terminal window you will see:
```
Fetching config... done

Config Diff:
- MONGODB_URI=
+ MONGODB_URI='mongodb+srv://any-name-you-want:Znkx8UyAZAV15xRK@cluster0.xtpzi.mongodb.net/anydbname?retryWrites=true&w=majority'

Update config on my-unique-aoo-name with these values?:  
```
&nbsp;&nbsp;&nbsp;&nbsp;hit 'y' and \<Enter\>

All of this is configuration stuff you only have to do once.   You can push the code to the heroku server with
```
git push heroku
```
When that is done, you will be able to go to our new app by browsing to https://my-unique-app-name.herokuapp.com (don't click on this link - you will have to type in your own app-name yourself)

Then whenever you make changes to your code and you want to try it out on heroku you can:
```
git add .
git commit -m "a descriptive commit message"
git push heroku
```
