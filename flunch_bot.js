/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______  __       __  __   __   __   ______   __  __   ______   ______   ______  
/\  ___\/\ \     /\ \/\ \ /\ "-.\ \ /\  ___\ /\ \_\ \ /\  == \ /\  __ \ /\__  _\ 
\ \  __\\ \ \____\ \ \_\ \\ \ \-.  \\ \ \____\ \  __ \\ \  __< \ \ \/\ \\/_/\ \/ 
 \ \_\   \ \_____\\ \_____\\ \_\\"\_\\ \_____\\ \_\ \_\\ \_____\\ \_____\  \ \_\ 
  \/_/    \/_____/ \/_____/ \/_/ \/_/ \/_____/ \/_/\/_/ \/_____/ \/_____/   \/_/ 
                                                                                 
This is shamelessly stolen from the sample Slack Bot,
   found at https://github.com/howdyai/botkit/blob/master/slack_bot.js

This bot demonstrates many of the core features of Botkit:
* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:
  Get a Bot token from Slack:
    -> http://my.slack.com/services/new/bot
  Copy default settings to `local.json`:
    `cp defaults.json local.json`
  Run your bot from the command line:
    `node flunch_bot.js`

# USE THE BOT:
  Find your bot inside Slack to send it a direct message.
  Say: "Hello"
  The bot will reply "Hello!"
  Say: "who are you?"
  The bot will tell you its name, where it is running, and for how long.
  Say: "Call me <nickname>"
  Tell the bot your nickname. Now you are friends.
  Say: "who am I?"
  The bot will tell you your nickname, if it knows one for you.
  Say: "shutdown"
  The bot will ask if you are sure, and then shut itself down.
  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:
  Botkit has many features for building cool and useful bots!
  Read all about it here:
    -> http://howdy.ai/botkit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var settings = require('./defaults.json');
var localSettings = require('./local.json');
var flunchBot = require('./flunchBotModel').flunchBot;

if (!localSettings) {
    console.log('Error: Specify local settings in `local.json`');
}

for (var key in localSettings) {
    if (localSettings[key] !== undefined){  // ignore key:null mapping
        settings[key] = localSettings[key];
    }
}

if (!settings.slackToken) {
    console.log('Error: Specify slackToken in `local.json`');
    process.exit(1);
}

// TODO: Add Factual support
// if (!settings.factualKey) {
//     console.log('Error: Specify factualKey in `local.json`');
//     process.exit(1);
// }
//
// if (!settings.factualSecret) {
//     console.log('Error: Specify factualSecret in `local.json`');
//     process.exit(1);
// }

new flunchBot(settings, null);
