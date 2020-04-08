const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(fileUpload());
app.use(urlencodedParser);
app.use('/storage', express.static(__dirname + '/storage'));

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

app.get('/api/worldobjects', function(req, res) {
  WorldObject.find({}, function(err, worldObjectList) {
    if (err) return console.log(err);
    res.json(worldObjectList)
  })
});

app.post('/api/worldobjects', function(req, res) {
  console.log('body: ', req.body);
  // console.log('files: ', req.files);
  
  const data = {
    pos: {
      x: req.body.x,
      y: req.body.y,
      z: req.body.z,
    },
    photo: ''
  }
  
  const STORAGE_DIR = path.join(__dirname + '/storage');
  const photoFile = req.files.photo;
  photoFile.mv(STORAGE_DIR + '/' + photoFile.name, function(err) {
    if (err) {
      console.log(err);
      res.status(400).json({error: true});
    }

    data.photo = '/storage/' + photoFile.name;
  
    const newWorldObject = new WorldObject(data);
  
    newWorldObject.save(function(err) {
      if (err) return console.log(err);
  
      res.json(newWorldObject);
    }); 
  })
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

