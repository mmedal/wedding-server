const bodyParser = require('body-parser');
const express = require('express');

const routes = require('./routes.js');

// configure app
const app = express();
app.use(bodyParser.json());
app.use(routes);
app.use(express.static('static'));
app.set('port', (process.env.PORT || 3000));
app.set('trust proxy', true);

// start server
app.listen(app.get('port'), () => {
  console.log(`server started on port ${app.get('port')}`);
});
