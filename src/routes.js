import { Router } from 'express';

import pool from './db';

const router = Router();

router.get('/hello', (req, res) => {
  return Promise.resolve()
    .then(() => pool.query('select * from guests where \'Matthew Medal\' = any (invitedGuests)'))
    .then((r) => res.send(r));
});

export default router;
