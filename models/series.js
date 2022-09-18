const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeriesSchema = new Schema({
  brand: { type: String, required: true },
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
      ],
    },
  ],
  descriptiveColors: { type: Map, of: String },
  strings: { type: Number },
  stock: Number,
  type: {
    type: String,
    required: true,
    enum: ['Electric Guitar', 'Electric Bass'],
  },
  fingerboard: { type: String },
  description: { type: String },
  features: { type: String },
  series: { type: String, required: true },
});

SeriesSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/brands/${this.brand}/${this.model}/${this.series}`;
});

module.exports = mongoose.model('Series', SeriesSchema);
