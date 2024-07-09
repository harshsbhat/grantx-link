// models/Url.js

import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let Url;
if (mongoose.models.Url) {
  Url = mongoose.model('Url');
} else {
  Url = mongoose.model('Url', UrlSchema);
}

export default Url;
