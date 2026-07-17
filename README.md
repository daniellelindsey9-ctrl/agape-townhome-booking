[README.md](https://github.com/user-attachments/files/30109766/README.md)
# Agape Townhome Booking System

Real booking site backed by Netlify's built-in database. This is stage 1:
properties and bookings persist for real. Stripe payments come next, once
this stage is live and tested.

## What's in here

- `public/index.html` — the whole front-end (guest booking flow + admin view), one file.
- `netlify/functions/properties.js` — list, add, and remove properties (GET / POST / DELETE).
- `netlify/functions/bookings.js` — list and create bookings (GET / POST).
- `netlify/functions/seed.js` — one-time helper to load the 4 starter townhomes into the database.
- `netlify.toml` — tells Netlify where the functions and the public site live.
- `package.json` — pulls in `@netlify/database`, the package the functions need.

## Deploy steps

1. **Create a new GitHub repo** (e.g. `agape-townhome-booking`), and push everything in this
   folder to it — `git init`, `git add .`, `git commit -m "initial booking system"`,
   then push to GitHub as you normally would.

2. **In Netlify**, go to the site already created for this — `agape-townhome-booking.netlify.app`
   (Site settings will show the Site ID `def732ff-699f-4045-825e-2c2b3ceab830` if you need to find it) —
   and connect it to that GitHub repo under **Site settings → Build & deploy → Link repository**.
   Netlify will auto-deploy on every push from here on.

3. **Enable the database extension** if it isn't already: in the Netlify dashboard, go to
   **Extensions**, find **Netlify DB** (or "Database"), and install/enable it for this site.
   This is what makes `@netlify/database` actually have somewhere to write.

4. **Seed the starter properties.** Once deployed, visit:
   `https://agape-townhome-booking.netlify.app/.netlify/functions/seed`
   in your browser once. It loads the 4 starter townhomes (Cedar, Magnolia, Sycamore,
   Preston) into the database. Running it again is safe — it checks if properties
   already exist and skips if so.

5. **Test it.** Open the site, click through a full guest booking (you don't need real
   payment info yet — the payment step is still a placeholder). Then switch to
   **Admin view** at the top and confirm the booking shows up in the Reservations
   table, and that adding/removing a property in Admin actually persists after a
   page refresh.

## What's real vs. still a placeholder

**Real (persists in the database):**
- Property listings — add/remove from Admin actually saves.
- Bookings — completing the guest flow actually writes a booking record.

**Still placeholder (stage 2, once this is confirmed working):**
- Payment step doesn't charge a real card yet — needs a Netlify Function
  that creates a Stripe Payment Intent, using a Stripe secret key stored
  as a Netlify environment variable (never in the front-end code).
- Lease e-signature is a click-to-sign box, not a legally binding signature —
  needs a real e-signature service for anything you'd rely on legally.
- ID upload doesn't save the file anywhere yet — needs Netlify Blob storage
  or similar, with access locked down so only admins can view uploaded IDs.
- Extension/refund logic works in the UI but doesn't yet talk to Stripe's
  refund API for actual money movement.

## Questions to decide before stage 2 (Stripe)

- Is the $150/$220 cleaning fee refundable if a guest cancels before check-in?
- How far in advance can a guest cancel for a full refund vs. partial vs. none?
- Do you want ID review to be manual (you look at each upload) or automated
  (a service like Stripe Identity verifies it)?
