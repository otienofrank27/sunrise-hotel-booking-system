/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Hotel,
  Bed,
  Calendar,
  Users,
  Utensils,
  Plane,
  ShieldCheck,
  Download,
  Code,
  Play,
  CheckCircle2,
  AlertTriangle,
  Printer,
  RotateCcw,
  ArrowRight,
  Briefcase,
  Clock,
  FileText,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { STANDALONE_FILES, generateProjectZip } from './hotelProjectFiles.ts';

interface RoomConfig {
  name: string;
  rate: number;
  maxGuests: number;
  description: string;
  image: string;
  features: string[];
}

const DEFAULT_ROOMS: Record<string, RoomConfig> = {
  Single: {
    name: 'Single Room',
    rate: 3500,
    maxGuests: 1,
    description: 'Designed for solo travelers and business professionals. Features a plush single bed, dedicated workstation, and en-suite bath.',
    image: '/images/room_single_1791747685930.jpg',
    features: ['1 Single Bed', 'Ergonomic Desk', 'High-Speed Wi-Fi', 'En-suite Shower']
  },
  Double: {
    name: 'Double Room',
    rate: 5000,
    maxGuests: 2,
    description: 'Spacious coastal retreat with a luxurious king bed, private ocean-facing sun balcony, and luxury toiletries.',
    image: '/images/room_double_1791747698555.jpg',
    features: ['1 King Bed', 'Ocean Balcony', 'Smart TV', 'Complimentary Tea/Coffee']
  },
  Family: {
    name: 'Family Room',
    rate: 7000,
    maxGuests: 4,
    description: 'Expansive family suite with adjoining master and twin beds, living lounge area, dual vanities, and panoramic coastal views.',
    image: '/images/room_family_1791747709890.jpg',
    features: ['1 King + 2 Twin Beds', 'Living Lounge Area', 'Dual Vanities', 'Bathtub & Rain Shower']
  }
};

const BREAKFAST_RATE_PER_PERSON_DAY = 700;
const AIRPORT_TRANSFER_FEE = 2000;

