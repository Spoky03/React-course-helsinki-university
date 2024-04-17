const mongoose = require('mongoose')


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    minlength: 3
  },
  number: {
    type: String,
    required: false,
    validate: {
      validator: function(value) {
        return /^\d{6}$/.test(value);
      },
      message: 'Number must be a 6-digit string'
    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)