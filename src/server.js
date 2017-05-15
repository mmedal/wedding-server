import 'source-map-support/register';

import bodyParser from 'body-parser';
import express from 'express';

import router from './routes'

// configure app
const app = express();
app.use(bodyParser.json());
app.use(router);
app.use(express.static('static'));
app.set('port', (process.env.PORT || 3000));
app.set('trust proxy', true);

// start server
app.listen(app.get('port'), () => {
  console.log(`server started on port ${app.get('port')}`);
});