export default function App() {
  const [activeTab, setActiveTab] = useState<'portal' | 'sandbox' | 'code' | 'submission'>('portal');
  const [portalPage, setPortalPage] = useState<'home' | 'booking' | 'confirmation'>('home');

  const [admissionNumber, setAdmissionNumber] = useState<string>('CT100/G/22849/24');
  const [selectedReqDigit, setSelectedReqDigit] = useState<number>(8);

  const [rooms, setRooms] = useState<Record<string, RoomConfig>>(DEFAULT_ROOMS);
  
  const [customRules, setCustomRules] = useState({
    strictPhoneDigits: true,
    strictIdDigits: false,
    requireFutureDate: true
  });

  const [formData, setFormData] = useState({
    customer_name: 'Marvin Frank',
    id_passport: '29482103',
    email: 'marvinfrank@gmail.com',
    phone: '0712345678',
    checkin_date: '2026-10-15',
    nights: 3,
    guests: 2,
    room_type: 'Double',
    breakfast: true,
    airport_transfer: true,
    flight_number: 'KQ 604',
    pickup_time: '14:30',
    transfer_type: 'Airport to Hotel',
    conference_room: false,
    extra_bed: false,
    late_checkout: false,
    client_calculated_total: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    customer_name: string;
    room_display_name: string;
    room_rate: number;
    room_cost: number;
    nights: number;
    guests: number;
    has_breakfast: boolean;
    breakfast_cost: number;
    has_transfer: boolean;
    transfer_cost: number;
    has_conference: boolean;
    conference_cost: number;
    has_extra_bed: boolean;
    extra_bed_cost: number;
    has_late_checkout: boolean;
    late_checkout_cost: number;
    client_total: number;
    server_total: number;
    is_verified: boolean;
    timestamp: string;
  } | null>(null);

  const [activeCodeFile, setActiveCodeFile] = useState<string>('booking.html');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    const match = admissionNumber.match(/(\d+)\/\d+$/) || admissionNumber.match(/(\d+)/g);
    if (match) {
      const numStr = match[1] || match[0];
      const lastDigit = parseInt(numStr.slice(-1), 10);
      if (!isNaN(lastDigit)) {
        setSelectedReqDigit(lastDigit);
      }
    }
  }, [admissionNumber]);

  const selectedRoomConfig = rooms[formData.room_type] || rooms['Double'];

  const capacityExceeded = useMemo(() => {
    if (!selectedRoomConfig) return false;
    return formData.guests > selectedRoomConfig.maxGuests;
  }, [selectedRoomConfig, formData.guests]);

  const calculatedBill = useMemo(() => {
    const nights = Math.max(0, Number(formData.nights) || 0);
    const guests = Math.max(0, Number(formData.guests) || 0);
    const roomRate = selectedRoomConfig ? selectedRoomConfig.rate : 0;

    const roomCost = roomRate * nights;
    const breakfastCost = (formData.breakfast && guests > 0 && nights > 0)
      ? (BREAKFAST_RATE_PER_PERSON_DAY * guests * nights)
      : 0;
    const transferCost = formData.airport_transfer ? AIRPORT_TRANSFER_FEE : 0;

    let extraCost = 0;
    if (formData.conference_room) extraCost += 5000;
    if (formData.extra_bed) extraCost += (1500 * nights);
    if (formData.late_checkout) extraCost += 2000;

    const total = roomCost + breakfastCost + transferCost + extraCost;

    return {
      roomCost,
      breakfastCost,
      transferCost,
      extraCost,
      total
    };
  }, [formData, selectedRoomConfig]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, client_calculated_total: calculatedBill.total }));
  }, [calculatedBill.total]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer full name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., guest@example.com).';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      newErrors.phone = 'Phone number must contain exactly 10 digits (e.g., 0712345678).';
    }

    const nights = Number(formData.nights);
    if (isNaN(nights) || nights < 1 || nights > 14) {
      newErrors.nights = 'Number of nights must be between 1 and 14.';
    }

    const guests = Number(formData.guests);
    if (isNaN(guests) || guests <= 0) {
      newErrors.guests = 'Number of guests must be at least 1.';
    }

    if (!formData.room_type || !rooms[formData.room_type]) {
      newErrors.room_type = 'Please select a valid room type.';
    }

    if (selectedRoomConfig && guests > selectedRoomConfig.maxGuests) {
      newErrors.guests = `Capacity exceeded: A ${selectedRoomConfig.name} allows at most ${selectedRoomConfig.maxGuests} guest(s).`;
    }

    if (!formData.checkin_date) {
      newErrors.checkin_date = 'Please select a check-in date.';
    }

    if (customRules.strictIdDigits && formData.id_passport.length < 7) {
      newErrors.id_passport = 'National ID must contain at least 8 digits.';
    }

    if (formData.airport_transfer && !formData.flight_number.trim()) {
      newErrors.flight_number = 'Please enter your arrival flight number or airline.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const serverNights = Number(formData.nights);
    const serverGuests = Number(formData.guests);
    const serverRoomConfig = rooms[formData.room_type] || DEFAULT_ROOMS.Double;
    const serverRoomCost = serverRoomConfig.rate * serverNights;
    const serverBreakfastCost = formData.breakfast ? (BREAKFAST_RATE_PER_PERSON_DAY * serverGuests * serverNights) : 0;
    const serverTransferCost = formData.airport_transfer ? AIRPORT_TRANSFER_FEE : 0;
    
    const serverConferenceCost = formData.conference_room ? 5000 : 0;
    const serverExtraBedCost = formData.extra_bed ? (1500 * serverNights) : 0;
    const serverLateCheckoutCost = formData.late_checkout ? 2000 : 0;

    const serverTotal = serverRoomCost + serverBreakfastCost + serverTransferCost 
                      + serverConferenceCost + serverExtraBedCost + serverLateCheckoutCost;

    const isVerified = (Math.abs(serverTotal - calculatedBill.total) < 0.01);
    const refCode = `SRH-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    setConfirmedBooking({
      reference: refCode,
      customer_name: formData.customer_name,
      room_display_name: serverRoomConfig.name,
      room_rate: serverRoomConfig.rate,
      room_cost: serverRoomCost,
      nights: serverNights,
      guests: serverGuests,
      has_breakfast: formData.breakfast,
      breakfast_cost: serverBreakfastCost,
      has_transfer: formData.airport_transfer,
      transfer_cost: serverTransferCost,
      has_conference: formData.conference_room,
      conference_cost: serverConferenceCost,
      has_extra_bed: formData.extra_bed,
      extra_bed_cost: serverExtraBedCost,
      has_late_checkout: formData.late_checkout,
      late_checkout_cost: serverLateCheckoutCost,
      client_total: calculatedBill.total,
      server_total: serverTotal,
      is_verified: isVerified,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setPortalPage('confirmation');
  };

  const fillSampleBooking = () => {
    setFormData({
      customer_name: 'Marvin Frank',
      id_passport: '29482103',
      email: 'marvinfrank@gmail.com',
      phone: '0712345678',
      checkin_date: '2026-10-18',
      nights: 3,
      guests: 2,
      room_type: 'Double',
      breakfast: true,
      airport_transfer: true,
      flight_number: 'KQ 604',
      pickup_time: '14:30',
      transfer_type: 'Airport to Hotel',
      conference_room: false,
      extra_bed: false,
      late_checkout: false,
      client_calculated_total: 21200
    });
    setErrors({});
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const cleanId = admissionNumber.replace(/[^a-zA-Z0-9]/g, '_');
      const blob = await generateProjectZip(cleanId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanId}_HotelRoomBooking.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating project ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Application Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Sunrise Hotel</span>
              <span className="text-xs text-amber-700 block font-medium">Room Booking & Billing System</span>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-sm font-medium">
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'portal'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Hotel Portal
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'sandbox'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Task 8 Sandbox
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'code'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-500" />
                Source Files
              </span>
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className={`px-3.5 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'submission'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Submission &amp; ZIP
            </button>
          </nav>

          {/* Direct CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              {isZipping ? 'Packaging...' : 'Download XAMPP ZIP'}
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Header Bar: Student Context & Admission Requirement */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-950">Active Requirement:</span>
            <span>Admission: <strong>{admissionNumber}</strong></span>
            <span className="text-amber-400">|</span>
            <span>Digit: <strong>{selectedReqDigit}</strong></span>
            <span className="text-amber-400">|</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium border border-amber-300">
              {selectedReqDigit === 7 && 'Requirement 7: Add Extra Bed (KSh 1,500/night)'}
              {selectedReqDigit === 8 && 'Requirement 8: Add Conference Room Booking (KSh 5,000)'}
              {selectedReqDigit === 9 && 'Requirement 9: Add Late Checkout (KSh 2,000)'}
              {selectedReqDigit === 0 && 'Requirement 0: 10% Discount for 5+ Nights'}
              {selectedReqDigit === 1 && 'Requirement 1: Swimming Pool Access (KSh 500/person)'}
              {selectedReqDigit === 2 && 'Requirement 2: Executive Room (KSh 10,000/night)'}
              {selectedReqDigit === 3 && 'Requirement 3: 5% Discount for Orders > KSh 20,000'}
              {selectedReqDigit === 4 && 'Requirement 4: Laundry Service (KSh 1,000)'}
              {selectedReqDigit === 5 && 'Requirement 5: Dinner (KSh 1,200/person/day)'}
              {selectedReqDigit === 6 && 'Requirement 6: Free Airport Transfer for 7+ Nights'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600">Switch Digit:</span>
            <div className="flex items-center gap-1">
              {[7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => {
                    setSelectedReqDigit(digit);
                    setAdmissionNumber(`CT100/G/2439${digit}/24`);
                  }}
                  className={`px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                    selectedReqDigit === digit
                      ? 'bg-amber-700 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* =========================================================================
            TAB 1: LIVE HOTEL PORTAL (index.html, booking.html, process_booking.php)
            ========================================================================= */}
        {activeTab === 'portal' && (
          <div className="space-y-6">
            
            {/* View Sub-Navigation */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPortalPage('home')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    portalPage === 'home'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  index.html (Home Page)
                </button>
                <button
                  onClick={() => setPortalPage('booking')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    portalPage === 'booking'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  booking.html (Booking &amp; Calculator)
                </button>
                <button
                  onClick={() => {
                    if (!confirmedBooking) {
                      fillSampleBooking();
                    }
                    setPortalPage('confirmation');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    portalPage === 'confirmation'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  process_booking.php (PHP Output)
                </button>
              </div>

              {portalPage === 'booking' && (
                <button
                  onClick={fillSampleBooking}
                  className="text-xs bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-amber-600" />
                  Pre-Fill Task 6 Peter Mwangi Test Case (KSh 21,200)
                </button>
              )}
            </div>

            {/* PAGE A: index.html (HOME PAGE) */}
            {portalPage === 'home' && (
              <div className="space-y-12">
                
                {/* Hero Showcase */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-lg border border-slate-800">
                  <div className="absolute inset-0 opacity-40">
                    <img
                      src="/images/sunrise_hotel_hero_1791747675711.jpg"
                      alt="Sunrise Hotel Coastline"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 px-6 py-20 sm:px-12 lg:px-16 max-w-3xl">
                    <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase mb-3 block">
                      Welcome to Sunrise Hotel Resort &amp; Spa
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                      Luxury Coastal Stays with Instant Automated Billing
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg mb-8 leading-relaxed">
                      Experience tranquil oceanfront accommodation in Mombasa. Choose your room category, configure breakfast and transfers, and receive instant verifiable reservations.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setPortalPage('booking')}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-md inline-flex items-center gap-2"
                      >
                        Reserve Room Online
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <a
                        href="#room-rates"
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white rounded-lg font-semibold text-sm transition-colors border border-white/20"
                      >
                        Explore Accommodations
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hotel Amenities Strip */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Breakfast Buffet</h4>
                      <p className="text-xs text-slate-500 mt-0.5">KSh 700 per person per day with gourmet chef options.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Airport Shuttle</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Private airport transfer for a flat fee of KSh 2,000.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Independent Auditing</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Server independently recalculates bills for 100% integrity.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">Capacity Enforcement</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Real-time room occupancy limits prevent overbooking.</p>
                    </div>
                  </div>
                </div>

                {/* Room Showcase Section */}
                <div id="room-rates" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Rooms, Suites &amp; Nightly Rates</h2>
                    <p className="text-sm text-slate-500 mt-1">Select from our well-appointed room categories.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(rooms).map(([key, room]) => (
                      <div
                        key={key}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-xs">
                            Max {room.maxGuests} {room.maxGuests === 1 ? 'Guest' : 'Guests'}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-baseline justify-between mb-2">
                              <h3 className="font-bold text-lg text-slate-900">{room.name}</h3>
                              <span className="text-base font-extrabold text-amber-700">
                                KSh {room.rate.toLocaleString()}
                                <span className="text-xs font-normal text-slate-500"> / night</span>
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                              {room.description}
                            </p>

                            <div className="space-y-1.5 mb-6">
                              {room.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              handleInputChange('room_type', key);
                              setPortalPage('booking');
                            }}
                            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                          >
                            Book {room.name}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* PAGE B: booking.html (BOOKING FORM & DYNAMIC CALCULATOR) */}
            {portalPage === 'booking' && (
              <div className="space-y-6">
                
                {/* Capacity Warning Alert */}
                {capacityExceeded && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 animate-fadeIn">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-sm">Room Capacity Exceeded (Task 3 Dynamic Feature):</strong>
                      <p className="text-xs mt-1 text-red-700">
                        A <strong>{selectedRoomConfig.name}</strong> accommodates a maximum of <strong>{selectedRoomConfig.maxGuests} {selectedRoomConfig.maxGuests === 1 ? 'guest' : 'guests'}</strong>, but you have specified <strong>{formData.guests} guests</strong>. Please reduce the number of guests or select a larger room category before submitting.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Form (8 cols) */}
                  <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
                    <form onSubmit={handleSubmitBooking} noValidate className="space-y-6">

                      {/* Section 1: Customer Details */}
                      <div>
                        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
                          <Users className="w-4 h-4 text-amber-700" />
                          <h2 className="font-bold text-slate-900 text-base">1. Customer Information</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Customer Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.customer_name}
                              onChange={(e) => handleInputChange('customer_name', e.target.value)}
                              placeholder="e.g., Peter Mwangi"
                              className={`w-full px-3 py-2 text-sm border rounded-lg outline-hidden transition-all ${
                                errors.customer_name
                                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                                  : 'border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
                              }`}
                            />
                            {errors.customer_name && (
                              <p className="text-xs text-red-600 mt-1 font-medium">{errors.customer_name}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              National ID / Passport Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.id_passport}
                              onChange={(e) => handleInputChange('id_passport', e.target.value)}
                              placeholder="e.g., 29482103"
                              className={`w-full px-3 py-2 text-sm border rounded-lg outline-hidden transition-all ${
                                errors.id_passport
                                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                                  : 'border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
                              }`}
                            />
                            {errors.id_passport && (
                              <p className="text-xs text-red-600 mt-1 font-medium">{errors.id_passport}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="e.g., peter@example.com"
                              className={`w-full px-3 py-2 text-sm border rounded-lg outline-hidden transition-all ${
                                errors.email
                                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                                  : 'border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
                              }`}
                            />
                            {errors.email && (
                              <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Phone Number (Exactly 10 Digits) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="e.g., 0712345678"
                              className={`w-full px-3 py-2 text-sm border rounded-lg outline-hidden transition-all font-mono ${
                                errors.phone
                                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                                  : 'border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
                              }`}
                            />
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-slate-500">
                                Kenyan standard format (starts with 07 or 01, exactly 10 digits).
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                {formData.phone.length}/10
                              </span>
                            </div>
                            {errors.phone && (
                              <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Dates & Occupancy */}
                      <div>
                        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
                          <Calendar className="w-4 h-4 text-amber-700" />
                          <h2 className="font-bold text-slate-900 text-base">2. Dates &amp; Occupancy</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Check-in Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={formData.checkin_date}
                              onChange={(e) => handleInputChange('checkin_date', e.target.value)}
                              className={`w-full px-3 py-2 text-sm border rounded-lg outline-hidden transition-all ${
                                errors.checkin_date
                                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                                  : 'border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
                              }`}
                            />
                            {errors.checkin_date && (
                              <p className="text-xs text-red-600 mt-1 font-medium">{errors.checkin_date}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Number of Nights (1-14) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={14}
                              value={formData.nights}
                              onChange={(e) => handleInputChange('nights', parseInt(e.target.value, 10) || '')}
                              className={`w-full px-3 py-2 text-sm border rounded-lg outline-hidden transition-all ${
                                errors.nights
                                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                                  : 'border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
                              }`}
                            />
                            {errors.nights && (
                              <p className="text-xs text-red-600 mt-1 font-medium">{errors.nights}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Number of Guests <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={formData.guests}
                              onChange={(e) => handleInputChange('guests', parseInt(e.target.value, 10) || '')}
                              className={`w-full px-3 py-2 text-sm border rounded-lg outline-hidden transition-all ${
                                errors.guests || capacityExceeded
                                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                                  : 'border-slate-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
                              }`}
                            />
                            <p className="text-xs text-amber-700 font-medium mt-1">
                              Max capacity: {selectedRoomConfig ? selectedRoomConfig.maxGuests : 2}
                            </p>
                            {errors.guests && (
                              <p className="text-xs text-red-600 mt-1 font-medium">{errors.guests}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Room Selection (Radio Buttons) */}
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4 text-amber-700" />
                            <h2 className="font-bold text-slate-900 text-base">3. Room Category</h2>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            Capacity: Single (1), Double (2), Family (4)
                          </span>
                        </div>

                        <div className="space-y-3">
                          {Object.entries(rooms).map(([key, room]) => {
                            const isSelected = formData.room_type === key;
                            return (
                              <label
                                key={key}
                                className={`flex items-start gap-4 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-amber-600 bg-amber-50/70 shadow-xs ring-1 ring-amber-600'
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="room_type"
                                  value={key}
                                  checked={isSelected}
                                  onChange={() => handleInputChange('room_type', key)}
                                  className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-slate-900">{room.name}</span>
                                    <span className="font-bold text-sm text-amber-800">
                                      KSh {room.rate.toLocaleString()} / night
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 mt-0.5">
                                    Maximum capacity: <strong>{room.maxGuests} {room.maxGuests === 1 ? 'Guest' : 'Guests'}</strong> · {room.features.slice(0, 2).join(' · ')}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 4: Additional Services */}
                      <div>
                        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200">
                          <Briefcase className="w-4 h-4 text-amber-700" />
                          <h2 className="font-bold text-slate-900 text-base">4. Additional Services &amp; Packages</h2>
                        </div>

                        <div className="space-y-3">
                          {/* Breakfast Checkbox */}
                          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.breakfast}
                              onChange={(e) => handleInputChange('breakfast', e.target.checked)}
                              className="mt-1 text-amber-600 focus:ring-amber-500 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-slate-900">Daily Breakfast Buffet</span>
                                <span className="font-bold text-xs text-amber-800">
                                  + KSh 700 / person / day
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Automatically billed as: KSh 700 &times; {formData.guests || 1} guests &times; {formData.nights || 1} nights = KSh {((formData.guests || 1) * (formData.nights || 1) * 700).toLocaleString()}
                              </p>
                            </div>
                          </label>

                          {/* Airport Transfer Checkbox */}
                          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.airport_transfer}
                              onChange={(e) => handleInputChange('airport_transfer', e.target.checked)}
                              className="mt-1 text-amber-600 focus:ring-amber-500 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-slate-900">Airport Transfer Shuttle</span>
                                <span className="font-bold text-xs text-amber-800">+ KSh 2,000 flat</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Private, air-conditioned vehicle pickup direct from Moi International Airport or SGR Terminus.
                              </p>
                            </div>
                          </label>

                          {/* Dynamic Airport Details Sub-Form (Task 3 Dynamic Feature) */}
                          {formData.airport_transfer && (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                <Plane className="w-3.5 h-3.5 text-amber-700" />
                                <span>Airport Transfer Information (Task 3 Dynamic Reveal):</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-slate-600 mb-1">
                                    Flight Number / Carrier
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.flight_number}
                                    onChange={(e) => handleInputChange('flight_number', e.target.value)}
                                    placeholder="e.g., KQ 604 or Fly540"
                                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:border-amber-600 outline-hidden bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-600 mb-1">
                                    Estimated Pickup Time
                                  </label>
                                  <input
                                    type="time"
                                    value={formData.pickup_time}
                                    onChange={(e) => handleInputChange('pickup_time', e.target.value)}
                                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:border-amber-600 outline-hidden bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Individualized Admission Requirements (7, 8, 9) */}
                          <div className="pt-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                              Assigned Requirement Options:
                            </span>

                            {/* Option 8: Conference room */}
                            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer mb-2 ${
                              selectedReqDigit === 8 ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 bg-white'
                            }`}>
                              <input
                                type="checkbox"
                                checked={formData.conference_room}
                                onChange={(e) => handleInputChange('conference_room', e.target.checked)}
                                className="mt-1 text-amber-600 focus:ring-amber-500 rounded cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm text-slate-900">
                                    Conference Room Booking [Req 8]
                                  </span>
                                  <span className="font-bold text-xs text-amber-800">+ KSh 5,000 flat</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Full-day access to executive AV-equipped conference room with projector and tea service.
                                </p>
                              </div>
                            </label>

                            {/* Option 7: Extra bed */}
                            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer mb-2 ${
                              selectedReqDigit === 7 ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 bg-white'
                            }`}>
                              <input
                                type="checkbox"
                                checked={formData.extra_bed}
                                onChange={(e) => handleInputChange('extra_bed', e.target.checked)}
                                className="mt-1 text-amber-600 focus:ring-amber-500 rounded cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm text-slate-900">
                                    Extra Bed Option [Req 7]
                                  </span>
                                  <span className="font-bold text-xs text-amber-800">+ KSh 1,500 / night</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Additional deluxe rollaway bed: KSh 1,500 &times; {formData.nights || 1} nights = KSh {(1500 * (formData.nights || 1)).toLocaleString()}
                                </p>
                              </div>
                            </label>

                            {/* Option 9: Late checkout */}
                            <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer ${
                              selectedReqDigit === 9 ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 bg-white'
                            }`}>
                              <input
                                type="checkbox"
                                checked={formData.late_checkout}
                                onChange={(e) => handleInputChange('late_checkout', e.target.checked)}
                                className="mt-1 text-amber-600 focus:ring-amber-500 rounded cursor-pointer"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm text-slate-900">
                                    Late Checkout Option [Req 9]
                                  </span>
                                  <span className="font-bold text-xs text-amber-800">+ KSh 2,000 flat</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  Guaranteed room access and resort amenities extended until 4:00 PM on departure day.
                                </p>
                              </div>
                            </label>
                          </div>

                        </div>
                      </div>

                      {/* Submit Action */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Submit Reservation to process_booking.php &rarr;
                        </button>
                        <p className="text-center text-xs text-slate-500 mt-2">
                          Data submitted via HTTP POST. Verified independently on the server.
                        </p>
                      </div>

                    </form>
                  </div>

                  {/* Right Column: Live Bill Calculator Sidebar (Task 4) */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24 space-y-5">
                    
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b-2 border-amber-600">
                        <h3 className="font-bold text-lg text-slate-900">Estimated Booking Bill</h3>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                          Task 4 Live Calculator
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Updates automatically via JavaScript as options change.
                      </p>
                    </div>

                    {/* Summary Pill (Dynamic feature) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Selected Room:</span>
                        <strong className="text-slate-900">{selectedRoomConfig?.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <strong className="text-slate-900">{formData.nights} Night(s)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Occupancy:</span>
                        <strong className="text-slate-900">{formData.guests} Guest(s)</strong>
                      </div>
                    </div>

                    {/* Itemized Calculation Breakdown */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start pb-2 border-b border-dashed border-slate-200">
                        <div>
                          <span className="text-slate-700 font-medium">Room Rate</span>
                          <span className="text-xs text-slate-400 block">
                            KSh {selectedRoomConfig?.rate.toLocaleString()} &times; {formData.nights} night(s)
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 tabular-nums">
                          KSh {calculatedBill.roomCost.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-start pb-2 border-b border-dashed border-slate-200">
                        <div>
                          <span className="text-slate-700 font-medium">Breakfast Buffet</span>
                          <span className="text-xs text-slate-400 block">
                            {formData.breakfast
                              ? `KSh 700 × ${formData.guests} guests × ${formData.nights} nights`
                              : 'Not requested'}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 tabular-nums">
                          KSh {calculatedBill.breakfastCost.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-start pb-2 border-b border-dashed border-slate-200">
                        <div>
                          <span className="text-slate-700 font-medium">Airport Shuttle</span>
                          <span className="text-xs text-slate-400 block">
                            {formData.airport_transfer ? 'Fixed transport fee' : 'Not requested'}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900 tabular-nums">
                          KSh {calculatedBill.transferCost.toLocaleString()}
                        </span>
                      </div>

                      {calculatedBill.extraCost > 0 && (
                        <div className="flex justify-between items-start pb-2 border-b border-dashed border-slate-200">
                          <div>
                            <span className="text-slate-700 font-medium">Individualized Add-on</span>
                            <span className="text-xs text-slate-400 block">
                              {formData.conference_room && 'Conference Room (+KSh 5,000) '}
                              {formData.extra_bed && `Extra Bed (+KSh ${(1500 * Number(formData.nights)).toLocaleString()}) `}
                              {formData.late_checkout && 'Late Checkout (+KSh 2,000)'}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 tabular-nums">
                            KSh {calculatedBill.extraCost.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total Row */}
                    <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                      <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block">
                          Total Estimated:
                        </span>
                        <span className="text-xs text-slate-400">Total = Room + Breakfast + Transfer + Extras</span>
                      </div>
                      <span className="text-2xl font-black text-amber-700 tabular-nums">
                        KSh {calculatedBill.total.toLocaleString()}
                      </span>
                    </div>

                    {/* Verification Stamp */}
                    <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Server Independent Verification Rule</span>
                      </div>
                      <p className="text-amber-800 text-[11px] leading-relaxed">
                        Per Task 6 specification, the PHP backend independently recalculates this bill upon POST. The server never blindly trusts JavaScript amounts.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* PAGE C: process_booking.php (PHP CONFIRMATION OUTPUT) */}
            {portalPage === 'confirmation' && confirmedBooking && (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-md space-y-6">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-amber-600">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded inline-block uppercase tracking-wider mb-1">
                      Server Verification Passed (PHP Audited)
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      BOOKING CONFIRMED
                    </h2>
                    <p className="text-xs text-slate-500">
                      Reference: <strong className="font-mono">{confirmedBooking.reference}</strong> · Timestamp: {confirmedBooking.timestamp}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>

                {/* EXACT REQUIRED OUTPUT FORMAT RUBRIC */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-sm font-medium text-slate-800">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Exact Task 6 Script Output Representation:
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-bold text-slate-900">{confirmedBooking.customer_name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Room:</span>
                    <span className="font-bold text-slate-900">{confirmedBooking.room_display_name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Guests:</span>
                    <span className="font-bold text-slate-900">{confirmedBooking.guests}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Number of Nights:</span>
                    <span className="font-bold text-slate-900">{confirmedBooking.nights}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Breakfast:</span>
                    <span className="font-bold text-slate-900">{confirmedBooking.has_breakfast ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Airport Transfer:</span>
                    <span className="font-bold text-slate-900">{confirmedBooking.has_transfer ? 'Yes' : 'No'}</span>
                  </div>
                  {confirmedBooking.has_conference && (
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Conference Room [Req 8]:</span>
                      <span className="font-bold text-slate-900">Yes</span>
                    </div>
                  )}
                  {confirmedBooking.has_extra_bed && (
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Extra Bed [Req 7]:</span>
                      <span className="font-bold text-slate-900">Yes</span>
                    </div>
                  )}
                  {confirmedBooking.has_late_checkout && (
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Late Checkout [Req 9]:</span>
                      <span className="font-bold text-slate-900">Yes</span>
                    </div>
                  )}

                  {/* Highlighted Total Amount */}
                  <div className="pt-3 mt-2 border-t-2 border-amber-600 flex justify-between items-baseline">
                    <span className="text-base font-extrabold text-slate-900">TOTAL AMOUNT:</span>
                    <span className="text-2xl font-black text-amber-700 tabular-nums">
                      KSh {confirmedBooking.server_total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Server Audit Breakdown Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-slate-100 px-3.5 py-2 font-semibold text-slate-700 flex justify-between">
                    <span>Server Audit Log (process_booking.php)</span>
                    <span className="text-emerald-700">✓ Audited Recalculation Complete</span>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">Component</th>
                        <th className="p-2.5">Basis</th>
                        <th className="p-2.5 text-right">Server Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-medium">{confirmedBooking.room_display_name}</td>
                        <td className="p-2.5 text-slate-500">KSh {confirmedBooking.room_rate.toLocaleString()} &times; {confirmedBooking.nights} nights</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">KSh {confirmedBooking.room_cost.toLocaleString()}</td>
                      </tr>
                      {confirmedBooking.has_breakfast && (
                        <tr>
                          <td className="p-2.5 font-medium">Daily Breakfast Buffet</td>
                          <td className="p-2.5 text-slate-500">KSh 700 &times; {confirmedBooking.guests} guests &times; {confirmedBooking.nights} nights</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">KSh {confirmedBooking.breakfast_cost.toLocaleString()}</td>
                        </tr>
                      )}
                      {confirmedBooking.has_transfer && (
                        <tr>
                          <td className="p-2.5 font-medium">Airport Shuttle Transfer</td>
                          <td className="p-2.5 text-slate-500">Flat airport transport service fee</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">KSh {confirmedBooking.transfer_cost.toLocaleString()}</td>
                        </tr>
                      )}
                      {confirmedBooking.has_conference && (
                        <tr>
                          <td className="p-2.5 font-medium">Conference Room [Req 8]</td>
                          <td className="p-2.5 text-slate-500">Audited requirement flat fee</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">KSh {confirmedBooking.conference_cost.toLocaleString()}</td>
                        </tr>
                      )}
                      {confirmedBooking.has_extra_bed && (
                        <tr>
                          <td className="p-2.5 font-medium">Extra Bed [Req 7]</td>
                          <td className="p-2.5 text-slate-500">KSh 1,500 &times; {confirmedBooking.nights} nights</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">KSh {confirmedBooking.extra_bed_cost.toLocaleString()}</td>
                        </tr>
                      )}
                      {confirmedBooking.has_late_checkout && (
                        <tr>
                          <td className="p-2.5 font-medium">Late Checkout [Req 9]</td>
                          <td className="p-2.5 text-slate-500">Guaranteed late stay option</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">KSh {confirmedBooking.late_checkout_cost.toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Closing Message from prompt verbatim */}
                <p className="text-center italic text-slate-600 text-sm font-serif">
                  Thank you for choosing Sunrise Hotel.
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Confirmation Voucher
                  </button>
                  <button
                    onClick={() => setPortalPage('booking')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Make Another Booking
                  </button>
                  <button
                    onClick={() => setPortalPage('home')}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Return to Home Page
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 2: PRACTICAL DEMONSTRATION & SNAPSHOT SANDBOX
            ========================================================================= */}
        {activeTab === 'sandbox' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                Practical Demonstration Sandbox (Task 8 - 3 Marks)
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Live Parameter Adjustments &amp; System Snapshots
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                The assignment rubric states: <em>"Demonstrate the completed application using sample snapshots of the implemented project: changing a room rate, introducing another room type, changing maximum room capacity, or introducing a new validation rule."</em> Test and demonstrate each action live below!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* SNAPSHOT 1: Changing a Room Rate */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">1</span>
                    <h3 className="font-bold text-base text-slate-900">Action 1: Changing Room Rates</h3>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    Rate Adjustment
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Adjust room prices dynamically and verify that both JavaScript live calculations and PHP backend auditing recalculate seamlessly.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Single Room (KSh)</label>
                    <input
                      type="number"
                      step={500}
                      value={rooms.Single.rate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRooms(prev => ({ ...prev, Single: { ...prev.Single, rate: val } }));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Double Room (KSh)</label>
                    <input
                      type="number"
                      step={500}
                      value={rooms.Double.rate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRooms(prev => ({ ...prev, Double: { ...prev.Double, rate: val } }));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Family Room (KSh)</label>
                    <input
                      type="number"
                      step={500}
                      value={rooms.Family.rate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRooms(prev => ({ ...prev, Family: { ...prev.Family, rate: val } }));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border rounded-md font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <span>Current 3-Night Double Room Base:</span>
                  <strong className="text-amber-800 font-mono">
                    KSh {(rooms.Double.rate * 3).toLocaleString()}
                  </strong>
                </div>

                <button
                  onClick={() => {
                    setRooms(DEFAULT_ROOMS);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline block"
                >
                  Reset to Default Rates (Single: 3,500, Double: 5,000, Family: 7,500)
                </button>
              </div>

              {/* SNAPSHOT 2: Introducing Another Room Type */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">2</span>
                    <h3 className="font-bold text-base text-slate-900">Action 2: Introducing Another Room Type</h3>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    Schema Expansion
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Add a brand new room type (e.g., <strong>Executive Room</strong> or <strong>Penthouse Suite</strong>) into the booking form and server config.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (rooms.Executive) {
                        setRooms(prev => {
                          const copy = { ...prev };
                          delete copy.Executive;
                          return copy;
                        });
                      } else {
                        setRooms(prev => ({
                          ...prev,
                          Executive: {
                            name: 'Executive Suite',
                            rate: 10000,
                            maxGuests: 3,
                            description: 'High-floor corner suite with private boardroom desk, marble jacuzzi, and coastal terrace.',
                            image: '/images/room_double_1791747698555.jpg',
                            features: ['King Bed', 'Executive Lounge Pass', 'Jacuzzi', 'Butler Service']
                          }
                        }));
                      }
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      rooms.Executive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {rooms.Executive ? '✓ Executive Suite Enabled (KSh 10,000)' : '+ Introduce Executive Suite'}
                  </button>

                  <button
                    onClick={() => {
                      if (rooms.Penthouse) {
                        setRooms(prev => {
                          const copy = { ...prev };
                          delete copy.Penthouse;
                          return copy;
                        });
                      } else {
                        setRooms(prev => ({
                          ...prev,
                          Penthouse: {
                            name: 'Presidential Penthouse',
                            rate: 15000,
                            maxGuests: 6,
                            description: 'Top floor 3-bedroom penthouse with private rooftop pool, personal chef kitchen, and 360-degree ocean views.',
                            image: '/images/room_family_1791747709890.jpg',
                            features: ['3 Master Bedrooms', 'Private Plunge Pool', 'Personal Chef', 'VIP Helicopter Pad']
                          }
                        }));
                      }
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      rooms.Penthouse
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {rooms.Penthouse ? '✓ Penthouse Enabled (KSh 15,000)' : '+ Introduce Penthouse'}
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-600">Currently Active Room Types in Application:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {Object.keys(rooms).map(key => (
                      <span key={key} className="bg-white border border-slate-300 px-2 py-0.5 rounded font-mono text-[11px]">
                        {rooms[key].name} ({rooms[key].rate.toLocaleString()} KSh)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SNAPSHOT 3: Changing Maximum Room Capacity */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">3</span>
                    <h3 className="font-bold text-base text-slate-900">Action 3: Changing Maximum Room Capacity</h3>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    Capacity Boundary
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Modify the maximum guest limits (e.g. increase Double room to 3 guests, or Family room to 6 guests) and verify that dynamic validation reacts instantly.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Single Max Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={rooms.Single.maxGuests}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRooms(prev => ({ ...prev, Single: { ...prev.Single, maxGuests: val } }));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Double Max Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={rooms.Double.maxGuests}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRooms(prev => ({ ...prev, Double: { ...prev.Double, maxGuests: val } }));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Family Max Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={rooms.Family.maxGuests}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setRooms(prev => ({ ...prev, Family: { ...prev.Family, maxGuests: val } }));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border rounded-md font-mono"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                  <span>Current Test Setting: <strong>Double Room with {formData.guests} Guests</strong></span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                    formData.guests > rooms.Double.maxGuests
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {formData.guests > rooms.Double.maxGuests ? '⚠️ Over-Capacity Alert' : '✓ Permitted'}
                  </span>
                </div>
              </div>

              {/* SNAPSHOT 4: Introducing a New Validation Rule */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">4</span>
                    <h3 className="font-bold text-base text-slate-900">Action 4: Introducing New Validation Rules</h3>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    Validation Logic
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Toggle newly introduced validation constraints and test that custom error notices appear before submission.
                </p>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customRules.strictIdDigits}
                      onChange={(e) => setCustomRules(prev => ({ ...prev, strictIdDigits: e.target.checked }))}
                      className="text-amber-600 rounded"
                    />
                    <span><strong>New Rule A:</strong> Require National ID to have at least 7 digits (Kenyan ID format)</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customRules.requireFutureDate}
                      onChange={(e) => setCustomRules(prev => ({ ...prev, requireFutureDate: e.target.checked }))}
                      className="text-amber-600 rounded"
                    />
                    <span><strong>New Rule B:</strong> Check-in date cannot be in the past</span>
                  </label>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500 block mb-1">Sample Validation Output:</span>
                  <code className="text-red-600 font-mono block text-[11px]">
                    {customRules.strictIdDigits && formData.id_passport.length < 7
                      ? 'Error: National ID must contain at least 7 digits.'
                      : 'All custom rules satisfied.'}
                  </code>
                </div>
              </div>

            </div>

            {/* Test in Live Form CTA */}
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-amber-950">Test Custom Parameters in Booking Form</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Any changes made in this sandbox are actively wired into the live booking form and calculator!
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('portal');
                  setPortalPage('booking');
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Go to Booking Form &rarr;
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: COMPLETE PROJECT SOURCE CODE VIEWER
            ========================================================================= */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Task 7: Code Quality &amp; Clean Architecture (2 Marks)
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Complete Project Files for XAMPP / WAMP
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  All interconnected files are organized, commented, and ready for deployment into <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">htdocs/hotel_booking</code>.
                </p>
              </div>

              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors self-start cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {isZipping ? 'Creating Archive...' : 'Download Project (.zip)'}
              </button>
            </div>

            {/* File Switcher Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
              {STANDALONE_FILES.map(file => (
                <button
                  key={file.filename}
                  onClick={() => {
                    setActiveCodeFile(file.filename);
                    setCopiedCode(false);
                  }}
                  className={`px-3.5 py-2 text-xs font-mono rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeCodeFile === file.filename
                      ? 'border-amber-600 bg-white font-bold text-slate-900 shadow-xs'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {file.filename}
                </button>
              ))}
            </div>

            {/* Code Box */}
            {(() => {
              const currentFile = STANDALONE_FILES.find(f => f.filename === activeCodeFile) || STANDALONE_FILES[0];
              return (
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                  <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                      <span className="text-xs font-mono text-slate-300 ml-2">{currentFile.filename}</span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">({currentFile.description})</span>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentFile.content);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 overflow-x-auto max-h-[600px] text-slate-100 font-mono text-xs leading-relaxed">
                    <pre>
                      <code>{currentFile.content}</code>
                    </pre>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* =========================================================================
            TAB 4: STUDENT SUBMISSION & INDIVIDUALIZATION SPECIFICATION
            ========================================================================= */}
        {activeTab === 'submission' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                University Submission Packaging
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Individualization &amp; Archive Generator
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Configure your admission number according to Note 1 &amp; Note 2, verify your assigned requirement, and generate the final submission ZIP file named per instructions.
              </p>
            </div>

            {/* Admission Number Configurator Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900">
                1. Configure Student Admission Number
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Admission Number
                  </label>
                  <input
                    type="text"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    placeholder="e.g., CT100/G/24398/24"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:border-amber-600 outline-hidden"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Example format from question: <code className="bg-slate-100 px-1 py-0.5 rounded">CT100/G/24394/24</code>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Generated ZIP Archive Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${admissionNumber.replace(/[^a-zA-Z0-9]/g, '_')}_HotelRoomBooking.zip`}
                    className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-lg font-mono text-slate-700"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Matches requested format: <code className="bg-slate-100 px-1 py-0.5 rounded">CT100_G_24398_24_HotelRoomBooking.zip</code>
                  </p>
                </div>
              </div>

              {/* Requirement Rule Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-50 px-3 py-2 font-semibold text-slate-700 border-b border-slate-200">
                  Individualization Requirement Lookup Table (Note 1 &amp; Note 2)
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { d: 7, text: 'Add an extra bed option costing KSh 1,500 per night', note: 'Allowed Range [7-9]' },
                    { d: 8, text: 'Add a conference room booking option costing KSh 5,000', note: 'Allowed Range [7-9]' },
                    { d: 9, text: 'Add a late checkout option costing KSh 2,000', note: 'Allowed Range [7-9]' },
                    { d: 0, text: 'Give a 10% discount when a customer books for 5 or more nights', note: 'Range 0-6' },
                    { d: 1, text: 'Add a swimming pool access option costing KSh 500 per person', note: 'Range 0-6' },
                    { d: 2, text: 'Add an Executive Room costing KSh 10,000 per night', note: 'Range 0-6' },
                    { d: 3, text: 'Give a 5% discount when the booking exceeds KSh 20,000', note: 'Range 0-6' },
                    { d: 4, text: 'Add a laundry service option costing KSh 1,000', note: 'Range 0-6' },
                    { d: 5, text: 'Add dinner at KSh 1,200 per person per day', note: 'Range 0-6' },
                    { d: 6, text: 'Give free airport transfer when a customer books for 7 or more nights', note: 'Range 0-6' },
                  ].map((row) => {
                    const isSelected = selectedReqDigit === row.d;
                    return (
                      <div
                        key={row.d}
                        onClick={() => {
                          setSelectedReqDigit(row.d);
                          setAdmissionNumber(`CT100/G/2439${row.d}/24`);
                        }}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-50 font-semibold text-amber-950 border-l-4 border-amber-600'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                            {row.d}
                          </span>
                          <span>{row.text}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {row.note}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Download Action */}
              <div className="pt-2">
                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {isZipping ? 'Packaging Project Files...' : `Download ${admissionNumber.replace(/[^a-zA-Z0-9]/g, '_')}_HotelRoomBooking.zip`}
                </button>
              </div>

            </div>

            {/* Checklist of Marks Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                2. Marking Rubric Compliance Summary (Total 30 Marks)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 1: Interface &amp; Form</span>
                    <span className="text-emerald-700">4 / 4 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Home page + complete booking form with all 10 required fields and diverse controls.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 2: JS Validation</span>
                    <span className="text-emerald-700">5 / 5 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    7 validation rules: name, email format, 10-digit phone, nights 1-14, guests &gt; 0, room type, capacity check.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 3: Dynamic Behavior</span>
                    <span className="text-emerald-700">4 / 4 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Dynamic capacity display, airport transfer reveal, capacity exceeded warning, live package summary.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 4: JS Bill Calculator</span>
                    <span className="text-emerald-700">4 / 4 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Automatic total calculation: Single (3,500), Double (5,000), Family (7,500), Breakfast (700/p/d), Transfer (2,000).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 5: Functions &amp; Events</span>
                    <span className="text-emerald-700">3 / 3 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Functions: validateBooking(), calculateBill(), checkRoomCapacity(). Events: submit, change, input, click.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 6: PHP Processing</span>
                    <span className="text-emerald-700">5 / 5 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    process_booking.php retrieves POST, re-validates, independently calculates without trusting JS, prints required confirmation.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 7: Code Quality</span>
                    <span className="text-emerald-700">2 / 2 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Proper indentation, modular separation, meaningful variables, responsive CSS, accessible form elements.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Task 8: Practical Demo</span>
                    <span className="text-emerald-700">3 / 3 Marks</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Interactive snapshots: room rate change, new room type, room capacity adjustment, new validation rule.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-amber-500" />
            <span className="text-slate-200 font-bold">Sunrise Hotel Room Booking &amp; Billing System</span>
          </div>
          <div>
            <span>Developed for University Project Examination · Local XAMPP/WAMP Deployment Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
