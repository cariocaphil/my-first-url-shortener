// https://stackoverflow.com/questions/34482136/mongoose-the-typescript-way

import * as mongoose from 'mongoose';

export interface IUrl extends mongoose.Document {
  original: string;
  short: number;
}

export const UrlSchema = new mongoose.Schema({
  original: { type: String, required: true },
  short: Number,
});

const Url = mongoose.model<IUrl>('Url', UrlSchema);
export default Url;

// let urlSchema = new mongoose.Schema({
//   original : {type: String, required: true},
//   short: Number
// })

// let Url = mongoose.model('Url', urlSchema);
