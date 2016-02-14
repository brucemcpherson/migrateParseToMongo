function copyFromParseToMongo() {

  // key the db keys
  var store = PropertiesService.getUserProperties();
  var parseKeys = JSON.parse(store.getProperty('parseKeys'));
  var mongoKeys = JSON.parse(store.getProperty('mongoLabKeys'));

  // get a parse handle
  var parse = new cDbAbstraction.DbAbstraction(cDriverParse, {
    dbid:"mp",
    siloid:"ColorTable",
    driverob:parseKeys,
    disablecache:1
  });
  if (!parse.isHappy()) throw 'could not open parse database';

  var mongo = new cDbAbstraction.DbAbstraction(cDriverMongoLab, {
    dbid:'xliberation',
    siloid:"ColorTable",
    driverob:mongoKeys,
    disablecache:1
  });
  if (!mongo.isHappy()) throw 'could not open mongo database';

  
  // get the data from parse
  var parseResult = parse.query();
  if (parseResult.handleCode < 0) {
    throw JSON.stringify(parseResult);
  }

  // delete anything currently in mongo
  var mongoResult = mongo.remove();
  if (mongoResult.handleCode < 0) {
    throw JSON.stringify(mongoResult);
  }
  
  // write it to mongo
  var mongoResult = mongo.save(parseResult.data);
  if (mongoResult.handleCode < 0) {
    throw JSON.stringify(mongoResult);
  }
  
  // do a count
  Logger.log (parseResult.data.length + ' read from parse');
  Logger.log (mongo.count().data[0].count + ' written to mongo');

}

/**
* one off setting of my database credentials
*/
function OneTimeSetMyCredentials() {
  
  var store = PropertiesService.getUserProperties();
  
  // from mongolab dashboard
  store.setProperty("mongoLabKeys", JSON.stringify({
    "restAPIKey":"h3UECxxxxxx0Dcz"
  }));
  
  // from parse.com dashboard
  store.setProperty("parseKeys", JSON.stringify({
    "restAPIKey":"uHgHV7xxxxxxxxxOcSaTXjMT", 
    "applicationID":"a7aXU5fxxxxxxxx33BnURHNn8"
  }));

}
