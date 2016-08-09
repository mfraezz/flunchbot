var Factual = require('factual-api');
var moment = require('moment');

function getRandomIntList(min, max, count) {
    min = Math.ceil(min);
    max = Math.floor(max);
    list = [];
    if (max === count - 1) {
        for (var i = 0; i < max; i++) {
            list.push(i);
        }
        return list;
    }
    while (list.length < count) {
        int = Math.floor(Math.random() * (max - min + 1));
        if (list.indexOf(int) === -1) {
            list.push(int);
        }
    }
    return list;
}

function factualClient(settings) {
    if (!settings.factualKey) {
        console.log('Error: Specify factualKey in `local.json`');
        process.exit(1);
    }
    
    if (!settings.factualSecret) {
        console.log('Error: Specify factualSecret in `local.json`');
        process.exit(1);
    }

    this.lat = settings.latitude;
    this.lon = settings.longitude;

    this.api = new Factual(settings.factualKey, settings.factualSecret);
}

factualClient.prototype.findRestaurants = function(count, type_ids, cb){
    // TODO: improve this
    return this.api.get('/t/places-us',{
            geo:{"$within":{"$rect":[[38.032647,-78.484397],[38.027087,-78.476576]]}},
            filters:{category_ids:{"$includes_any":[
                type_ids.toString()
            ]}},
            limit:50
        }, function (error, res) {

        // console.log(res);

        var indices = getRandomIntList(1, res.data.length, count);
        var restaurants = '';
        for (var i = 0; i < indices.length; i++) {
            restaurant = res.data[indices[i]];
            var hours;
            try {
                hours = restaurant.hours[moment().format('dddd').toLowerCase()];
                var h  =  '';
                for (var j=0; j < hours.length; j++) {
                    h = h + hours[j][0] + '-' + hours[j][1] + ','; 
                }
                hours = h;
            } catch (err) {
                // Maybe there are no specified hours for today
                // List general hours, if any
                hours = restaurant.hours_display;
            }
            if (!hours) {
                hours = 'Hours unknown';
            }
            restaurants += '* ' + restaurant.name + ': ' + hours + '\n';
        }
        console.log(restaurants);
        return cb(restaurants);
    });
};

module.exports = {
    factualClient: factualClient,
};
