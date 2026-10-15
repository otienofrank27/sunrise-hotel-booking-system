import JSZip from 'jszip';

export interface ProjectFile {
  filename: string;
  language: string;
  description: string;
  content: string;
}

export const STANDALONE_FILES: ProjectFile[] = [
  {
    filename: 'index.html',
    language: 'html',
    description: 'Hotel home page with navigation, Lake Victoria hero section, accommodations overview, tariffs, and reservation links.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sunrise Hotel Kisumu - Lake Victoria Luxury Stays & Online Booking</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="header">
    <div class="nav-container">
      <a href="index.html" class="brand">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span>Sunrise Hotel, Kisumu</span>
      </a>

      <ul class="nav-links">
        <li><a href="index.html" class="active">Home</a></li>
        <li><a href="#rooms">Rooms & Rates</a></li>
        <li><a href="#amenities">Services</a></li>
        <li><a href="booking.html">Reserve Room</a></li>
      </ul>

      <a href="booking.html" class="btn-cta">
        Book Room Online &rarr;
      </a>
    </div>
  </header>

  <section class="hero">
    <div class="hero-img-wrap">
      <img src="images/sunrise_hotel_hero.jpg" alt="Sunrise Hotel Resort on Lake Victoria, Kisumu" class="hero-img">
    </div>
    <div class="hero-content">
      <span class="hero-badge">Lake Victoria Waterfront Resort</span>
      <h1 class="hero-title">Tranquil Luxury on the Shores of Lake Victoria, Kisumu</h1>
      <p class="hero-sub">
        Wake up to serene freshwater sunrises, and world-class Kenyan hospitality. Select your room, configure dining and transfers, and receive instant booking confirmation.
      </p>
      <div class="hero-actions">
        <a href="booking.html" class="btn-cta" style="padding: 12px 24px; font-size: 1rem;">
          Reserve Room Online
        </a>
        <a href="#rooms" class="btn-secondary" style="background: rgba(255,255,255,0.92); border: none;">
          View Room Tariffs
        </a>
      </div>
    </div>
  </section>

  <main class="container">

    <section class="amenities-bar" id="amenities">
      <div class="amenity-item">
        <svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        <div>
          <h4 class="amenity-title">Breakfast Buffet</h4>
          <p class="amenity-text">Fresh daily breakfast buffet at KSh 700 per person per day.</p>
        </div>
      </div>

      <div class="amenity-item">
        <svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
        <div>
          <h4 class="amenity-title">Kisumu International Airport</h4>
          <p class="amenity-text">Dedicated pickup and drop-off from Kisumu International Airport (KIS) for KSh 2,000.</p>
        </div>
      </div>

      <div class="amenity-item">
        <svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div>
          <h4 class="amenity-title">Instant Billing Calculator</h4>
          <p class="amenity-text">Calculates total room, breakfast, and transfer costs in real time before booking.</p>
        </div>
      </div>

      <div class="amenity-item">
        <svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <div>
          <h4 class="amenity-title">Verified Hospitality</h4>
          <p class="amenity-text">Scenic lakefront garden, infinity swimming pool, high-speed Wi-Fi, and 24/7 concierge.</p>
        </div>
      </div>
    </section>

    <section id="rooms">
      <div class="section-header">
        <h2 class="section-title">Accommodations & Nightly Rates</h2>
        <p class="section-desc">
          Capacities and tariffs are strictly verified for your comfort. Select your preferred room category to begin your reservation.
        </p>
      </div>

      <div class="room-grid">

        <article class="room-card">
          <div class="room-thumb">
            <img src="images/room_single.jpg" alt="Single Room at Sunrise Hotel Kisumu">
            <span class="room-badge-pill">Max 1 Guest</span>
          </div>
          <div class="room-body">
            <h3 class="room-name">Single Room</h3>
            <div class="room-meta">
              <span>Capacity: 1 Guest</span>
              <span>·</span>
              <span>Work Desk & En-suite Shower</span>
            </div>
            <p class="room-desc">
              Tailored for business executives and solo travelers visiting Kisumu. Features a plush single bed, dedicated ergonomic workstation, and quiet garden courtyard setting.
            </p>
            <div class="room-footer">
              <div>
                <span class="room-rate">KSh 3,500</span>
                <span class="room-rate-unit"> / night</span>
              </div>
              <a href="booking.html" class="btn-cta">Book Single</a>
            </div>
          </div>
        </article>

        <article class="room-card">
          <div class="room-thumb">
            <img src="images/room_double.jpg" alt="Double Room overlooking Lake Victoria at Sunrise Hotel Kisumu">
            <span class="room-badge-pill">Max 2 Guests</span>
          </div>
          <div class="room-body">
            <h3 class="room-name">Double Room</h3>
            <div class="room-meta">
              <span>Capacity: 2 Guests</span>
              <span>·</span>
              <span>Lake Victoria View Balcony</span>
            </div>
            <p class="room-desc">
              Generous room layout featuring an elegant king-size bed, private balcony overlooking Lake Victoria, premium amenities, and complimentary high-speed internet.
            </p>
            <div class="room-footer">
              <div>
                <span class="room-rate">KSh 5,000</span>
                <span class="room-rate-unit"> / night</span>
              </div>
              <a href="booking.html" class="btn-cta">Book Double</a>
            </div>
          </div>
        </article>

        <article class="room-card">
          <div class="room-thumb">
            <img src="images/room_family.jpg" alt="Family Room Suite at Sunrise Hotel Kisumu">
            <span class="room-badge-pill">Max 4 Guests</span>
          </div>
          <div class="room-body">
            <h3 class="room-name">Family Room</h3>
            <div class="room-meta">
              <span>Capacity: 4 Guests</span>
              <span>·</span>
              <span>Multiple Beds & Sunset Lounge</span>
            </div>
            <p class="room-desc">
              Expansive family suite with adjoining master and twin beds, comfortable living seating, dual vanity sinks, and scenic panoramic sunset views over the lake.
            </p>
            <div class="room-footer">
              <div>
                <span class="room-rate">KSh 7,000</span>
                <span class="room-rate-unit"> / night</span>
              </div>
              <a href="booking.html" class="btn-cta">Book Family</a>
            </div>
          </div>
        </article>

      </div>
    </section>

  </main>

  <footer class="footer">
    <div class="footer-inner">
      <div>
        <strong style="color: #ffffff; font-size: 1.15rem;">Sunrise Hotel, Kisumu</strong>
        <p style="margin-top: 4px; color: #cbd5e1;">Milimani Lakefront Promenade, Kisumu, Kenya | Tel: +254 700 123 456</p>
        <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">Email: reservations@sunrisehotel-kisumu.co.ke</p>
      </div>
      <div>
        <p>&copy; 2026 Sunrise Hotel, Kisumu. All Rights Reserved.</p>
        <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">Powered by FrankHoldings</p>
      </div>
    </div>
  </footer>

</body>
</html>`
  },
  {
    filename: 'booking.html',
    language: 'html',
    description: 'Interactive booking form with occupancy controls, room choices, dynamic features, and estimated bill sidebar.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Room Reservation & Billing - Sunrise Hotel, Kisumu</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="header">
    <div class="nav-container">
      <a href="index.html" class="brand">
        <span>Sunrise Hotel, Kisumu</span>
      </a>

      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="index.html#rooms">Rooms & Rates</a></li>
        <li><a href="booking.html" class="active">Reservation Form</a></li>
      </ul>

      <a href="index.html" class="btn-secondary">
        &larr; Back to Home
      </a>
    </div>
  </header>

  <main class="container">
    <div class="section-header">
      <h1 class="section-title">Online Room Reservation & Estimated Billing</h1>
      <p class="section-desc">
        Complete your booking details below. Your bill calculates dynamically in real time and will be independently verified by our server upon submission.
      </p>
    </div>



    <div id="capacity-warning" class="capacity-warning" role="alert"></div>

    <div class="booking-layout">

      <section class="booking-card">
        <form id="booking-form" action="process_booking.php" method="POST" novalidate>

          <input type="hidden" id="client_calculated_total" name="client_calculated_total" value="0">

          <fieldset class="form-fieldset">
            <legend class="fieldset-title">1. Customer Information</legend>

            <div class="form-grid">
              <div class="form-group full-width">
                <label for="customer_name">Customer Full Name <span class="req">*</span></label>
                <input type="text" id="customer_name" name="customer_name" placeholder="e.g., Peter Mwangi" required>
                <span class="error-message" id="name-error"></span>
              </div>

              <div class="form-group">
                <label for="id_passport">National ID / Passport Number <span class="req">*</span></label>
                <input type="text" id="id_passport" name="id_passport" placeholder="e.g., 29482103" required>
                <span class="error-message" id="id-error"></span>
              </div>

              <div class="form-group">
                <label for="email">Email Address <span class="req">*</span></label>
                <input type="email" id="email" name="email" placeholder="e.g., peter@example.com" required>
                <span class="error-message" id="email-error"></span>
              </div>

              <div class="form-group full-width">
                <label for="phone">Phone Number (10 Digits) <span class="req">*</span></label>
                <input type="tel" id="phone" name="phone" placeholder="e.g., 0712345678" maxlength="10" required>
                <span class="helper-text">Must contain exactly 10 digits (e.g. 07xxxxxxxx).</span>
                <span class="error-message" id="phone-error"></span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend class="fieldset-title">2. Stay Dates & Occupancy</legend>

            <div class="form-grid">
              <div class="form-group">
                <label for="checkin_date">Check-in Date <span class="req">*</span></label>
                <input type="date" id="checkin_date" name="checkin_date" required>
                <span class="error-message" id="checkin-error"></span>
              </div>

              <div class="form-group">
                <label for="nights">Number of Nights (1 - 14) <span class="req">*</span></label>
                <input type="number" id="nights" name="nights" min="1" max="14" value="1" required>
                <span class="helper-text">Stay duration between 1 and 14 nights.</span>
                <span class="error-message" id="nights-error"></span>
              </div>

              <div class="form-group full-width">
                <label for="guests">Number of Guests <span class="req">*</span></label>
                <input type="number" id="guests" name="guests" min="1" max="10" value="1" required>
                <span class="helper-text" id="max-guests-info">Maximum capacity updates based on room choice.</span>
                <span class="error-message" id="guests-error"></span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend class="fieldset-title">3. Room Category <span class="req">*</span></legend>

            <div class="radio-group">
              <label class="option-box">
                <input type="radio" name="room_type" value="Single" required>
                <div class="option-label">
                  <span class="option-title">Single Room</span>
                  <span class="option-sub">Max capacity: 1 Guest · Ergonomic desk & en-suite shower</span>
                </div>
                <span class="option-rate">KSh 3,500 / night</span>
              </label>

              <label class="option-box selected">
                <input type="radio" name="room_type" value="Double" checked required>
                <div class="option-label">
                  <span class="option-title">Double Room</span>
                  <span class="option-sub">Max capacity: 2 Guests · King bed & Lake Victoria view balcony</span>
                </div>
                <span class="option-rate">KSh 5,000 / night</span>
              </label>

              <label class="option-box">
                <input type="radio" name="room_type" value="Family" required>
                <div class="option-label">
                  <span class="option-title">Family Room</span>
                  <span class="option-sub">Max capacity: 4 Guests · Master & twin beds, sunset lounge</span>
                </div>
                <span class="option-rate">KSh 7,500 / night</span>
              </label>
            </div>
            <span class="error-message" id="room-error"></span>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend class="fieldset-title">4. Additional Services & Upgrades</legend>

            <div class="checkbox-group">
              <label class="option-box">
                <input type="checkbox" id="breakfast" name="breakfast" value="yes">
                <div class="option-label">
                  <span class="option-title">Daily Gourmet Breakfast Buffet</span>
                  <span class="option-sub">KSh 700 per person per day (Guests &times; Nights &times; 700)</span>
                </div>
                <span class="option-rate">+ KSh 700 / pers / day</span>
              </label>

              <label class="option-box">
                <input type="checkbox" id="airport_transfer" name="airport_transfer" value="yes">
                <div class="option-label">
                  <span class="option-title">Kisumu Airport Shuttle Transfer</span>
                  <span class="option-sub">Private vehicle transfer to/from Kisumu International Airport (KIS)</span>
                </div>
                <span class="option-rate">+ KSh 2,000 flat</span>
              </label>

              <div id="airport-details-box">
                <div class="form-grid">
                  <div class="form-group">
                    <label for="flight_number">Flight Number / Airline Carrier</label>
                    <input type="text" id="flight_number" name="flight_number" placeholder="e.g., KQ 654 or 748 Air Services">
                    <span class="error-message" id="flight-error"></span>
                  </div>
                  <div class="form-group">
                    <label for="pickup_time">Estimated Arrival / Pickup Time</label>
                    <input type="time" id="pickup_time" name="pickup_time">
                  </div>
                </div>
              </div>

              <div style="margin-top: 10px; border-top: 1px dashed var(--border); padding-top: 12px;">
                <label style="display:block; margin-bottom: 8px; color: var(--secondary); font-weight:700;">
                  Exclusive Stay Enhancements:
                </label>

                <label class="option-box" style="margin-bottom: 8px;">
                  <input type="checkbox" id="conference_room" name="conference_room" value="yes">
                  <div class="option-label">
                    <span class="option-title">Conference Room Booking</span>
                    <span class="option-sub">Full-day access to executive AV-equipped boardroom overlooking Lake Victoria</span>
                  </div>
                  <span class="option-rate">+ KSh 5,000 flat</span>
                </label>

                <label class="option-box" style="margin-bottom: 8px;">
                  <input type="checkbox" id="extra_bed" name="extra_bed" value="yes">
                  <div class="option-label">
                    <span class="option-title">Extra Deluxe Bed Addition</span>
                    <span class="option-sub">KSh 1,500 per night for an additional rollaway bed</span>
                  </div>
                  <span class="option-rate">+ KSh 1,500 / night</span>
                </label>

                <label class="option-box">
                  <input type="checkbox" id="late_checkout" name="late_checkout" value="yes">
                  <div class="option-label">
                    <span class="option-title">Late Checkout Extension</span>
                    <span class="option-sub">Guaranteed room access and resort amenities extended until 4:00 PM</span>
                  </div>
                  <span class="option-rate">+ KSh 2,000 flat</span>
                </label>
              </div>

            </div>
          </fieldset>

          <button type="submit" class="btn-submit" id="submit-btn">
            Submit Booking & Process Payment &rarr;
          </button>
        </form>
      </section>

      <aside class="bill-card" aria-live="polite">
        <h2 class="bill-title">Estimated Booking Bill</h2>
        <p class="helper-text" style="margin-bottom: 14px;">Calculated automatically using JavaScript as options change.</p>

        <div class="summary-pill">
          <div class="summary-pill-row">
            <span>Room Type:</span>
            <strong id="summary-room-type">Double Room</strong>
          </div>
          <div class="summary-pill-row">
            <span>Duration:</span>
            <strong id="summary-nights">1 Night</strong>
          </div>
          <div class="summary-pill-row">
            <span>Occupancy:</span>
            <strong id="summary-guests">1 Guest</strong>
          </div>
        </div>

        <div class="bill-item-row">
          <div>
            <span class="bill-item-label">Room Cost</span>
            <span class="bill-item-sub">Rate &times; Nights</span>
          </div>
          <span class="bill-item-value" id="bill-room-cost">KSh 5,000</span>
        </div>

        <div class="bill-item-row">
          <div>
            <span class="bill-item-label">Breakfast Cost</span>
            <span class="bill-item-sub">KSh 700 &times; Guests &times; Nights</span>
          </div>
          <span class="bill-item-value" id="bill-breakfast-cost">KSh 0</span>
        </div>

        <div class="bill-item-row">
          <div>
            <span class="bill-item-label">Airport Transfer</span>
            <span class="bill-item-sub">Flat shuttle charge</span>
          </div>
          <span class="bill-item-value" id="bill-transfer-cost">KSh 0</span>
        </div>

        <div class="bill-item-row">
          <div>
            <span class="bill-item-label">Additional Add-ons</span>
            <span class="bill-item-sub">Conference / Extra Bed / Late Checkout</span>
          </div>
          <span class="bill-item-value" id="bill-extra-cost">KSh 0</span>
        </div>

        <div class="bill-total-row">
          <span class="bill-total-label">TOTAL ESTIMATED:</span>
          <span class="bill-total-value" id="bill-total-cost">KSh 5,000</span>
        </div>

        <p class="helper-text" style="margin-top: 14px; font-size: 0.78rem;">
          * Rates are inclusive of statutory levies. Server (<code>process_booking.php</code>) independently verifies all charges upon submission.
        </p>
      </aside>

    </div>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p>&copy; 2026 Sunrise Hotel, Kisumu. Milimani Waterfront, Kisumu, Kenya.</p>
      <p>Powered by HTML, CSS, JavaScript, and PHP</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`
  },
  {
    filename: 'process_booking.php',
    language: 'php',
    description: 'PHP server processor: validates POST inputs, independently recalculates tariffs, audits client total, and prints confirmed voucher.',
    content: `<?php
/**
 * =======================================================================
 * Sunrise Hotel, Kisumu - Room Booking and Billing System
 * Server-Side Processing Script (process_booking.php)
 * Task 6: Server-side validation, independent calculation & confirmation
 * =======================================================================
 */

$ROOM_CONFIG = [
    'Single' => ['rate' => 3500, 'max_guests' => 1, 'name' => 'Single Room'],
    'Double' => ['rate' => 5000, 'max_guests' => 2, 'name' => 'Double Room'],
    'Family' => ['rate' => 7500, 'max_guests' => 4, 'name' => 'Family Room'],
    'Executive' => ['rate' => 10000, 'max_guests' => 3, 'name' => 'Executive Room']
];

$BREAKFAST_RATE_PER_PERSON_DAY = 700;
$AIRPORT_TRANSFER_FEE = 2000;

$EXTRA_BED_RATE_PER_NIGHT = 1500;   // Requirement 7
$CONFERENCE_ROOM_FEE = 5000;        // Requirement 8
$LATE_CHECKOUT_FEE = 2000;          // Requirement 9

$errors = [];
$booking_confirmed = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $customer_name = isset($_POST['customer_name']) ? trim(strip_tags($_POST['customer_name'])) : '';
    $id_passport   = isset($_POST['id_passport']) ? trim(strip_tags($_POST['id_passport'])) : '';
    $email         = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone         = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $checkin_date  = isset($_POST['checkin_date']) ? trim($_POST['checkin_date']) : '';
    $nights        = isset($_POST['nights']) ? intval($_POST['nights']) : 0;
    $guests        = isset($_POST['guests']) ? intval($_POST['guests']) : 0;
    $room_type     = isset($_POST['room_type']) ? trim($_POST['room_type']) : '';
    
    $has_breakfast        = (isset($_POST['breakfast']) && $_POST['breakfast'] === 'yes');
    $has_transfer         = (isset($_POST['airport_transfer']) && $_POST['airport_transfer'] === 'yes');
    
    $has_extra_bed        = (isset($_POST['extra_bed']) && $_POST['extra_bed'] === 'yes');
    $has_conference       = (isset($_POST['conference_room']) && $_POST['conference_room'] === 'yes');
    $has_late_checkout    = (isset($_POST['late_checkout']) && $_POST['late_checkout'] === 'yes');

    $client_total = isset($_POST['client_calculated_total']) ? floatval($_POST['client_calculated_total']) : 0;

    // Server-side Validation
    if (empty($customer_name)) {
        $errors[] = "Customer full name is required and cannot be empty.";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "A valid email address is required (e.g., guest@example.com).";
    }

    $clean_phone = preg_replace('/\\D/', '', $phone);
    if (strlen($clean_phone) !== 10) {
        $errors[] = "Phone number must contain exactly 10 digits (e.g., 0712345678).";
    }

    if ($nights < 1 || $nights > 14) {
        $errors[] = "Number of nights must be between 1 and 14.";
    }

    if ($guests <= 0) {
        $errors[] = "Number of guests must be greater than zero.";
    }

    if (empty($room_type) || !array_key_exists($room_type, $ROOM_CONFIG)) {
        $errors[] = "Please select a valid room type (Single, Double, or Family).";
    } else {
        $max_allowed = $ROOM_CONFIG[$room_type]['max_guests'];
        if ($guests > $max_allowed) {
            $errors[] = "Selected {$ROOM_CONFIG[$room_type]['name']} accommodates a maximum of {$max_allowed} guests, but {$guests} were requested.";
        }
    }

    if (empty($checkin_date)) {
        $errors[] = "Check-in date is required.";
    }

    // Independent Server-Side Bill Calculation (Task 6)
    if (empty($errors)) {
        $room_rate = $ROOM_CONFIG[$room_type]['rate'];
        $room_display_name = $ROOM_CONFIG[$room_type]['name'];

        $server_room_cost = $room_rate * $nights;
        $server_breakfast_cost = $has_breakfast ? ($BREAKFAST_RATE_PER_PERSON_DAY * $guests * $nights) : 0;
        $server_transfer_cost = $has_transfer ? $AIRPORT_TRANSFER_FEE : 0;

        $server_extra_bed_cost     = $has_extra_bed ? ($EXTRA_BED_RATE_PER_NIGHT * $nights) : 0;
        $server_conference_cost    = $has_conference ? $CONFERENCE_ROOM_FEE : 0;
        $server_late_checkout_cost = $has_late_checkout ? $LATE_CHECKOUT_FEE : 0;

        $server_total_amount = $server_room_cost + $server_breakfast_cost + $server_transfer_cost 
                             + $server_extra_bed_cost + $server_conference_cost + $server_late_checkout_cost;

        $booking_confirmed = true;
        $booking_ref = "SRH-" . date("Ymd") . "-" . strtoupper(substr(md5($customer_name . time()), 0, 5));
    }

} else {
    $errors[] = "Invalid request method. Please submit your reservation through booking.html.";
}
?>
<!DOCTYPE html>
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

      <?php if ($booking_confirmed): ?>
        
        <!-- REQUIRED EXACT CONFIRMATION OUTPUT (TASK 6) -->
        <div style="border-left: 4px solid var(--primary); padding-left: 18px; margin-bottom: 24px;">
          <span class="confirm-badge">Reservation Verified by PHP Server</span>
          <h1 class="confirm-title" style="letter-spacing: 0.02em;">BOOKING CONFIRMED</h1>
          <p class="confirm-ref">Booking Reference: <strong><?= htmlspecialchars($booking_ref) ?></strong></p>
        </div>

        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 24px; font-size: 1.05rem; line-height: 1.8;">
          <div>Customer: <strong><?= htmlspecialchars($customer_name) ?></strong></div>
          <div>Room: <strong><?= htmlspecialchars($room_display_name) ?></strong></div>
          <div>Guests: <strong><?= intval($guests) ?></strong></div>
          <div>Number of Nights: <strong><?= intval($nights) ?></strong></div>
          <div>Breakfast: <strong><?= $has_breakfast ? 'Yes' : 'No' ?></strong></div>
          <div>Airport Transfer: <strong><?= $has_transfer ? 'Yes' : 'No' ?></strong></div>
          <?php if ($has_conference): ?>
            <div>Conference Room: <strong>Yes</strong></div>
          <?php endif; ?>
          <?php if ($has_extra_bed): ?>
            <div>Extra Bed: <strong>Yes</strong></div>
          <?php endif; ?>
          <?php if ($has_late_checkout): ?>
            <div>Late Checkout: <strong>Yes</strong></div>
          <?php endif; ?>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--primary); font-size: 1.35rem; font-weight: 800; color: var(--primary);">
            TOTAL AMOUNT: KSh <?= number_format($server_total_amount) ?>
          </div>
        </div>

        <p class="confirm-thankyou">Thank you for choosing Sunrise Hotel.</p>

        <div class="confirm-actions">
          <button onclick="window.print()" class="btn-cta" style="background: var(--secondary);">
            🖨️ Print Confirmation Voucher
          </button>
          <a href="booking.html" class="btn-cta">Make Another Booking</a>
          <a href="index.html" class="btn-secondary">Return to Home</a>
        </div>

      <?php else: ?>

        <div style="border-left: 4px solid var(--danger); padding-left: 18px; margin-bottom: 24px;">
          <h1 class="confirm-title" style="color: var(--danger);">Booking Could Not Be Processed</h1>
          <p class="confirm-ref">Please review the server validation errors below:</p>
        </div>

        <ul style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 18px 24px; color: var(--danger); margin-bottom: 24px;">
          <?php foreach ($errors as $error): ?>
            <li style="margin-bottom: 6px;"><?= htmlspecialchars($error) ?></li>
          <?php endforeach; ?>
        </ul>

        <div class="confirm-actions">
          <button onclick="window.history.back()" class="btn-cta">
            &larr; Return to Form and Correct Errors
          </button>
        </div>

      <?php endif; ?>

    </div>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p>&copy; 2026 Sunrise Hotel, Kisumu. Milimani Waterfront, Kisumu, Kenya.</p>
    </div>
  </footer>

</body>
</html>`
  },
  {
    filename: 'style.css',
    language: 'css',
    description: 'Clean responsive stylesheet for all hotel pages, vouchers, and printing styles.',
    content: `/* Sunrise Hotel, Kisumu - style.css */
:root {
  --primary: #c27803;
  --primary-hover: #9e6002;
  --primary-light: #fef7ec;
  --secondary: #1e293b;
  --secondary-light: #334155;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --border: #e2e8f0;
  --success: #15803d;
  --danger: #b91c1c;
  --radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: var(--text-main);
  background-color: var(--bg-main);
  line-height: 1.6;
}
.header { background: #ffffff; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
.nav-container { max-width: 1200px; margin: 0 auto; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
.brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--secondary); font-weight: 700; font-size: 1.25rem; }
.nav-links { display: flex; list-style: none; gap: 24px; }
.nav-links a { text-decoration: none; color: var(--secondary-light); font-weight: 500; }
.nav-links a.active, .nav-links a:hover { color: var(--primary); }
.btn-cta { background: var(--primary); color: #fff; padding: 8px 18px; border-radius: var(--radius); text-decoration: none; font-weight: 600; border: none; cursor: pointer; }
.btn-cta:hover { background: var(--primary-hover); }
.container { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
.booking-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; }
@media (max-width: 900px) { .booking-layout { grid-template-columns: 1fr; } }
.booking-card, .bill-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }
.form-fieldset { border: none; margin-bottom: 24px; }
.fieldset-title { font-size: 1.1rem; font-weight: 700; color: var(--secondary); margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.form-group.full-width { grid-column: 1 / -1; }
input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], select {
  width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius); outline: none;
}
input.is-invalid { border-color: var(--danger) !important; background: #fff5f5; }
.error-message { color: var(--danger); font-size: 0.8rem; min-height: 16px; font-weight: 500; }
.option-box { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 10px; cursor: pointer; }
.option-box.selected { border-color: var(--primary); background: var(--primary-light); }
.capacity-warning { display: none; background: #fee2e2; border: 1px solid #fecaca; color: var(--danger); padding: 12px; border-radius: var(--radius); margin-bottom: 16px; font-weight: 600; }
#airport-details-box { display: none; background: #f8fafc; border: 1px solid var(--border); padding: 14px; border-radius: var(--radius); margin-top: 10px; }
.bill-item-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border); }
.bill-total-row { display: flex; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 2px solid var(--secondary); font-size: 1.3rem; font-weight: 800; color: var(--primary); }
.footer { background: var(--secondary); color: #94a3b8; padding: 32px 24px; margin-top: 48px; }
`
  },
  {
    filename: 'script.js',
    language: 'javascript',
    description: 'JavaScript logic for Tasks 2, 3, 4, 5: validation, dynamic capacity checking, airport transfer reveal, and bill calculation.',
    content: `/**
 * Sunrise Hotel, Kisumu - Client-Side Logic (script.js)
 * Tasks 2, 3, 4, 5
 */
const ROOM_DATA = {
  Single: { rate: 3500, maxGuests: 1, name: "Single Room" },
  Double: { rate: 5000, maxGuests: 2, name: "Double Room" },
  Family: { rate: 7500, maxGuests: 4, name: "Family Room" }
};
const BREAKFAST_RATE = 700;
const TRANSFER_RATE = 2000;

function checkRoomCapacity() {
  const roomTypeInput = document.querySelector('input[name="room_type"]:checked');
  const guestsInput = document.getElementById('guests');
  const warningBox = document.getElementById('capacity-warning');
  const maxGuestsBadge = document.getElementById('max-guests-info');

  if (!roomTypeInput || !guestsInput) return true;
  const config = ROOM_DATA[roomTypeInput.value];
  const guests = parseInt(guestsInput.value, 10) || 0;

  if (maxGuestsBadge && config) {
    maxGuestsBadge.textContent = "Max Capacity: " + config.maxGuests + (config.maxGuests === 1 ? " Guest" : " Guests");
  }

  if (config && guests > config.maxGuests) {
    if (warningBox) {
      warningBox.style.display = 'block';
      warningBox.innerHTML = "⚠️ <strong>Capacity Exceeded:</strong> A " + config.name + " holds at most " + config.maxGuests + " guests. You requested " + guests + ".";
    }
    return false;
  } else {
    if (warningBox) warningBox.style.display = 'none';
    return true;
  }
}

function calculateBill() {
  const roomTypeInput = document.querySelector('input[name="room_type"]:checked');
  const nights = Math.max(0, parseInt(document.getElementById('nights')?.value || 0, 10));
  const guests = Math.max(0, parseInt(document.getElementById('guests')?.value || 0, 10));
  const hasBreakfast = document.getElementById('breakfast')?.checked;
  const hasTransfer = document.getElementById('airport_transfer')?.checked;
  const hasConference = document.getElementById('conference_room')?.checked;
  const hasExtraBed = document.getElementById('extra_bed')?.checked;
  const hasLateCheckout = document.getElementById('late_checkout')?.checked;

  const roomConfig = roomTypeInput ? ROOM_DATA[roomTypeInput.value] : null;
  const roomCost = roomConfig ? (roomConfig.rate * nights) : 0;
  const breakfastCost = (hasBreakfast && guests > 0 && nights > 0) ? (BREAKFAST_RATE * guests * nights) : 0;
  const transferCost = hasTransfer ? TRANSFER_RATE : 0;
  
  let extraCost = 0;
  if (hasConference) extraCost += 5000;
  if (hasExtraBed) extraCost += (1500 * nights);
  if (hasLateCheckout) extraCost += 2000;

  const total = roomCost + breakfastCost + transferCost + extraCost;

  document.getElementById('bill-room-cost').textContent = "KSh " + roomCost.toLocaleString();
  document.getElementById('bill-breakfast-cost').textContent = "KSh " + breakfastCost.toLocaleString();
  document.getElementById('bill-transfer-cost').textContent = "KSh " + transferCost.toLocaleString();
  document.getElementById('bill-extra-cost').textContent = "KSh " + extraCost.toLocaleString();
  document.getElementById('bill-total-cost').textContent = "KSh " + total.toLocaleString();
  
  const hiddenTotal = document.getElementById('client_calculated_total');
  if (hiddenTotal) hiddenTotal.value = total;

  return total;
}

function validateBooking(e) {
  let valid = true;
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

  const name = document.getElementById('customer_name');
  if (!name || name.value.trim() === '') {
    document.getElementById('name-error').textContent = 'Customer name is required.';
    name?.classList.add('is-invalid');
    valid = false;
  }

  const email = document.getElementById('email');
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!email || !emailRegex.test(email.value.trim())) {
    document.getElementById('email-error').textContent = 'Valid email is required.';
    email?.classList.add('is-invalid');
    valid = false;
  }

  const phone = document.getElementById('phone');
  const phoneClean = phone ? phone.value.replace(/\\D/g, '') : '';
  if (!phone || phoneClean.length !== 10) {
    document.getElementById('phone-error').textContent = 'Phone number must contain exactly 10 digits.';
    phone?.classList.add('is-invalid');
    valid = false;
  }

  const nights = parseInt(document.getElementById('nights')?.value || 0, 10);
  if (isNaN(nights) || nights < 1 || nights > 14) {
    document.getElementById('nights-error').textContent = 'Nights must be between 1 and 14.';
    document.getElementById('nights')?.classList.add('is-invalid');
    valid = false;
  }

  const guests = parseInt(document.getElementById('guests')?.value || 0, 10);
  if (isNaN(guests) || guests <= 0) {
    document.getElementById('guests-error').textContent = 'Guests must be greater than zero.';
    document.getElementById('guests')?.classList.add('is-invalid');
    valid = false;
  }

  const roomSelected = document.querySelector('input[name="room_type"]:checked');
  if (!roomSelected) {
    document.getElementById('room-error').textContent = 'Please select a room type.';
    valid = false;
  }

  if (!checkRoomCapacity()) valid = false;

  if (!valid && e) {
    e.preventDefault();
  }
  return valid;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('booking-form')?.addEventListener('submit', validateBooking);

  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', () => {
      const transferBox = document.getElementById('airport-details-box');
      if (transferBox && input.id === 'airport_transfer') {
        transferBox.style.display = input.checked ? 'block' : 'none';
      }
      checkRoomCapacity();
      calculateBill();
    });
    input.addEventListener('input', () => {
      checkRoomCapacity();
      calculateBill();
    });
  });

  checkRoomCapacity();
  calculateBill();
});`
  },
  {
    filename: 'README.md',
    language: 'markdown',
    description: 'Documentation and local deployment instructions for XAMPP / WAMP.',
    content: `# Sunrise Hotel, Kisumu - Online Room Booking & Billing System

## Location
Situated along the waterfront of Lake Victoria, Milimani, Kisumu, Kenya.

## Local Deployment Instructions (XAMPP / WAMP)
1. Extract this ZIP archive into your local server root:
   - XAMPP: C:\\\\xampp\\\\htdocs\\\\hotel_booking
   - WAMP: C:\\\\wamp64\\\\www\\\\hotel_booking
2. Start Apache via XAMPP/WAMP Control Panel.
3. Open your browser at: http://localhost/hotel_booking/index.html
4. Navigate to booking.html to test reservations and verify POST processing on process_booking.php.
`
  }
];

