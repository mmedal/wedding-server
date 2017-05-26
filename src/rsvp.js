import pool from './db';
import { createAlert, normalizeName } from './utils';

const lookupRsvpByName = (fullName) => {
  return Promise.resolve()
    .then(() => pool.query('select * from guests where $1 = any (invitedGuests);', [normalizeName(fullName)]))
    .then((r) => {
      if (r.rowCount === 0) {
        return null;
      } else {
        return r.rows[0];
      }
    })
    .catch((err) => createAlert('danger', err));
};

const initRsvp = (rsvpRequest, rsvpDetails) => {
  console.log(rsvpDetails);
  // Return the invited guests to the frontend if reservation is found
  if (rsvpRequest.attending) {
    return createAlert('info', 'Now, simply select the guests you would like to RSVP for.',
      {invitedGuests: rsvpDetails.invitedguests});
  } else {
    // Guest is not attending
    return Promise.resolve()
      .then(() => pool.query('update guests set hasrsvped = TRUE where $1 = any (invitedGuests);',
        [normalizeName(rsvpRequest.name)]))
      .then((r) => createAlert('success', 'You have successfully RSVPed. Thank you!'))
      .catch((err) => createAlert('danger', err));
  }
};

const completeRsvp = (rsvpRequest, rsvpDetails) => {
  // Check that guests have been submitted and that all submitted guests are in the guest list
  if (rsvpRequest.attendingGuests.length < 1) return createAlert('danger', 'You must select some guests to RSVP.');
  const guestsAreValid = rsvpRequest.attendingGuests.reduce((valid, guest) => {
    return valid && rsvpDetails.invitedguests.includes(normalizeName(guest));
  }, true);
  if (!guestsAreValid) return createAlert('danger', 'Invalid guest selection.');

  // Mark guests as attending
  return Promise.resolve()
    .then(() => pool.query('update guests set attendingguests = $1::text[], hasrsvped = TRUE where $2 = any (invitedGuests);',
      [rsvpRequest.attendingGuests.map(normalizeName), normalizeName(rsvpRequest.name)]))
    .then((r) => createAlert('success', 'You have successfully RSVPed. See you on the 8th!'))
    .catch((err) => createAlert('danger', err));
};

const rsvper = (rsvpRequest) => {
  return Promise.resolve()
    .then(() => lookupRsvpByName(rsvpRequest.name))
    .then((rsvpDetails) => {
      if (!rsvpDetails) return createAlert('danger', 'No matching reservation was found.');
      if (rsvpDetails.hasrsvped) return createAlert('warning',
        'You have already RSVPed! Please give us a call if you need to make any changes to your response.');
      if (rsvpRequest.hasOwnProperty('attendingGuests')) {
        return completeRsvp(rsvpRequest, rsvpDetails);
      } else {
        return initRsvp(rsvpRequest, rsvpDetails);
      }
    });
};

const validateRsvpRequest = (req, res, next) => {
  if (req.body.hasOwnProperty('name') && req.body.hasOwnProperty('attending')) {
    next();
  } else {
    res.status(400).send(createAlert('danger', 'The reservation request must include all fields.'));
  }
};

export { rsvper, validateRsvpRequest };
