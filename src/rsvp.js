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
    });
};

const initRsvp = (rsvpRequest, rsvpDetails) => {
  // Return the invited guests to the frontend
  if (rsvpRequest.attending) {
    return createAlert('success', 'A matching reservation has been found.',
      { invitedGuests: rsvpDetails.invitedguests });
  } else {
    // TODO mark as not attending
    return createAlert('success', 'You have successfully RSVPed. Thank you!');
  }
  return rsvpDetails;
  return createAlert('success', 'A matching reservation has been found.',
    { invitedGuests: rsvpDetails.invitedguests });
};

const completeRsvp = (rsvpRequest, rsvpDetails) => {
  return Promise.resolve()
    .then(() => lookupRsvpByName('matthew meDal'))
    .then((rsvpDetails) => {
      if (!rsvpDetails) return createAlert('danger', 'No matching reservation was found.');
      // do the actual rsvping now based on attending
      return rsvpDetails;
    });
};

const rsvper = (rsvpRequest) => {
  return Promise.resolve()
    .then(() => lookupRsvpByName('matthew medal'))
    .then((rsvpDetails) => {
      if (!rsvpDetails) return createAlert('danger', 'No matching reservation was found.');
      if (rsvpDetails.hasrsvped) return createAlert('info', 'You have already RSVPed! Please give us a call if you need to make changes to your RSVP.')
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
    res.status(400).send({
      'msg': 'Request does not include the minimum required fields.'
    });
  }
};

export { rsvper, validateRsvpRequest };
