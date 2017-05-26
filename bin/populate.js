import fs from 'fs';
import parse from 'csv-parse';

import pool from '../src/db';

const invitesFs = fs.createReadStream('./invites.csv');

const inviteParser = parse((err, invitesData) => {
  if (err) console.log(err);
  invitesData.map((invite) => {
    // Invited folks are in column 1 and are comma-delimited like
    // John Cena,Darth Vader
    const names = invite[0].split(',');
    pool.query('insert into guests values ($1::text[], false) on conflict do nothing;', [names])
      .then(() => console.log(`${names} imported to db`))
      .catch((err) => console.log(err));
  });
});

invitesFs.pipe(inviteParser);
