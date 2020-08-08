const express = require('express');
const app = express();

const Routes = require('./routes');
const bodyParser = require('body-parser');

const WWW = './src/pages';
const PORT = process.env.PORT || 8072;

app.use(express.static(WWW));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(Routes);

app.listen(PORT, () => 
    console.log(`Listening on port: ${ PORT }`)
);
