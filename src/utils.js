const createAlert = (status, message, info) => {
  return { status, message, info };
};

const normalizeName = (string) => {
  const name = string.split(' ');
  return name.map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' ');
};

export { createAlert, normalizeName };
