var Factual = require('factual-api');

function getRandomIntList(min, max, count) {
    min = Math.ceil(min);
    max = Math.floor(max);
    list = [];
    if (max === count) {
        for (var i = min; i <= max; i++) {
            list.push(i);
        }
        return list;
    }
    while (list.length < count) {
        int = Math.floor(Math.random() * (max - min + 1)) + min;
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

factualClient.prototype.findRestaurants = function(count, cb){
    // TODO: improve this
    return this.api.get('/t/places-us',{
            geo:{"$circle":{"$center":[this.lat, this.lon],"$meters":1000}},
            filters:{category_ids:{"$includes_any":[312,347]}},
            limit:50
        }, function (error, res) {

        console.log(res);

        var indices = getRandomIntList(1, res.data.length, count);
        var restaurants = '';
        for (var i = 0; i < indices.length; i++) {
            restaurant = res.data[indices[i]];
            restaurants += '* ' + restaurant.name + ' (' + restaurant.address + ')\n';
        }
        console.log(restaurants);
        return cb(restaurants);
    });
};

module.exports = {
    factualClient: factualClient,
};
