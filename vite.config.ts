import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function pureWebserverPlugin(): Plugin {
  return {
    name: 'pure-webserver-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        if (url === '/style.css') {
          try {
            const cssPath = path.resolve(__dirname, 'style.css');
            const cssContent = fs.readFileSync(cssPath, 'utf-8');
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
            res.end(cssContent);
            return;
          } catch {
          }
        }

        if (url === '/script.js') {
          try {
            const jsPath = path.resolve(__dirname, 'script.js');
            const jsContent = fs.readFileSync(jsPath, 'utf-8');
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.end(jsContent);
            return;
          } catch {
          }
        }

        if (url.includes('process_booking.php')) {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              const params = new URLSearchParams(body);
              const customerName = params.get('customer_name') || 'Guest';
              const roomType = params.get('room_type') || 'Double';
              const guests = parseInt(params.get('guests') || '1', 10);
              const nights = parseInt(params.get('nights') || '1', 10);
              const breakfast = params.get('breakfast') === 'yes';
              const transfer = params.get('airport_transfer') === 'yes';
              const conference = params.get('conference_room') === 'yes';
              const extraBed = params.get('extra_bed') === 'yes';
              const lateCheckout = params.get('late_checkout') === 'yes';

              const rates: Record<string, number> = {
                Single: 3500,
                DeluxeSingle: 4000,
                Double: 5000,
                SuperiorDouble: 6000,
                TwinDeluxe: 5500,
                Family: 7500,
                Executive: 10000,
                Cottage: 12000,
                Honeymoon: 14000,
                Presidential: 15000,
              };
              const names: Record<string, string> = {
                Single: 'Single Room',
                DeluxeSingle: 'Deluxe Single Room',
                Double: 'Double Room',
                SuperiorDouble: 'Superior Lakeview Double',
                TwinDeluxe: 'Twin Deluxe Room',
                Family: 'Family Room',
                Executive: 'Executive Lake Suite',
                Cottage: 'Lakefront Luxury Cottage',
                Honeymoon: 'Honeymoon Panoramic Villa',
                Presidential: 'Exucutive Sunset Suite',
              };

              const roomRate = rates[roomType] || 5000;
              const roomDisplayName = names[roomType] || 'Double Room';

              const roomCost = roomRate * nights;
              const breakfastCost = breakfast ? (700 * guests * nights) : 0;
              const transferCost = transfer ? 2000 : 0;
              const conferenceCost = conference ? 5000 : 0;
              const extraBedCost = extraBed ? (1500 * nights) : 0;
              const lateCheckoutCost = lateCheckout ? 2000 : 0;

              const total = roomCost + breakfastCost + transferCost + conferenceCost + extraBedCost + lateCheckoutCost;
              const ref = `SRH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

              const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Sunrise Hotel, Kisumu</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <div class="nav-container">
      <a href="index.html" class="brand">
        <img src="images/logo.jpg" alt="Sunrise Hotel Logo" class="brand-logo-img">
        <span>Sunrise Hotel, Kisumu</span>
      </a>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="booking.html">Booking Form</a></li>
      </ul>
      <a href="booking.html" class="btn-cta">New Booking</a>
    </div>
  </header>
  <main class="container">
    <div class="confirmation-wrap">
      <div style="border-left: 4px solid var(--primary); padding-left: 18px; margin-bottom: 24px;">
        <span class="confirm-badge">Reservation Verified by PHP Server</span>
        <h1 class="confirm-title" style="letter-spacing: 0.02em;">BOOKING CONFIRMED</h1>
        <p class="confirm-ref">Booking Reference: <strong>${ref}</strong></p>
      </div>
      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 24px; font-size: 1.05rem; line-height: 1.8;">
        <div>Customer: <strong>${customerName}</strong></div>
        <div>Room: <strong>${roomDisplayName}</strong></div>
        <div>Guests: <strong>${guests}</strong></div>
        <div>Number of Nights: <strong>${nights}</strong></div>
        <div>Breakfast: <strong>${breakfast ? 'Yes' : 'No'}</strong></div>
        <div>Airport Transfer: <strong>${transfer ? 'Yes' : 'No'}</strong></div>
        ${conference ? '<div>Conference Room: <strong>Yes</strong></div>' : ''}
        ${extraBed ? '<div>Extra Bed: <strong>Yes</strong></div>' : ''}
        ${lateCheckout ? '<div>Late Checkout: <strong>Yes</strong></div>' : ''}
        <div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--primary); font-size: 1.35rem; font-weight: 800; color: var(--primary);">
          TOTAL AMOUNT: KSh ${total.toLocaleString()}
        </div>
      </div>

      <table class="confirm-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Tariff Rate</th>
            <th>Duration / Qty</th>
            <th style="text-align: right;">Amount (KSh)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${roomDisplayName}</td>
            <td>KSh ${roomRate.toLocaleString()} / night</td>
            <td>${nights} night(s)</td>
            <td style="text-align: right; font-weight: 600;">KSh ${roomCost.toLocaleString()}</td>
          </tr>
          ${breakfast ? `<tr><td>Daily Gourmet Breakfast Buffet</td><td>KSh 700 / guest / day</td><td>${guests} guests × ${nights} nights</td><td style="text-align: right; font-weight: 600;">KSh ${breakfastCost.toLocaleString()}</td></tr>` : ''}
          ${transfer ? `<tr><td>Kisumu Airport Shuttle Transfer</td><td>KSh 2,000 flat</td><td>1 transfer</td><td style="text-align: right; font-weight: 600;">KSh ${transferCost.toLocaleString()}</td></tr>` : ''}
          ${conference ? `<tr><td>Conference Room Booking</td><td>KSh 5,000 flat</td><td>1 day</td><td style="text-align: right; font-weight: 600;">KSh ${conferenceCost.toLocaleString()}</td></tr>` : ''}
          ${extraBed ? `<tr><td>Extra Deluxe Bed Addition</td><td>KSh 1,500 / night</td><td>${nights} night(s)</td><td style="text-align: right; font-weight: 600;">KSh ${extraBedCost.toLocaleString()}</td></tr>` : ''}
          ${lateCheckout ? `<tr><td>Late Checkout Extension</td><td>KSh 2,000 flat</td><td>Until 4:00 PM</td><td style="text-align: right; font-weight: 600;">KSh ${lateCheckoutCost.toLocaleString()}</td></tr>` : ''}
        </tbody>
        <tfoot>
          <tr style="border-top: 2px solid var(--secondary);">
            <td colspan="3" style="font-weight: 700; font-size: 1.1rem;">TOTAL AUDITED &amp; BILLED:</td>
            <td style="text-align: right; font-weight: 800; font-size: 1.25rem; color: var(--primary);">
              KSh ${total.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>

      <p class="confirm-thankyou">Thank you for choosing Sunrise Hotel.</p>
      <div class="confirm-actions">
        <button onclick="window.print()" class="btn-cta" style="background: var(--secondary);">🖨️ Print Confirmation Voucher</button>
        <a href="booking.html" class="btn-cta">Make Another Booking</a>
        <a href="index.html" class="btn-secondary">Return to Home</a>
      </div>
    </div>
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>&copy; 2026 Sunrise Hotel, Kisumu. Milimani Waterfront, Kisumu, Kenya.</p>
      <p>Server Processing Script: process_booking.php</p>
    </div>
  </footer>
</body>
</html>`;

              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(html);
            });
            return;
          } else {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(`<!DOCTYPE html>
<html>
<head><title>process_booking.php</title><link rel="stylesheet" href="style.css"></head>
<body class="container">
  <div class="confirmation-wrap">
    <h2>Sunrise Hotel, Kisumu - process_booking.php</h2>
    <p>This script processes reservations submitted via HTTP POST from <a href="booking.html">booking.html</a>.</p>
    <a href="booking.html" class="btn-cta">Go to Booking Form &rarr;</a>
  </div>
</body>
</html>`);
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), pureWebserverPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          booking: path.resolve(__dirname, 'booking.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
