"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = __importDefault(require("./models/url"));
var constants_1 = __importDefault(require("./utils/constants"));
require('dotenv').config();
var express = require('express');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var uri = process.env.MONGO_DB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(function () {
    console.log('Successfully connected to MongoDB Atlas!');
})
    .catch(function (error) {
    console.log('Unable to connect to MongoDB Atlas!');
    console.log('error', error);
});
var bodyParser = require('body-parser');
var responseObject = {};
app.post('/api/shorturl/new', bodyParser.urlencoded({ extended: false }), function (request, response) {
    var inputUrl = request.body['url'];
    console.log(constants_1.default);
    if (!inputUrl.match(constants_1.default)) {
        response.json({ error: 'Invalid URL' });
        return;
    }
    responseObject['original_url'] = inputUrl;
    var inputShort = 1;
    url_1.default.findOne({})
        .sort({ short: 'desc' })
        .exec(function (error, result) {
        if (!error && result != undefined) {
            inputShort = result.short + 1;
        }
        if (!error) {
            url_1.default.findOneAndUpdate({ original: inputUrl }, { original: inputUrl, short: inputShort }, { new: true, upsert: true }, function (error, savedUrl) {
                if (!error) {
                    responseObject['short_url'] = savedUrl.short;
                    response.json(responseObject);
                }
            });
        }
    });
});
// Basic Configuration
var port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(process.cwd() + "/public"));
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});
app.get('/api/shorturl/:input', function (request, response) {
    var input = request.params.input;
    var inputAsNumber = parseInt(input);
    url_1.default.findOne({ short: inputAsNumber }, function (error, result) {
        if (!error && result != undefined) {
            response.redirect(result.original);
        }
        else {
            response.json('URL not Found');
        }
    });
});
app.listen(port, function () {
    console.log("Listening on port " + port);
});
//# sourceMappingURL=server.js.map