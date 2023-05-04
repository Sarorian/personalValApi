require('dotenv').config();
const express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose'),
        Models = require('./models.js'),
        teamData = Models.teamData;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Trying to get team data for BYDO?")
})

app.get('/teamdata', (req, res) => {
    teamData.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err)
        })
})

app.get('/teamdata/:map', (req, res) => {
    teamData.find({ map: req.params.map})
    .then((data) => {
        if (data.length === 0) {
            res.status(200).json({
                status: 404,
                data: []
            });
        } else {
            res.status(200).json(data);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Error: ' + err)
    })
})

app.get('/players/:playerName', (req, res) => {
    const playerName = req.params.playerName;
    const playerModel = Models[playerName + 'Data'];
  
    if (!playerModel) {
        res.status(200).send('Invalid player name');
        return;
    }
  
    playerModel.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
  });

app.get('/players/:playerName/:agent', (req, res) => {
    const playerName = req.params.playerName;
    const playerModel = Models[playerName + 'Data'];
  
    if (!playerModel) {
        res.status(400).send('Invalid player name');
        return;
    }
  
    playerModel.find({ agent: req.params.agent })
        .then((data) => {
            if (data.length === 0) {
                res.status(404).json({
                    status: 404,
                    data: []
                });
            }
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
  });
const connectDB = async () => {
    try {
        mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to database sucesfully");
    } catch (e) {
        console.log(e);
    }
}

connectDB();

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});