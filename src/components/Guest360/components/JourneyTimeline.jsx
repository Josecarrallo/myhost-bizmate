import React from 'react';
import {
  CheckCircle,
  Clock,
  Bell,
  Home,
  Coffee,
  LogOut,
  Star,
} from 'lucide-react';
import { JOURNEY_STEPS } from '../constants';

/**
 * Journey Timeline - 7 pasos del journey del huésped
 * Horizontal en desktop, vertical en móvil
 *
 * Steps: confirmed → pre_arrival_7d → pre_arrival_48h → checkin → in_stay → checkout → post_stay
 */
const JourneyTimeline = ({ journeyEvents = [], booking }) => {
  // Map journey events to steps
  const getStepStatus = (stepId, eventType) => {
    // First check if we have a specific journey event
    const event = journeyEvents.find(
      e => e.step === stepId || e.event_type === eventType || e.event_type === stepId
    );
    if (event) {
      return {
        completed: true,
        timestamp: event.created_at || event.timestamp,
      };
    }

    // Infer from booking data
    if (booking) {
      const now = new Date();
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      const sevenDaysBefore = new Date(checkIn.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoDaysBefore = new Date(checkIn.getTime() - 2 * 24 * 60 * 60 * 1000);

      switch (stepId) {
        case 'confirmed':
          return {
            completed: ['confirmed', 'checked_in', 'pending_payment', 'partial_payment'].includes(booking.status),
            timestamp: booking.created_at,
          };
        case 'pre_arrival_7d':
          return {
            completed: now >= sevenDaysBefore,
            timestamp: now >= sevenDaysBefore ? sevenDaysBefore.toISOString() : null,
          };
        case 'pre_arrival_48h':
          return {
            completed: now >= twoDaysBefore,
            timestamp: now >= twoDaysBefore ? twoDaysBefore.toISOString() : null,
          };
        case 'checkin':
          return {
            completed: booking.status === 'checked_in' || now >= checkIn,
            timestamp: now >= checkIn ? booking.check_in : null,
          };
        case 'in_stay':
          return {
            completed: now > checkIn && now < checkOut,
            timestamp: now > checkIn ? null : null, // No specific timestamp
          };
        case 'checkout':
          return {
            completed: now >= checkOut,
            timestamp: now >= checkOut ? booking.check_out : null,
          };
        case 'post_stay':
          return {
            completed: now > checkOut,
            timestamp: now > checkOut ? checkOut.toISOString() : null,
          };
        default:
          return { completed: false, timestamp: null };
      }
    }

    return { completed: false, timestamp: null };
  };

  // Icon map for each step
  const iconMap = {
    confirmed: CheckCircle,
    pre_arrival_7d: Clock,
    pre_arrival_48h: Bell,
    checkin: Home,
    in_stay: Coffee,
    checkout: LogOut,
    post_stay: Star,
  };

  // Calculate current step index
  const getCurrentStepIndex = () => {
    for (let i = JOURNEY_STEPS.length - 1; i >= 0; i--) {
      const step = JOURNEY_STEPS[i];
      const status = getStepStatus(step.id, step.event);
      if (status.completed) {
        return i;
      }
    }
    return -1;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
      <h3 className="text-sm font-semibold text-white mb-5">
        Guest Journey
      </h3>

      {/* Desktop: Horizontal timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#3a434f]" />

          {/* Progress line */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-[#f5791f] transition-all duration-500"
            style={{
              width: `${currentStepIndex >= 0 ? ((currentStepIndex + 1) / JOURNEY_STEPS.length) * 100 : 0}%`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {JOURNEY_STEPS.map((step, index) => {
              const status = getStepStatus(step.id, step.event);
              const Icon = iconMap[step.id] || CheckCircle;
              const isActive = index === currentStepIndex;
              const isCompleted = status.completed;
              const isPast = index < currentStepIndex;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / JOURNEY_STEPS.length}%` }}
                >
                  {/* Icon circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-300 z-10
                      ${isActive
                        ? 'bg-[#f5791f] text-white ring-4 ring-[#f5791f]/30'
                        : isCompleted || isPast
                        ? 'bg-[#f5791f] text-white'
                        : 'bg-[#3a434f] text-[#6d7683]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Label */}
                  <p
                    className={`
                      mt-2 text-[10px] uppercase tracking-wider text-center
                      ${isActive
                        ? 'text-[#f5791f] font-semibold'
                        : isCompleted || isPast
                        ? 'text-white'
                        : 'text-[#6d7683]'
                      }
                    `}
                  >
                    {step.label}
                  </p>

                  {/* Timestamp */}
                  {status.timestamp && (
                    <p className="mt-1 text-[9px] text-[#8a93a1]">
                      {new Date(status.timestamp).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="md:hidden">
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-[#3a434f]" />

          {/* Progress line */}
          <div
            className="absolute left-[11px] top-0 w-0.5 bg-[#f5791f] transition-all duration-500"
            style={{
              height: `${currentStepIndex >= 0 ? ((currentStepIndex + 1) / JOURNEY_STEPS.length) * 100 : 0}%`,
            }}
          />

          {/* Steps */}
          <div className="space-y-4">
            {JOURNEY_STEPS.map((step, index) => {
              const status = getStepStatus(step.id, step.event);
              const Icon = iconMap[step.id] || CheckCircle;
              const isActive = index === currentStepIndex;
              const isCompleted = status.completed;
              const isPast = index < currentStepIndex;

              return (
                <div key={step.id} className="relative flex items-start gap-3">
                  {/* Icon circle */}
                  <div
                    className={`
                      absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center
                      transition-all duration-300 z-10
                      ${isActive
                        ? 'bg-[#f5791f] text-white ring-2 ring-[#f5791f]/30'
                        : isCompleted || isPast
                        ? 'bg-[#f5791f] text-white'
                        : 'bg-[#3a434f] text-[#6d7683]'
                      }
                    `}
                  >
                    <Icon className="w-3 h-3" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <p
                      className={`
                        text-xs font-semibold
                        ${isActive
                          ? 'text-[#f5791f]'
                          : isCompleted || isPast
                          ? 'text-white'
                          : 'text-[#6d7683]'
                        }
                      `}
                    >
                      {step.label}
                    </p>

                    {status.timestamp && (
                      <p className="text-[10px] text-[#8a93a1] mt-0.5">
                        {new Date(status.timestamp).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* No booking state */}
      {!booking && journeyEvents.length === 0 && (
        <div className="text-center py-4">
          <p className="text-[#6d7683] text-sm">
            No journey information available
          </p>
        </div>
      )}
    </div>
  );
};

export default JourneyTimeline;
