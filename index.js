const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');
const bodyParser = require('body-parser');

const PositionSchema = new Schema({
  x: String,
  y: String,
  z: String
});

const WorldObjectSchema = new Schema({
  pos: PositionSchema,
  photo: String
})


const WorldObject = mongoose.model("WorldObject", WorldObjectSchema);

mongoose.connect('mongodb://localhost:27017/devkeepertestdb', {
  useNewUrlParser: true,
}, function(err) {
    if(err) return console.log(err);

    app.listen(3000, function() {
        console.log('Server starting');
    })
});


const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

app.get('/api/worldobjects', function(req, res) {
  WorldObject.find({}, function(err, worldObjectList) {
    if (err) return console.log(err);
    res.json(worldObjectList)
  })
});

app.post('/api/worldobjects', jsonParser, function(req, res) {
  const newWorldObject = new WorldObject(req.body);

  newWorldObject.save(function(err) {
    if (err) return console.log(err);

    res.send(newWorldObject);
  }); 
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

