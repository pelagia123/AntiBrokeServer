const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors')

const MongoClient = require('mongodb').MongoClient
const mongodb = require('mongodb')

let db;
let ObjectID = mongodb.ObjectID;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/expenses', (req, res) => {
  console.log(`post exp`, req.body);

  db.collection('expenses').insertOne(req.body, (err, result) => {
    if (err) {
      res.status(500).send('not saved in database')
    } else {
      res.status(201).send(result.ops[0]);
      console.log('saved to database');
    }
  });
});

app.get('/expenses', (req, res) => {
  db.collection('expenses').find({}).toArray((err, result) => {
    if (err) {
      console.log(`error!`);
      res.status(404).send('we have faiced some issues');
    } else {
      res.status(200).send(result)
    }
  });
});

app.get('/expenses/:id', (req, res) => {
  db.collection('expenses').findOne({_id: new ObjectID(req.params.id.toString())}, (err, result) => {
    if (err) {
      res.status(500).send('ups we have error');
    } else {
      res.status(200).send(result);
    }
  });
});

app.delete('/expenses/:id', (req, res) => {
  db.collection('expenses').deleteOne({_id: new ObjectID(req.params.id.toString())}, (err, result) => {
    if (err) {
      res.status(500).send('ups we have error');
    } else {
      console.log('result', result)
      res.status(200).send();
    }
  })
});

MongoClient.connect('mongodb://pelcia:marcinek006@ds151012.mlab.com:51012/antibroke', {useNewUrlParser: true}, (err, database) => {
  if (err) return console.log(`error`, err);
  db = database.db('antibroke')
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});
