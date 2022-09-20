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
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  serialNum: { type: String, required: true },
  model: { type: String, required: true },
});

module.exports = mongoose.model('Guitarinstance', GuitarinstanceSchema);
