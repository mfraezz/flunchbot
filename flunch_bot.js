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

for (var key in localSettings) {
    if (localSettings[key] !== undefined){  // ignore key:null mapping
        settings[key] = localSettings[key];
    }
}

var client = new factualClient(settings);

new flunchBot(settings, client);
