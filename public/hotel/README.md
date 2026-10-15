# Sunrise Hotel - Online Room Booking and Billing System

## Project Overview
This web application was developed for Sunrise Hotel to replace manual reservations with an automated, responsive booking and billing system.

### Developed Files (Included in ZIP):
1. `index.html`: Hotel landing page with accommodations, tariffs, amenities, and reservation links.
2. `booking.html`: Booking form capturing guest info, occupancy, room selection, and dynamic extras.
3. `process_booking.php`: Server-side processor handling POST submission, validation, independent bill verification, and printing vouchers.
4. `style.css`: Clean, modular stylesheet for the hotel portal.
5. `script.js`: Client-side validation, room capacity warnings, airport transfer dynamic reveal, and real-time bill calculations.
6. `README.md`: System documentation, mark rubric compliance, and local deployment steps.

---

## Local Deployment Instructions (XAMPP / WAMP)

1. **Extract the ZIP file**:
   - **XAMPP (Windows)**: `C:\xampp\htdocs\hotel_booking`
   - **WAMP (Windows)**: `C:\wamp64\www\hotel_booking`
   - **LAMP / Linux / Mac**: `/var/www/html/hotel_booking`

2. **Start the Web Server**:
   - Open **XAMPP Control Panel** or **WAMP Server**.
   - Click **Start** on the **Apache** service.

3. **Open the Application**:
   - Open your browser and navigate to:
     `http://localhost/hotel_booking/index.html`
   - Click "Book Now" or open `http://localhost/hotel_booking/booking.html`.
   - Fill in the form and click "Submit Booking & Process Payment".
   - Apache will execute `process_booking.php` and render the official confirmation voucher!
