import React from 'react';
import {
  MessageCircle,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Globe,
  Languages,
} from 'lucide-react';
import { Badge } from './shared';

/**
 * Guest Header - Avatar + name + badges + contact + actions
 */
const GuestHeader = ({
  guest,
  bookings = [],
  onMessageWhatsApp,
  onNewBooking,
  onMoreActions,
}) => {
  // Guest info
  const name = guest?.name || bookings[0]?.guest_name || 'Huésped';
  const phone = guest?.phone || bookings[0]?.guest_phone || '';
  const email = guest?.email || bookings[0]?.guest_email || '';
  const nationality = guest?.nationality || '';
  const language = guest?.language || '';

  // Calculate badges
  const totalBookings = guest?.total_bookings || bookings.length;
  const isVIP = guest?.total_spent > 2000 || guest?.avg_rating >= 4.8;
  const isRepeat = totalBookings >= 2;
  const stayNumber = totalBookings > 0 ? totalBookings : 1;

  // Get initials
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#333b47] rounded-2xl border border-white/80 p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(140deg, #f5791f 0%, #f2b04a 100%)',
            }}
          >
            {initials}
          </div>

          {/* Name + Badges + Contact */}
          <div className="flex-1 min-w-0">
            {/* Name + Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                {name}
              </h1>

              {/* VIP Badge */}
              {isVIP && (
                <Badge variant="accent" size="sm">
                  VIP
                </Badge>
              )}

              {/* Repeat guest badge */}
              {isRepeat && (
                <Badge variant="neutral" size="sm">
                  Repeat · {stayNumber} stays
                </Badge>
              )}
            </div>

            {/* Contact line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#aab2bf]">
              {/* Phone */}
              {phone && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#6d7683]" />
                  {phone}
                </span>
              )}

              {/* Email */}
              {email && (
                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                  <Mail className="w-3.5 h-3.5 text-[#6d7683]" />
                  {email}
                </span>
              )}

              {/* Nationality */}
              {nationality && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#6d7683]" />
                  {nationality}
                </span>
              )}

              {/* Language with green dot */}
              {language && (
                <span className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-[#6d7683]" />
                  {language.toUpperCase()}
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Primary: WhatsApp */}
          <button
            onClick={onMessageWhatsApp}
            className="
              flex items-center gap-2 px-4 py-2.5
              bg-[#f5791f] hover:bg-[#e06a10]
              text-white font-semibold text-sm
              rounded-xl transition-colors
              min-h-[44px]
            "
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* Secondary: New booking */}
          <button
            onClick={onNewBooking}
            className="
              flex items-center gap-2 px-4 py-2.5
              bg-transparent hover:bg-[#3a434f]
              border border-white/50 hover:border-white/70
              text-[#aab2bf] hover:text-white font-semibold text-sm
              rounded-xl transition-colors
              min-h-[44px]
            "
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>

          {/* Icon: More */}
          <button
            onClick={onMoreActions}
            className="
              p-2.5
              bg-[#3a434f] hover:bg-[#434d5a]
              text-[#aab2bf] hover:text-white
              rounded-xl transition-colors
              min-h-[44px] min-w-[44px]
              flex items-center justify-center
            "
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestHeader;
