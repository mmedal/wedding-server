import pg from 'pg';

const config = {
  host: 'localhost',
  port: 5432,
  database: 'wedding-www'
};

const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

export default pool;
