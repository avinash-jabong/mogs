var mongodb = require('mongodb');
var fs = require('fs');
var MongoClient = mongodb.MongoClient;
var _ = require('lodash');
var url = 'mongodb://localhost:27017/logs';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    var logs = db.collection('logs');
    fs.readFile(process.argv[2], function(err, result){
	result = result.toString().split('\n');
	var collector = [];
        _.each(result, function(res){
		if(res.length)
		{
			var xres = JSON.parse(res);
			xres.message = JSON.parse(xres.message);
			collector.push(xres);
		}
	});
        logs.insert(collector, function(e,d){
		if(e){console.log(e)}
		db.close();
	});	
    });
  }
});
