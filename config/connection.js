const  mongoose = require ('mongoose');
require('dotenv').config({path: '.env'});
mongoose.set('strictQuery',true);


const conectarDB =async ()=>{
    console.log("DB_MONGO value:", process.env.DB_MONGO);

    try {
        await mongoose.connect(process.env.DB_MONGO, {

            useNewUrlParser: true,
            useUnifiedTopology:true,
        });

        console.log('mongo ready');

    } catch (error) {
        
        console.log(error);

process.exit(1);
    }
}

module.exports = conectarDB