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

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: settings.debug
});

var bot = controller.spawn({
    token: settings.slackToken
}).startRTM();


controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'You are ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});


controller.hears(['shutdown', 'kill yourself'], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            if (user.name === 'master'){
                bot.startConversation(message, function(err, convo) {
                    convo.ask('Are you sure you want me to shutdown?', [
                        {
                            pattern: bot.utterances.yes,
                            callback: function(response, convo) {
                                convo.say('Bye!');
                                convo.next();
                                setTimeout(function() {
                                    process.exit();
                                }, 3000);
                            }
                        },
                    {
                        pattern: bot.utterances.no,
                        default: true,
                        callback: function(response, convo) {
                            convo.say('*Phew!*');
                            convo.next();
                        }
                    }
                    ]);
                });
            } else {
                bot.reply(message, 'You\'re not the boss of me, ' + user.name + '!');
            }
        } else {
            bot.reply(message, 'You\'re not the boss of me!');
        }
    });
});


controller.hears(['papers, please', 'uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

controller.hears(['what is your purpose', 'tell me about yourself'],
    'direct_message,direct_mention,mention', function(bot, message) {

        bot.reply(message,
            ':robot_face: I am <@' + bot.identity.name +
             '>. My purpose in existence is to make fancy lunch decisions. ' + 
             'I cannot do so yet, but I will improve.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}