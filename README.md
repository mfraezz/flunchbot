# FLunchbot
A Slack Bot to make Fancy Lunch decisions

#### Running FLunchbot
* Install dependencies: `npm install`
* Get a Bot token from Slack:
  -> http://my.slack.com/services/new/bot
* Copy default settings to `local.json`: `cp defaults.json local.json`
* Add bot token to local settings as `slackToken`
* Run your bot from the command line: `node flunch_bot.js`

#### TODO:
* Add integration with [Factual API](http://developer.factual.com/api-docs/) to get restaurant info.
  * Evaluate [official JS client library](https://github.com/Factual/factual-nodejs-driver) for API calls
* Design conversation flow for FLunch planning 
 

#### See also
http://howdy.ai/botkit
