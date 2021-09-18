import { Request, Response } from 'express';
import express from 'express';
import Url from './models/url';
import URL_REGEX from './utils/constants';
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
//const cors = require('cors');
import cors from 'cors';
//const mongoose = require('mongoose');
import mongoose from 'mongoose';

interface IResponseObject {
  original_url?: string;
  short_url?: number;
}

const app = express();

const uri = process.env.MONGO_DB_URI!;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.log('error', error);
  });

const responseObject: IResponseObject = {};
app.post(
  '/api/shorturl/new',
  bodyParser.urlencoded({ extended: false }),
  async (request: Request, response: Response) => {
    const inputUrl = request.body['url'];

    // 1st check - url valid or not
    if (!inputUrl.match(URL_REGEX)) {
      response.json({ error: 'Invalid URL' });
      return;
    }

    // 2nd check - url already has a short in db or not
    const docs = await Url.find({ original: inputUrl });

    if (docs.length) {
      response.json(
        'This url has already been shortened. Existing short url is: ' +
          docs[0].short
      );
      return;
    }

    responseObject['original_url'] = inputUrl;

    let inputShort = 1;

    Url.findOne({})
      .sort({ short: 'desc' })
      .exec((error, result) => {
        if (!error && result != undefined) {
          inputShort = result.short + 1;
        }
        if (!error) {
          Url.findOneAndUpdate(
            { original: inputUrl },
            { original: inputUrl, short: inputShort },
            { new: true, upsert: true },
            (error, savedUrl) => {
              if (!error) {
                responseObject['short_url'] = savedUrl.short;
                response.json(responseObject);
              }
            }
          );
        }
      });
  }
);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req: Request, res: Response) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:input', (request: Request, response: Response) => {
  const input = request.params.input;
  const inputAsNumber: number = parseInt(input);

  Url.findOne(
    { short: inputAsNumber },
    (error: Error, result: { original: string }) => {
      if (!error && result != undefined) {
        response.redirect(result.original);
      } else {
        response.json('URL not Found');
      }
    }
  );
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
