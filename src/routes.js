import { Router } from 'express';

import { rsvper, validateRsvpRequest } from './rsvp';

const router = Router();

// router.use('.rsvp', validateRsvpRequest);

router.get('/rsvp', (req, res) => {
  return Promise.resolve()
    .then(() => rsvper(req.body))
    .then((rsvpResponse) => {
      if (rsvpResponse.status === 'success') {
        res.send(rsvpResponse);
      } else {
        res.status(400).send(rsvpResponse);
      }
    });
});

export default router;
