var express = require('express');
const conectarDB = require("./config/connection");
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

var app = express();

app.use(bodyParser.json())
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/api/v1', require('./routes/users.routes.js'));
app.use('/api/v1', require('./routes/artiffacts.routes.js'));
app.use('/api/v1', require('./routes/auth.routes.js'));
app.use('/api/v1', require('./routes/categories.routes.js'));
app.use('/api/v1', require('./routes/competences.routes.js'));
app.use('/api/v1', require('./routes/documents.routes.js'));
app.use('/api/v1', require('./routes/formationPrograms.routes.js'));
app.use('/api/v1', require('./routes/graphsProjectCategory.routes.js'));
app.use('/api/v1', require('./routes/learningResults.routes.js'));
app.use('/api/v1', require('./routes/modules.routes.js'));
app.use('/api/v1', require('./routes/profile.routes.js'));
app.use('/api/v1', require('./routes/projects.routes.js'));
app.use('/api/v1', require('./routes/quarter.routes.js'));
app.use('/api/v1', require('./routes/records.routes.js'));
app.use('/api/v1', require('./routes/thematics.routes.js'));
app.use('/api/v1', require('./routes/trainingCenter.routes.js'));

conectarDB();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


module.exports = app