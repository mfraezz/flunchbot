/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ______  __       __  __   __   __   ______   __  __   ______   ______   ______  
/\  ___\/\ \     /\ \/\ \ /\ "-.\ \ /\  ___\ /\ \_\ \ /\  == \ /\  __ \ /\__  _\ 
\ \  __\\ \ \____\ \ \_\ \\ \ \-.  \\ \ \____\ \  __ \\ \  __< \ \ \/\ \\/_/\ \/ 
 \ \_\   \ \_____\\ \_____\\ \_\\"\_\\ \_____\\ \_\ \_\\ \_____\\ \_____\  \ \_\ 
  \/_/    \/_____/ \/_____/ \/_/ \/_/ \/_____/ \/_/\/_/ \/_____/ \/_____/   \/_/ 
                                                                                 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var settings = require('./defaults.json');
var localSettings = require('./local.json');
var flunchBot = require('./flunchBotModel').flunchBot;
var factualClient = require('./factualApiClient').factualClient;

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

var client = new factualClient(settings);

new flunchBot(settings, client);
