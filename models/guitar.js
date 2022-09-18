const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuitarSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  stock: Number,
  type: {
    type: String,
    required: true,
    enum: ['Electric Guitar', 'Electric Bass'],
  },
});

GuitarSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/brands/${this.brand}/${this.model}`;
});

module.exports = mongoose.model('Guitar', GuitarSchema);
