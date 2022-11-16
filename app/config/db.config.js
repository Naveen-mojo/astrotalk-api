// module.exports = {
//   HOST: "localhost",
//   PORT: 27017,
//   DB: "astrotalk"
// };

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://naveen:naveen@cluster0.4zqsizj.mongodb.net/astrotalk', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
}).then(() => {
  console.log("Successfully connect to MongoDB.")
}).catch((error) => {
  console.log("Connection error", error)
})