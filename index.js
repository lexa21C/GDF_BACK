const mongoose = require('mongoose');
const app = require('./app.js');

mongoose.set('strictQuery', true);

const PORT = process.env.PORT || 3500;
 app.listen(PORT, (err) => {
    if (err) {
        console.log(`server error: ${err.message}`);
      } else {
        
        console.log(`server is running on port ${PORT}`);
      }
})
