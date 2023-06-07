const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url).then(result => {
  console.log('connected to MongoDB');
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message);
});


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function(v) {
        // formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers
        return /^\d{2,3}-\d{3,}$/.test(v);
        // return /\d{2,3}-\d{3,}/.test(v);
        
      
      },
      // message: props => `${props.value} is not a valid phone number!`
    },
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
})


module.exports = mongoose.model('Person', personSchema);