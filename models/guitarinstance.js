const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuitarinstanceSchema = new Schema({
  series: { type: String, required: true },
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
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  serialNum: { type: String, required: true },
  model: { type: String, required: true },
});

GuitarinstanceSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/brands/${this.brand}/${this.model}/${this.series}/${this.serialNum}`;
});

module.exports = mongoose.model('Guitarinstance', GuitarinstanceSchema);
