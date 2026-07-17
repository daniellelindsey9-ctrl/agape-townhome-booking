const { getStore } = require('@netlify/database');

// GET /.netlify/functions/properties -> list all properties
// POST /.netlify/functions/properties -> add a new property
// DELETE /.netlify/functions/properties?id=... -> remove a property

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  try {
    const db = getStore('properties');

    if (event.httpMethod === 'GET') {
      const { blobs } = await db.list();
      const properties = await Promise.all(
        blobs.map(async (b) => JSON.parse(await db.get(b.key)))
      );
      return { statusCode: 200, headers, body: JSON.stringify(properties) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const id = Date.now().toString();
      const property = { id, ...body, status: 'available' };
      await db.setJSON(id, property);
      return { statusCode: 201, headers, body: JSON.stringify(property) };
    }

    if (event.httpMethod === 'DELETE') {
      const id = event.queryStringParameters && event.queryStringParameters.id;
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id' }) };
      }
      await db.delete(id);
      return { statusCode: 200, headers, body: JSON.stringify({ deleted: id }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
