const ROOM_DATA = {
  Single: { rate: 3500, maxGuests: 1, name: "Single Room" },
  DeluxeSingle: { rate: 4000, maxGuests: 1, name: "Deluxe Single Room" },
  Double: { rate: 5000, maxGuests: 2, name: "Double Room" },
  SuperiorDouble: { rate: 6000, maxGuests: 2, name: "Superior Lakeview Double" },
  TwinDeluxe: { rate: 5500, maxGuests: 2, name: "Twin Deluxe Room" },
  Family: { rate: 7500, maxGuests: 4, name: "Family Room" },
  Executive: { rate: 10000, maxGuests: 3, name: "Executive Lake Suite" },
  Cottage: { rate: 12500, maxGuests: 3, name: "Lakefront Luxury Cottage" },
  Honeymoon: { rate: 14000, maxGuests: 2, name: "Honeymoon Panoramic Villa" },
  Presidential: { rate: 15000, maxGuests: 4, name: "Exucutive Sunset Suite" }
};

const BREAKFAST_RATE_PER_PERSON_DAY = 700;
const AIRPORT_TRANSFER_FEE = 2000;

const ADMISSION_CONFIG = {
  extraBedRatePerNight: 1500,
  conferenceRoomRate: 5000,
  lateCheckoutRate: 2000
};

function checkRoomCapacity() {
  const roomTypeInput = document.querySelector('input[name="room_type"]:checked') || document.getElementById('room_type');
  const guestsInput = document.getElementById('guests');
  const warningBox = document.getElementById('capacity-warning');
  const maxGuestsBadge = document.getElementById('max-guests-info');

  if (!roomTypeInput || !guestsInput) return true;

  const roomType = roomTypeInput.value;
  const numGuests = parseInt(guestsInput.value, 10) || 0;
  const roomConfig = ROOM_DATA[roomType];

  if (!roomConfig) {
    if (warningBox) warningBox.style.display = 'none';
    if (maxGuestsBadge) maxGuestsBadge.textContent = 'Select a room type';
    return true;
  }

  if (maxGuestsBadge) {
    maxGuestsBadge.textContent = `Max Capacity: ${roomConfig.maxGuests} ${roomConfig.maxGuests === 1 ? 'Guest' : 'Guests'}`;
  }

  if (numGuests > roomConfig.maxGuests) {
    if (warningBox) {
      warningBox.style.display = 'block';
      warningBox.innerHTML = `⚠️ <strong>Capacity Exceeded:</strong> A ${roomConfig.name} accommodates a maximum of ${roomConfig.maxGuests} ${roomConfig.maxGuests === 1 ? 'guest' : 'guests'}, but you have specified ${numGuests} guests. Please adjust guests or select a larger room.`;
    }
    return false;
  } else {
    if (warningBox) {
      warningBox.style.display = 'none';
    }
    return true;
  }
}

function calculateBill() {
  const roomTypeInput = document.querySelector('input[name="room_type"]:checked') || document.getElementById('room_type');
  const nightsInput = document.getElementById('nights');
  const guestsInput = document.getElementById('guests');
  const breakfastInput = document.getElementById('breakfast');
  const transferInput = document.getElementById('airport_transfer');

  const extraBedInput = document.getElementById('extra_bed');
  const conferenceInput = document.getElementById('conference_room');
  const lateCheckoutInput = document.getElementById('late_checkout');

  const nights = Math.max(0, parseInt(nightsInput ? nightsInput.value : 0, 10) || 0);
  const guests = Math.max(0, parseInt(guestsInput ? guestsInput.value : 0, 10) || 0);
  const roomType = roomTypeInput ? roomTypeInput.value : '';
  const roomConfig = ROOM_DATA[roomType];

  let roomCost = 0;
  let breakfastCost = 0;
  let transferCost = 0;
  let individualCost = 0;

  if (roomConfig && nights > 0) {
    roomCost = roomConfig.rate * nights;
  }

  if (breakfastInput && breakfastInput.checked && guests > 0 && nights > 0) {
    breakfastCost = BREAKFAST_RATE_PER_PERSON_DAY * guests * nights;
  }

  if (transferInput && transferInput.checked) {
    transferCost = AIRPORT_TRANSFER_FEE;
  }

  if (extraBedInput && extraBedInput.checked && nights > 0) {
    individualCost += ADMISSION_CONFIG.extraBedRatePerNight * nights;
  }
  if (conferenceInput && conferenceInput.checked) {
    individualCost += ADMISSION_CONFIG.conferenceRoomRate;
  }
  if (lateCheckoutInput && lateCheckoutInput.checked) {
    individualCost += ADMISSION_CONFIG.lateCheckoutRate;
  }

  const totalAmount = roomCost + breakfastCost + transferCost + individualCost;

  const roomCostElem = document.getElementById('bill-room-cost');
  const breakfastCostElem = document.getElementById('bill-breakfast-cost');
  const transferCostElem = document.getElementById('bill-transfer-cost');
  const extraCostElem = document.getElementById('bill-extra-cost');
  const totalCostElem = document.getElementById('bill-total-cost');
  const hiddenTotalInput = document.getElementById('client_calculated_total');

  if (roomCostElem) roomCostElem.textContent = `KSh ${roomCost.toLocaleString()}`;
  if (breakfastCostElem) breakfastCostElem.textContent = `KSh ${breakfastCost.toLocaleString()}`;
  if (transferCostElem) transferCostElem.textContent = `KSh ${transferCost.toLocaleString()}`;
  if (extraCostElem) extraCostElem.textContent = `KSh ${individualCost.toLocaleString()}`;
  if (totalCostElem) totalCostElem.textContent = `KSh ${totalAmount.toLocaleString()}`;
  if (hiddenTotalInput) hiddenTotalInput.value = totalAmount;

  const summaryRoomType = document.getElementById('summary-room-type');
  const summaryNights = document.getElementById('summary-nights');
  const summaryGuests = document.getElementById('summary-guests');
  if (summaryRoomType) summaryRoomType.textContent = roomConfig ? roomConfig.name : 'None selected';
  if (summaryNights) summaryNights.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
  if (summaryGuests) summaryGuests.textContent = `${guests} ${guests === 1 ? 'Guest' : 'Guests'}`;

  return totalAmount;
}

