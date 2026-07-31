import React from 'react';
import {
  Phone,
  Mail,
  Globe,
  Languages,
} from 'lucide-react';
import { Badge } from './shared';

/**
 * Guest Header - Avatar + name + badges + contact (simplified per Gita feedback)
 */
const GuestHeader = ({
  guest,
  bookings = [],
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
    <div className="bg-[#333b47] rounded-2xl border border-white/10 p-4 md:p-5">
      <div className="flex items-start gap-4">
        {/* Avatar - consistent with GuestSelector (w-12 h-12) */}
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-white text-lg md:text-xl font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(140deg, #f5791f 0%, #f2b04a 100%)',
          }}
        >
          {initials}
        </div>

        {/* Name + Badges + Contact */}
        <div className="flex-1 min-w-0">
          {/* Name - consistent with GuestSelector title */}
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2 truncate">
            {name}
          </h1>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* VIP Badge */}
            {isVIP && (
              <Badge variant="accent" size="sm">
                VIP
              </Badge>
            )}

            {/* Repeat guest badge */}
            {isRepeat && (
              <Badge variant="neutral" size="sm">
                {stayNumber} stays
              </Badge>
            )}
          </div>

          {/* Contact line */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#aab2bf]">
            {/* Phone */}
            {phone && (
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-4 h-4 text-[#6d7683]" />
                {phone}
              </span>
            )}

            {/* Email */}
            {email && (
              <span className="flex items-center gap-1.5 truncate max-w-[220px]">
                <Mail className="w-4 h-4 text-[#6d7683]" />
                {email}
              </span>
            )}

            {/* Nationality */}
            {nationality && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#6d7683]" />
                {nationality}
              </span>
            )}

            {/* Language with green dot */}
            {language && (
              <span className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#6d7683]" />
                {language.toUpperCase()}
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestHeader;
