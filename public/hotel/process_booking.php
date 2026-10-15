<?php

$ROOM_CONFIG = [
    'Single' => ['rate' => 3500, 'max_guests' => 1, 'name' => 'Single Room'],
    'DeluxeSingle' => ['rate' => 4200, 'max_guests' => 1, 'name' => 'Deluxe Single Room'],
    'Double' => ['rate' => 5000, 'max_guests' => 2, 'name' => 'Double Room'],
    'SuperiorDouble' => ['rate' => 6200, 'max_guests' => 2, 'name' => 'Superior Lakeview Double'],
    'TwinDeluxe' => ['rate' => 5800, 'max_guests' => 2, 'name' => 'Twin Deluxe Room'],
    'Family' => ['rate' => 7500, 'max_guests' => 4, 'name' => 'Family Room'],
    'Executive' => ['rate' => 10000, 'max_guests' => 3, 'name' => 'Executive Lake Suite'],
    'Cottage' => ['rate' => 12500, 'max_guests' => 3, 'name' => 'Lakefront Luxury Cottage'],
    'Honeymoon' => ['rate' => 14000, 'max_guests' => 2, 'name' => 'Honeymoon Panoramic Villa'],
    'Presidential' => ['rate' => 16000, 'max_guests' => 4, 'name' => 'Presidential Sunset Suite']
];

$BREAKFAST_RATE_PER_PERSON_DAY = 700;
$AIRPORT_TRANSFER_FEE = 2000;

$EXTRA_BED_RATE_PER_NIGHT = 1500;
$CONFERENCE_ROOM_FEE = 5000;
$LATE_CHECKOUT_FEE = 2000;

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
    $flight_number        = isset($_POST['flight_number']) ? trim(strip_tags($_POST['flight_number'])) : '';
    $pickup_time          = isset($_POST['pickup_time']) ? trim(strip_tags($_POST['pickup_time'])) : '';
    
    $has_extra_bed        = (isset($_POST['extra_bed']) && $_POST['extra_bed'] === 'yes');
    $has_conference       = (isset($_POST['conference_room']) && $_POST['conference_room'] === 'yes');
    $has_late_checkout    = (isset($_POST['late_checkout']) && $_POST['late_checkout'] === 'yes');

    $client_total = isset($_POST['client_calculated_total']) ? floatval($_POST['client_calculated_total']) : 0;

    if (empty($customer_name)) {
        $errors[] = "Customer full name is required and cannot be empty.";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "A valid email address is required (e.g., guest@example.com).";
    }

    $clean_phone = preg_replace('/\D/', '', $phone);
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

    if (empty($errors)) {
        $room_rate = $ROOM_CONFIG[$room_type]['rate'];
        $room_display_name = $ROOM_CONFIG[$room_type]['name'];

        $server_room_cost = $room_rate * $nights;

        $server_breakfast_cost = $has_breakfast ? ($BREAKFAST_RATE_PER_PERSON_DAY * $guests * $nights) : 0;

        $server_transfer_cost = $has_transfer ? $AIRPORT_TRANSFER_FEE : 0;

        $server_extra_bed_cost     = $has_extra_bed ? ($EXTRA_BED_RATE_PER_NIGHT * $nights) : 0;
        $server_conference_cost    = $has_conference ? $CONFERENCE_ROOM_FEE : 0;
        $server_late_checkout_cost = $has_late_checkout ? $LATE_CHECKOUT_FEE : 0;
        
        $server_add_ons_total = $server_extra_bed_cost + $server_conference_cost + $server_late_checkout_cost;

        $server_total_amount = $server_room_cost + $server_breakfast_cost + $server_transfer_cost + $server_add_ons_total;

        $booking_confirmed = true;
        $booking_ref = "SRH-" . date("Ymd") . "-" . strtoupper(substr(md5($customer_name . time()), 0, 5));
    }

} else {
    $errors[] = "Invalid request method. Please submit your booking through booking.html.";
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

      <?php if ($booking_confirmed): ?>
        
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
              <td><?= htmlspecialchars($room_display_name) ?></td>
              <td>KSh <?= number_format($room_rate) ?> / night</td>
              <td><?= $nights ?> night(s)</td>
              <td style="text-align: right; font-weight: 600;">KSh <?= number_format($server_room_cost) ?></td>
            </tr>
            <?php if ($has_breakfast): ?>
            <tr>
              <td>Daily Gourmet Breakfast Buffet</td>
              <td>KSh 700 / person / day</td>
              <td><?= $guests ?> guests &times; <?= $nights ?> nights</td>
              <td style="text-align: right; font-weight: 600;">KSh <?= number_format($server_breakfast_cost) ?></td>
            </tr>
            <?php endif; ?>
            <?php if ($has_transfer): ?>
            <tr>
              <td>Kisumu nternational Airport Transfer</td>
              <td>KSh 2,000 flat</td>
              <td>1 Transfer</td>
              <td style="text-align: right; font-weight: 600;">KSh <?= number_format($server_transfer_cost) ?></td>
            </tr>
            <?php endif; ?>
            <?php if ($has_conference): ?>
            <tr>
              <td>Conference Room Booking</td>
              <td>KSh 5,000 flat</td>
              <td>1 Day</td>
              <td style="text-align: right; font-weight: 600;">KSh <?= number_format($server_conference_cost) ?></td>
            </tr>
            <?php endif; ?>
            <?php if ($has_extra_bed): ?>
            <tr>
              <td>Extra Deluxe Bed Addition</td>
              <td>KSh 1,500 / night</td>
              <td><?= $nights ?> night(s)</td>
              <td style="text-align: right; font-weight: 600;">KSh <?= number_format($server_extra_bed_cost) ?></td>
            </tr>
            <?php endif; ?>
            <?php if ($has_late_checkout): ?>
            <tr>
              <td>Late Checkout Extension</td>
              <td>KSh 2,000 flat</td>
              <td>Until 4:00 PM</td>
              <td style="text-align: right; font-weight: 600;">KSh <?= number_format($server_late_checkout_cost) ?></td>
            </tr>
            <?php endif; ?>
          </tbody>
          <tfoot>
            <tr style="border-top: 2px solid var(--secondary);">
              <td colspan="3" style="font-weight: 700; font-size: 1.1rem;">TOTAL AUDITED &amp; BILLED:</td>
              <td style="text-align: right; font-weight: 800; font-size: 1.25rem; color: var(--primary);">
                KSh <?= number_format($server_total_amount) ?>
              </td>
            </tr>
          </tfoot>
        </table>

        <p class="confirm-thankyou">Thank you for choosing Sunrise Hotel.</p>

        <div class="confirm-actions">
          <button onclick="window.print()" class="btn-cta" style="background: var(--secondary);">
            Print Confirmation Voucher
          </button>
          <a href="booking.html" class="btn-cta">
            Make Another Booking
          </a>
          <a href="index.html" class="btn-secondary">
            Return to Home
          </a>
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
      <p>Server Processing Script: process_booking.php</p>
    </div>
  </footer>

</body>
</html>