function validateBooking(event) {
  let isValid = true;

  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => el.textContent = '');
  const inputElements = document.querySelectorAll('.is-invalid');
  inputElements.forEach(el => el.classList.remove('is-invalid'));

  const nameInput = document.getElementById('customer_name');
  const nameError = document.getElementById('name-error');
  if (!nameInput || nameInput.value.trim() === '') {
    if (nameError) nameError.textContent = 'Customer full name is required.';
    if (nameInput) nameInput.classList.add('is-invalid');
    isValid = false;
  }

  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
    if (emailError) emailError.textContent = 'Please enter a valid email address (e.g., guest@example.com).';
    if (emailInput) emailInput.classList.add('is-invalid');
    isValid = false;
  }

  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phone-error');
  const phoneVal = phoneInput ? phoneInput.value.trim().replace(/\D/g, '') : '';
  if (!phoneInput || phoneVal.length !== 10) {
    if (phoneError) phoneError.textContent = 'Phone number must contain exactly 10 digits (e.g., 0712345678).';
    if (phoneInput) phoneInput.classList.add('is-invalid');
    isValid = false;
  }

  const nightsInput = document.getElementById('nights');
  const nightsError = document.getElementById('nights-error');
  const nights = nightsInput ? parseInt(nightsInput.value, 10) : 0;
  if (isNaN(nights) || nights < 1 || nights > 14) {
    if (nightsError) nightsError.textContent = 'Number of nights must be between 1 and 14.';
    if (nightsInput) nightsInput.classList.add('is-invalid');
    isValid = false;
  }

  const guestsInput = document.getElementById('guests');
  const guestsError = document.getElementById('guests-error');
  const guests = guestsInput ? parseInt(guestsInput.value, 10) : 0;
  if (isNaN(guests) || guests <= 0) {
    if (guestsError) guestsError.textContent = 'Number of guests must be at least 1.';
    if (guestsInput) guestsInput.classList.add('is-invalid');
    isValid = false;
  }

  const roomTypeInput = document.querySelector('input[name="room_type"]:checked') || document.getElementById('room_type');
  const roomError = document.getElementById('room-error');
  if (!roomTypeInput || !roomTypeInput.value) {
    if (roomError) roomError.textContent = 'Please select a room type.';
    isValid = false;
  }

  if (!checkRoomCapacity()) {
    isValid = false;
  }

  const checkinInput = document.getElementById('checkin_date');
  const checkinError = document.getElementById('checkin-error');
  if (checkinInput && !checkinInput.value) {
    if (checkinError) checkinError.textContent = 'Please select a check-in date.';
    if (checkinInput) checkinInput.classList.add('is-invalid');
    isValid = false;
  }

  const transferInput = document.getElementById('airport_transfer');
  if (transferInput && transferInput.checked) {
    const flightInput = document.getElementById('flight_number');
    const flightError = document.getElementById('flight-error');
    if (flightInput && flightInput.value.trim() === '') {
      if (flightError) flightError.textContent = 'Please provide arrival flight number or carrier.';
      flightInput.classList.add('is-invalid');
      isValid = false;
    }
  }

  if (!isValid && event) {
    event.preventDefault();
    const firstInvalid = document.querySelector('.is-invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
  }

  return isValid;
}

function toggleAirportTransferDetails() {
  const transferCheckbox = document.getElementById('airport_transfer');
  const detailsBox = document.getElementById('airport-details-box');
  if (!transferCheckbox || !detailsBox) return;

  if (transferCheckbox.checked) {
    detailsBox.style.display = 'block';
  } else {
    detailsBox.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', validateBooking);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const selectedRoomParam = urlParams.get('room');
  if (selectedRoomParam && ROOM_DATA[selectedRoomParam]) {
    const targetRadio = document.querySelector(`input[name="room_type"][value="${selectedRoomParam}"]`);
    if (targetRadio) {
      targetRadio.checked = true;
      document.querySelectorAll('.option-box').forEach(b => b.classList.remove('selected'));
      targetRadio.closest('.option-box')?.classList.add('selected');
    }
  }

  const changeInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"], select, input[type="date"]');
  changeInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (input.name === 'airport_transfer' || input.id === 'airport_transfer') {
        toggleAirportTransferDetails();
      }
      checkRoomCapacity();
      calculateBill();
    });
  });

  const radioLabels = document.querySelectorAll('.option-box input[type="radio"]');
  radioLabels.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.option-box').forEach(b => b.classList.remove('selected'));
      if (radio.checked) {
        radio.closest('.option-box')?.classList.add('selected');
      }
    });
  });

  const realTimeInputs = ['nights', 'guests', 'customer_name', 'email', 'phone'];
  realTimeInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        checkRoomCapacity();
        calculateBill();
      });
    }
  });

  toggleAirportTransferDetails();
  checkRoomCapacity();
  calculateBill();
});
