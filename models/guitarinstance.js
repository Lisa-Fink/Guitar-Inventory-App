const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuitarinstanceSchema = new Schema({
  guitar: { type: Schema.Types.ObjectId, ref: 'Guitar', required: true },
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
  serialNum: { type: Number, required: true },
});

GuitarinstanceSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/${this.brand}/view/${this.serialNum}`;
});

module.exports = mongoose.model('Guitarinstance', GuitarinstanceSchema);
