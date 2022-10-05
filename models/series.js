const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeriesSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: String, required: true },
  colors: [
    {
      type: String,
      required: true,
      enum: [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple',
        'white',
        'black',
        'sunburst',
        'silver',
      ],
    },
  ],
  strings: { type: Number },
  stock: { type: Number },
  fingerboard: { type: String },
  description: { type: String },
  features: { type: Array },
  series: { type: String, required: true },
});

module.exports = mongoose.model('Series', SeriesSchema);