export async function generateProjectZip(admissionNumber: string = 'CT100_G_24398_24'): Promise<Blob> {
  const zip = new JSZip();
  const folderName = `${admissionNumber}_HotelRoomBooking`;
  const folder = zip.folder(folderName) || zip;

  for (const file of STANDALONE_FILES) {
    folder.file(file.filename, file.content);
  }

  try {
    const imagesToInclude = [
      { name: 'logo.jpg', url: '/images/logo.jpg' },
      { name: 'sunrise_hotel_hero.jpg', url: '/images/sunrise_hotel_hero.jpg' },
      { name: 'room_single.jpg', url: '/images/room_single.jpg' },
      { name: 'room_deluxe_single.jpg', url: '/images/room_deluxe_single.jpg' },
      { name: 'room_double.jpg', url: '/images/room_double.jpg' },
      { name: 'room_superior_double.jpg', url: '/images/room_superior_double.jpg' },
      { name: 'room_twin_deluxe.jpg', url: '/images/room_twin_deluxe.jpg' },
      { name: 'room_family.jpg', url: '/images/room_family.jpg' },
      { name: 'room_executive.jpg', url: '/images/room_executive.jpg' },
      { name: 'room_lakefront_cottage.jpg', url: '/images/room_lakefront_cottage.jpg' },
      { name: 'room_honeymoon_villa.jpg', url: '/images/room_honeymoon_villa.jpg' },
      { name: 'room_presidential.jpg', url: '/images/room_executive.jpg' }
    ];

    const imgFolder = folder.folder('images');
    if (imgFolder) {
      for (const img of imagesToInclude) {
        try {
          const res = await fetch(img.url);
          if (res.ok) {
            const blob = await res.blob();
            imgFolder.file(img.name, blob);
          }
        } catch {
        }
      }
    }
  } catch (err) {
    console.warn('Could not bundle binary images into ZIP:', err);
  }

  return await zip.generateAsync({ type: 'blob' });
}
