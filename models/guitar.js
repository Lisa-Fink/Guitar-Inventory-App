const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuitarSchema = new Schema({
  brand: [{ type: Schema.Types.ObjectId, ref: 'Brand', required: true }],
  model: { type: String, required: true },
  color: {
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
    ],
  },
  descriptiveColors: { type: Map, of: String },
  strings: { type: Number, required: true },
  stock: Number,
  type: {
    type: String,
    required: true,
    enum: ['Electric Guitar', 'Electric Bass'],
  },
});

GuitarSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/${this.brand}/${this.model}`;
});

module.exports = mongoose.model('Guitar', GuitarSchema);
