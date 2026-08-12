'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';
import { useAirBookStore } from '@/lib/store';
import {
  Cut24Regular,
  Clock24Regular,
  Money24Regular,
  Calendar24Filled,
  Calendar24Regular,
  Person24Regular,
  CheckmarkCircle24Regular,
  CheckmarkCircle24Filled,
  Sparkle24Regular,
  ArrowLeft24Filled,
  ArrowRight24Filled,
  Shield24Regular,
  Phone24Regular,
  Location24Regular,
} from '@fluentui/react-icons';

export default function PublicBookingPage({ params }: { params: Promise<{ slug?: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams?.slug || 'default';
  const { workspaceName, services, staffMembers, addAppointment } = useAirBookStore();

  // Booking Flow Steps: 1 = Service, 2 = Staff, 3 = Date & Time, 4 = Details & Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected State
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(staffMembers[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('11:00');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedStaff = staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];

  // Available Time Slots Mock
  const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:30', '16:00', '17:15'];
  const DATE_OPTIONS = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const [submitting, setSubmitting] = useState(false);

  const handleConfirmBooking = async () => {
    if (!clientName.trim() || !clientEmail.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          staffId: selectedStaff.id,
          dateStr: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedSlotTime,
          durationMinutes: selectedService.durationMinutes,
          price: selectedService.price,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          notes: `Public online booking via /book/${slug}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        addAppointment({
          clientName: clientName.trim(),
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          staffId: selectedStaff.id,
          staffName: selectedStaff.name,
          dateStr: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedSlotTime,
          durationMinutes: selectedService.durationMinutes,
          price: selectedService.price,
          color: selectedService.color,
          status: 'confirmed',
          notes: `Booked via Public Web Link. Phone: ${clientPhone}`,
        });
      }
    } catch (e) {
      console.error('Error creating public booking:', e);
    } finally {
      setSubmitting(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] text-[var(--canvas-fg)] flex flex-col items-center justify-start p-4 sm:p-6 relative">
      {/* Background Glass Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Booking Container */}
      <div className="w-full max-w-xl glass-panel rounded-[32px] p-6 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/10 z-10 relative mt-4 sm:mt-8">
        
        {/* Workspace Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              A
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--text-primary)]">
                {workspaceName}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                <Location24Regular className="w-3 h-3" />
                <span>Downtown District • Instant Web Booking</span>
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            Open
          </span>
        </div>

        {/* Progress Step Indicator */}
        {!isSuccess && (
          <div className="flex items-center justify-between py-4 border-b border-black/5 dark:border-white/5 text-xs font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 mr-1"
                >
                  <ArrowLeft24Filled className="w-4 h-4" />
                </button>
              )}
              <span>Step {step} of 4</span>
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {step === 1 && 'Select Service'}
              {step === 2 && 'Select Specialist'}
              {step === 3 && 'Pick Date & Time'}
              {step === 4 && 'Confirm & Contact'}
            </span>
          </div>
        )}

        {/* Success View */}
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-10 text-center flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <CheckmarkCircle24Regular className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Appointment Confirmed!
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              Your booking for <strong className="text-[var(--text-primary)]">{selectedService?.name}</strong> with <strong className="text-[var(--text-primary)]">{selectedStaff?.name}</strong> on <strong className="text-[var(--text-primary)]">{format(selectedDate, 'EEEE, MMM d')} at {selectedSlotTime}</strong> has been saved.
            </p>
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-xs text-left w-full space-y-2 mt-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Client:</span>
                <span className="font-bold text-[var(--text-primary)]">{clientName} ({clientPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Deposit Paid:</span>
                <span className="font-bold text-green-600 dark:text-green-400">${Math.round((selectedService?.price || 0) * 0.2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Remaining Balance at Shop:</span>
                <span className="font-bold text-[var(--text-primary)]">${(selectedService?.price || 0) - Math.round((selectedService?.price || 0) * 0.2)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
              }}
              className="mt-4 px-6 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md"
            >
              Book Another Appointment
            </button>
          </motion.div>
        ) : (
          <div className="py-4">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Select a Service
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {services.map((srv) => {
                    const isSelected = selectedServiceId === srv.id;
                    return (
                      <motion.div
                        key={srv.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedServiceId(srv.id);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md font-bold'
                            : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: srv.color }}
                          />
                          <div>
                            <h4 className="text-xs font-bold text-[var(--text-primary)]">{srv.name}</h4>
                            <p className="text-[10px] text-[var(--text-secondary)]">{srv.durationMinutes} mins · {srv.category}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                          ${srv.price}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Continue to Specialist</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Select Specialist */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Select Your Specialist
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {staffMembers.map((stf) => {
                    const isSelected = selectedStaffId === stf.id;
                    return (
                      <motion.div
                        key={stf.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedStaffId(stf.id)}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md font-bold'
                            : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5'
                        }`}
                      >
                        <span className="text-3xl">{stf.avatar}</span>
                        <div>
                          <h4 className="text-xs font-bold text-[var(--text-primary)]">{stf.name}</h4>
                          <p className="text-[10px] text-[var(--text-secondary)]">{stf.role}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep(3)}
                  className="w-full mt-4 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Continue to Date & Time</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Date & Time Picker */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Pick Available Date & Slot
                </h3>
                
                {/* Date Options Strip */}
                <div className="grid grid-cols-7 gap-1">
                  {DATE_OPTIONS.map((d) => {
                    const isSelected = isSameDay(d, selectedDate);
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => setSelectedDate(d)}
                        className={`py-2 px-1 rounded-xl text-center flex flex-col items-center transition-all ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-md'
                            : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                        }`}
                      >
                        <span className="text-[9px] uppercase">{format(d, 'EEE')}</span>
                        <span className="text-xs">{format(d, 'd')}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block">
                    Available Times ({format(selectedDate, 'MMM d')})
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const isSelected = selectedSlotTime === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setSelectedSlotTime(t)}
                          className={`py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold shadow-md'
                              : 'bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep(4)}
                  className="w-full mt-4 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Continue to Confirmation</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 4: Contact & Deposit Confirmation */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Your Information & Booking Deposit
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eduardo Moreno"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                        Mobile Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 019-2834"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary Box */}
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 text-xs space-y-1.5">
                  <div className="flex justify-between font-semibold text-[var(--text-primary)]">
                    <span>{selectedService?.name}</span>
                    <span>${selectedService?.price}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)] text-[11px]">
                    <span>With {selectedStaff?.name}</span>
                    <span>{format(selectedDate, 'MMM d')} @ {selectedSlotTime}</span>
                  </div>
                  <div className="border-t border-blue-500/20 pt-1.5 flex justify-between font-bold text-blue-600 dark:text-blue-400">
                    <span>20% Upfront Deposit Required</span>
                    <span>${Math.round((selectedService?.price || 0) * 0.2)}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Shield24Regular className="w-4 h-4" />
                  <span>{submitting ? 'Confirming Booking...' : `Confirm & Pay Deposit ($${Math.round((selectedService?.price || 0) * 0.2)})`}</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
