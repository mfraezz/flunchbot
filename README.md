# FLunchbot
A Slack Bot to make Fancy Lunch decisions

#### Running FLunchbot
* Install dependencies: `npm install`
* Get a Bot token from Slack:
  -> http://my.slack.com/services/new/bot
* Get OAuth keys from Factual:
  -> https://www.factual.com/keys
* Copy default settings to `local.json`: `cp defaults.json local.json`
* Add bot token and Factual creds to `local.json`
* (Optional) Specify [geoFilter](http://developer.factual.com/api-docs/#geo-filters) in `local.json`
* Run your bot from the command line: `node flunch_bot.js`

#### TODO:
* Improve integration with [Factual API](http://developer.factual.com/api-docs/) to get better info.
  * Use [official JS client library](https://github.com/Factual/factual-nodejs-driver) for API calls
* Design conversation flow for FLunch planning 
 

#### See also
http://howdy.ai/botkit
