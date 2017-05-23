import { Router } from 'express';

import { rsvper, validateRsvpRequest } from './rsvp';

const router = Router();

router.use('/rsvp', validateRsvpRequest);

router.post('/rsvp', (req, res) => {
  return Promise.resolve()
    .then(() => rsvper(req.body))
    .then((rsvpResponse) => {
      if (rsvpResponse.status === 'success' || rsvpResponse.status === 'info') {
        res.send(rsvpResponse);
      } else {
        console.log(rsvpResponse);
        res.status(400).send(rsvpResponse);
      }
    });
});

export default router;
