import React, { useState, useEffect } from 'react';
import TopNav from './TopNav';
import { MapPin, Calendar, Users, Wallet, Star, Check, ChevronDown, ChevronUp, Plus, Trash2, ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AccommodationOption { id: string; name: string; type: string; pricePerNight: number; amenities: string[]; }
interface TransportOption    { id: string; mode: string; pricePerDay: number; note: string; }
interface MealPlanOption     { id: string; plan: string; pricePerDayPerPerson: number; description: string; }
interface ActivityAddon      { id: string; name: string; price: number; city: string; category: string; }

interface CustomizationOptions {
  accommodation: AccommodationOption[];
  transport: TransportOption[];
  mealPlans: MealPlanOption[];
  activities: ActivityAddon[];
}

// ─── Mini Components ──────────────────────────────────────────────────────────
const CITIES = ['Varanasi', 'Agra', 'Lucknow', 'Mathura', 'Prayagraj'];
const STYLES = [
  { id: 'budget', label: 'Budget', icon: '🎒', desc: 'Max savings, local experience' },
  { id: 'balanced', label: 'Balanced', icon: '⚖️', desc: 'Best value for comfort' },
  { id: 'comfort', label: 'Comfort', icon: '🏨', desc: 'Mid-range, relaxed pace' },
  { id: 'luxury', label: 'Luxury', icon: '👑', desc: 'Premium everything' },
];

const SelectCard = ({ selected, onClick, children, className = '' }: any) => (
  <div
    onClick={onClick}
    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200
      ${selected
        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(79,156,249,0.15)]'
        : 'border-white/5 bg-card hover:border-white/20'
      } ${className}`}
  >
    {children}
  </div>
);

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepBar = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: total }, (_, i) => (
      <React.Fragment key={i}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
          ${i < current ? 'bg-secondary text-background' : i === current ? 'bg-primary text-white' : 'bg-surface border border-white/10 text-gray-500'}`}>
          {i < current ? <Check className="w-4 h-4" /> : i + 1}
        </div>
        {i < total - 1 && <div className={`flex-1 h-0.5 transition-all ${i < current ? 'bg-secondary' : 'bg-white/10'}`} />}
      </React.Fragment>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ItineraryBuilder = () => {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('Varanasi');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [travelStyle, setTravelStyle] = useState('balanced');
  const [options, setOptions] = useState<CustomizationOptions | null>(null);
  const [selectedAccom, setSelectedAccom] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [costPreview, setCostPreview] = useState<any>(null);
  const [builtItinerary, setBuiltItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');

  const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

  // Fetch options when city changes
  useEffect(() => {
    fetch(`${API}/itinerary/options/${city}`)
      .then(r => r.json())
      .then(data => {
        setOptions(data.data);
        setSelectedAccom(data.data.accommodation[1]?.id || '');
        setSelectedTransport(data.data.transport[2]?.id || '');
        setSelectedMeal(data.data.mealPlans[1]?.id || '');
        setSelectedActivities([]);
        setCostPreview(null);
      })
      .catch(console.error);
  }, [city]);

  // Live cost calculation
  useEffect(() => {
    if (!selectedAccom || !selectedTransport || !selectedMeal) return;
    fetch(`${API}/itinerary/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: city, days, travelers, accommodationId: selectedAccom, transportId: selectedTransport, mealPlanId: selectedMeal, activityIds: selectedActivities })
    }).then(r => r.json()).then(d => setCostPreview(d.data)).catch(console.error);
  }, [city, days, travelers, selectedAccom, selectedTransport, selectedMeal, selectedActivities]);

  const buildItinerary = async () => {
    setLoading(true);
    const res = await fetch(`${API}/itinerary/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: city, days, travelers, accommodationId: selectedAccom, transportId: selectedTransport, mealPlanId: selectedMeal, activityIds: selectedActivities, travelStyle })
    });
    const data = await res.json();
    setBuiltItinerary(data.data);
    setLoading(false);
    setStep(4);
  };

  const confirmBooking = async () => {
    if (!builtItinerary) return;
    setLoading(true);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationName: city,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days, travelers,
        accommodationId: selectedAccom,
        accommodationName: options?.accommodation.find(a => a.id === selectedAccom)?.name,
        transportId: selectedTransport,
        transportMode: options?.transport.find(t => t.id === selectedTransport)?.mode,
        mealPlanId: selectedMeal,
        mealPlanName: options?.mealPlans.find(m => m.id === selectedMeal)?.plan,
        activityIds: selectedActivities,
        totalCost: builtItinerary.costSummary.total,
      })
    });
    const data = await res.json();
    setConfirmationId(data.data?.confirmationId || 'TCO-XXXX');
    setBookingDone(true);
    setLoading(false);
  };

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const fmt = (n: number) => `₹${n?.toLocaleString('en-IN') || 0}`;

  // ─── BOOKING CONFIRMED SCREEN ─────────────────────────────────────────────
  if (bookingDone) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <TopNav />
        <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center mb-6 animate-bounce">
            <Check className="w-12 h-12 text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-white font-display mb-3">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-2">Your {days}-day {city} trip has been booked.</p>
          <div className="mt-4 bg-card border border-secondary/30 rounded-2xl px-8 py-4 inline-block">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Confirmation ID</p>
            <p className="text-3xl font-bold text-secondary tracking-widest">{confirmationId}</p>
          </div>
          <button onClick={() => { setBookingDone(false); setStep(0); }} className="mt-8 px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
            Plan Another Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white font-display mb-2">✨ Itinerary Builder</h1>
          <p className="text-gray-400">Customize every detail of your Uttar Pradesh trip.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: Steps ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <StepBar current={step} total={5} />

            {/* STEP 0: Basics */}
            {step === 0 && (
              <div className="glass rounded-2xl p-6 space-y-6">
                <h2 className="text-2xl font-bold text-white font-display">Where & When?</h2>

                <div>
                  <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Choose Destination</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CITIES.map(c => (
                      <SelectCard key={c} selected={city === c} onClick={() => setCity(c)}>
                        <p className="font-medium text-white">{c}</p>
                        <p className="text-xs text-gray-400 mt-1">Uttar Pradesh</p>
                      </SelectCard>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block uppercase tracking-wider">Days</label>
                    <div className="flex items-center gap-3 bg-surface rounded-xl p-3 border border-white/5">
                      <button onClick={() => setDays(d => Math.max(1, d - 1))} className="w-8 h-8 rounded-lg bg-card text-white hover:bg-white/10 font-bold transition-colors">-</button>
                      <span className="flex-1 text-center text-xl font-bold text-white">{days}</span>
                      <button onClick={() => setDays(d => Math.min(14, d + 1))} className="w-8 h-8 rounded-lg bg-card text-white hover:bg-white/10 font-bold transition-colors">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block uppercase tracking-wider">Travelers</label>
                    <div className="flex items-center gap-3 bg-surface rounded-xl p-3 border border-white/5">
                      <button onClick={() => setTravelers(t => Math.max(1, t - 1))} className="w-8 h-8 rounded-lg bg-card text-white hover:bg-white/10 font-bold transition-colors">-</button>
                      <span className="flex-1 text-center text-xl font-bold text-white">{travelers}</span>
                      <button onClick={() => setTravelers(t => Math.min(20, t + 1))} className="w-8 h-8 rounded-lg bg-card text-white hover:bg-white/10 font-bold transition-colors">+</button>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Travel Style</p>
                  <div className="grid grid-cols-2 gap-3">
                    {STYLES.map(s => (
                      <SelectCard key={s.id} selected={travelStyle === s.id} onClick={() => setTravelStyle(s.id)}>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{s.icon}</span>
                          <div>
                            <p className="font-medium text-white">{s.label}</p>
                            <p className="text-xs text-gray-400">{s.desc}</p>
                          </div>
                        </div>
                      </SelectCard>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Accommodation */}
            {step === 1 && options && (
              <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white font-display">🏨 Choose Accommodation</h2>
                {options.accommodation.map(acc => (
                  <SelectCard key={acc.id} selected={selectedAccom === acc.id} onClick={() => setSelectedAccom(acc.id)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">{acc.name}</p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{acc.type} tier</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {acc.amenities.map(a => (
                            <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{a}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xl font-bold text-white">{fmt(acc.pricePerNight)}</p>
                        <p className="text-xs text-gray-400">/ night</p>
                        <p className="text-sm text-secondary mt-1">{fmt(acc.pricePerNight * days)} total</p>
                      </div>
                    </div>
                  </SelectCard>
                ))}
              </div>
            )}

            {/* STEP 2: Transport + Meals */}
            {step === 2 && options && (
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-white font-display">🚗 Transport</h2>
                  {options.transport.map(tr => (
                    <SelectCard key={tr.id} selected={selectedTransport === tr.id} onClick={() => setSelectedTransport(tr.id)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{tr.mode}</p>
                          <p className="text-xs text-gray-400 mt-1">{tr.note}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{fmt(tr.pricePerDay)}/day</p>
                          <p className="text-sm text-secondary">{fmt(tr.pricePerDay * days)} total</p>
                        </div>
                      </div>
                    </SelectCard>
                  ))}
                </div>

                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-white font-display">🍛 Meal Plan</h2>
                  {options.mealPlans.map(mp => (
                    <SelectCard key={mp.id} selected={selectedMeal === mp.id} onClick={() => setSelectedMeal(mp.id)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{mp.plan}</p>
                          <p className="text-xs text-gray-400 mt-1">{mp.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{mp.pricePerDayPerPerson === 0 ? 'Free' : `${fmt(mp.pricePerDayPerPerson)}/person/day`}</p>
                          {mp.pricePerDayPerPerson > 0 && <p className="text-sm text-secondary">{fmt(mp.pricePerDayPerPerson * days * travelers)} total</p>}
                        </div>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Activities */}
            {step === 3 && options && (
              <div className="glass rounded-2xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white font-display">🎯 Add Activities</h2>
                <p className="text-gray-400 text-sm">Select optional experiences to add to your itinerary</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.activities.map(act => {
                    const picked = selectedActivities.includes(act.id);
                    return (
                      <SelectCard key={act.id} selected={picked} onClick={() => toggleActivity(act.id)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-white text-sm">{act.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-white/10 text-gray-400 mt-1 inline-block">{act.category}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-white">{act.price === 0 ? 'Free' : fmt(act.price)}</p>
                            {picked && <Check className="w-4 h-4 text-secondary ml-auto mt-1" />}
                          </div>
                        </div>
                      </SelectCard>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Itinerary Preview */}
            {step === 4 && builtItinerary && (
              <div className="space-y-4">
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white font-display mb-1">📅 Your Custom Itinerary</h2>
                  <p className="text-gray-400 text-sm mb-6">{builtItinerary.days}-day {builtItinerary.cityName} | {travelers} traveler{travelers > 1 ? 's' : ''} | {builtItinerary.travelStyle} style</p>
                  <div className="space-y-4">
                    {builtItinerary.dayPlans.map((day: any) => (
                      <div key={day.day} className="bg-card rounded-xl border border-white/5 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">{day.day}</div>
                          <div>
                            <p className="font-semibold text-white">{day.title}</p>
                            <p className="text-xs text-gray-400">{day.transport} · {day.meals}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {day.schedule.map((slot: any, idx: number) => (
                            <div key={idx} className="flex gap-3">
                              <span className="text-xs text-primary w-20 shrink-0 mt-0.5">{slot.time}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-300">{slot.label}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {slot.items.map((item: any, ii: number) => (
                                    <span key={ii} className="text-xs bg-surface px-2 py-0.5 rounded-full text-gray-400 border border-white/5">{item.name}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              {step > 0 && step < 4 ? (
                <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors">
                  ← Back
                </button>
              ) : <div />}

              {step < 3 && (
                <button onClick={() => setStep(s => s + 1)} className="px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {step === 3 && (
                <button onClick={buildItinerary} disabled={loading} className="px-8 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {loading ? 'Building...' : 'Build My Itinerary ✨'}
                </button>
              )}
              {step === 4 && (
                <button onClick={confirmBooking} disabled={loading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 glow-primary">
                  {loading ? 'Booking...' : '🎉 Confirm & Book'}
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: Cost Summary ──────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white font-display mb-4">💰 Cost Summary</h3>
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm text-gray-400"><span>Destination</span><span className="text-white font-medium">{city}</span></div>
                <div className="flex justify-between text-sm text-gray-400"><span>Duration</span><span className="text-white font-medium">{days} days</span></div>
                <div className="flex justify-between text-sm text-gray-400"><span>Travelers</span><span className="text-white font-medium">{travelers}</span></div>
                <div className="flex justify-between text-sm text-gray-400"><span>Style</span><span className="text-white font-medium capitalize">{travelStyle}</span></div>
              </div>
              <div className="border-t border-white/5 pt-4 space-y-2">
                {costPreview ? (
                  <>
                    {Object.entries(costPreview.breakdown).map(([key, val]: any) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{key}</span>
                        <span className="text-white">{fmt(val.total)}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">{fmt(costPreview.total)}</span>
                      </div>
                      <p className="text-xs text-gray-400 text-right mt-1">{fmt(costPreview.perPerson)} per person</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Configure your trip to see pricing</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItineraryBuilder;
