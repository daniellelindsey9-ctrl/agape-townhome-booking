const { getStore } = require('@netlify/database');

// One-time seed: /.netlify/functions/seed
// Populates the properties store with the 4 starter townhomes if it's empty.

const STARTER_PROPERTIES = [
  { name: "The Cedar Townhome", area: "Uptown Dallas", beds: 4, baths: 3, sqft: 2100,
    amenities: ["Full kitchen", "In-unit laundry", "Fenced yard", "Parking x2"], status: "available" },
  { name: "The Magnolia Townhome", area: "Bishop Arts District", beds: 4, baths: 3.5, sqft: 2250,
    amenities: ["Full kitchen", "In-unit laundry", "Rooftop patio", "Smart locks"], status: "available" },
  { name: "The Sycamore Townhome", area: "Lake Highlands", beds: 4, baths: 3, sqft: 1980,
    amenities: ["Full kitchen", "In-unit laundry", "2-car garage", "Home office"], status: "occupied" },
  { name: "The Preston Townhome", area: "Preston Hollow", beds: 4, baths: 3.5, sqft: 2300,
    amenities: ["Full kitchen", "In-unit laundry", "Private patio", "Pet friendly"], status: "available" },
];

exports.handler = async () => {
  const headers = { 'Access-Control-Allow-Origin': '*' };
  try {
    const db = getStore('properties');
    const { blobs } = await db.list();

    if (blobs.length > 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Already seeded, ' + blobs.length + ' properties exist.' }) };
    }

    const created = [];
    for (const p of STARTER_PROPERTIES) {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 7);
      const property = { id, ...p };
      await db.setJSON(id, property);
      created.push(property);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Seeded ' + created.length + ' properties.', created }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
