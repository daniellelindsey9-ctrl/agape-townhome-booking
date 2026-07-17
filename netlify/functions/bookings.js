const { getStore } = require('@netlify/database');

// GET /.netlify/functions/bookings -> list all bookings
// POST /.netlify/functions/bookings -> create a booking

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const db = getStore('bookings');

    if (event.httpMethod === 'GET') {
      const { blobs } = await db.list();
      const bookings = await Promise.all(
        blobs.map(async (b) => JSON.parse(await db.get(b.key)))
      );
      return { statusCode: 200, headers, body: JSON.stringify(bookings) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const id = Date.now().toString();
      const booking = {
        id,
        ...body,
        status: 'pending_payment',
        createdAt: new Date().toISOString()
      };
      await db.setJSON(id, booking);
      return { statusCode: 201, headers, body: JSON.stringify(booking) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
