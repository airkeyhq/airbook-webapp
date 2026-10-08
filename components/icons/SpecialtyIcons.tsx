import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * AirBook Specialty Icons System
 * Built on a 24x24 pixel grid with 1.5px stroke width, rounded caps and joins.
 * Matches Apple SF Symbols & Microsoft Fluent System geometry with authentic industry metaphors.
 */

// 1. Peluquerías: Classic Salon Shears / Scissors
export const SalonScissorsIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Left finger ring */}
    <circle cx="6.5" cy="18" r="2.75" />
    {/* Right finger ring */}
    <circle cx="17.5" cy="18" r="2.75" />
    {/* Shears pivot screw */}
    <circle cx="12" cy="11.5" r="0.75" fill="currentColor" />
    {/* Cutting blade 1: bottom-left ring to top-right tip */}
    <path d="M8.5 15.75L12 11.5L16.75 4" />
    {/* Cutting blade 2: bottom-right ring to top-left tip */}
    <path d="M15.5 15.75L12 11.5L7.25 4" />
  </svg>
);

// 2. Barberías: Classic Gentleman Barbershop Handlebar Mustache (Bigote Clásico de Barbero)
export const BarberMustacheIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Iconic Handlebar Mustache: sculpted curves with upturned waxed tips */}
    <path d="M12 11.5C10.2 9.5 6.5 9 3 11C2.2 11.5 2 12.6 2.5 13.4C3.2 14.5 5 15.5 7.5 15C10 14.5 11.2 13 12 11.5Z" />
    <path d="M12 11.5C13.8 9.5 17.5 9 21 11C21.8 11.5 22 12.6 21.5 13.4C20.8 14.5 19 15.5 16.5 15C14 14.5 12.8 13 12 11.5Z" />
    {/* Elegant upturned waxed curled tips */}
    <path d="M2.5 13C2 12.2 2.2 10.8 3.5 10.2" />
    <path d="M21.5 13C22 12.2 21.8 10.8 20.5 10.2" />
  </svg>
);

export const BarberRazorIcon = BarberMustacheIcon;

// 3. MedSpas: Aesthetic Facial Glow & Botanical Lotus Leaf
export const MedSpaIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Center rejuvenation petal / botanical droplet */}
    <path d="M12 3.5C12 3.5 7.5 9 7.5 13.5C7.5 16 9.5 18 12 18C14.5 18 16.5 16 16.5 13.5C16.5 9 12 3.5 12 3.5Z" />
    {/* Left spa contour wing */}
    <path d="M4.5 14C4.5 16.5 6.5 18.5 9 18.5C9.8 18.5 10.6 18.3 11.2 17.8" />
    {/* Right spa contour wing */}
    <path d="M19.5 14C19.5 16.5 17.5 18.5 15 18.5C14.2 18.5 13.4 18.3 12.8 17.8" />
    {/* Base wellness resting curve */}
    <path d="M6 21C8 21.8 10 22 12 22C14 22 16 21.8 18 21" />
  </svg>
);

// 4. Uñas y Pestañas: Luxury Nail Polish & Curved Eyelashes
export const NailAndLashesIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Cap handle */}
    <rect x="9.5" y="3" width="5" height="6.5" rx="1" />
    {/* Brush neck */}
    <path d="M11 9.5V11.5H13V9.5" />
    {/* Glass bottle base */}
    <rect x="7" y="11.5" width="10" height="9.5" rx="2" />
    {/* Polish fill level & shine accent */}
    <path d="M9.5 15.5V18.5" />
    <path d="M18.5 5.5C19.5 6 20.5 7 21 8.5" />
    <path d="M19.5 3.5L18.5 5.5" />
    <path d="M21.5 5.5L20.5 7.5" />
  </svg>
);

// 5. Tatuajes: Rotary Tattoo Pen & Needle Tip
export const TattooMachineIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Tattoo pen cylindrical chassis */}
    <path d="M14.5 4.5L19.5 9.5L10 19L5 14L14.5 4.5Z" />
    {/* Motor cap top */}
    <path d="M16 3L21 8" />
    {/* Grip knurling band */}
    <path d="M8 11L13 16" />
    {/* Tapered cartridge nozzle */}
    <path d="M7.5 16.5L4 20L3.5 20.5" />
    {/* Micro needle tip */}
    <path d="M3.5 20.5L2.5 21.5" />
  </svg>
);

// 6. Masajes: Zen Balanced Hot Stones with Therapeutic Steam
export const MassageZenIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Large bottom base stone */}
    <ellipse cx="12" cy="19" rx="8" ry="3" />
    {/* Middle balanced stone */}
    <ellipse cx="12" cy="13.5" rx="6" ry="2.5" />
    {/* Top pinnacle stone */}
    <ellipse cx="12" cy="8.75" rx="4" ry="2" />
    {/* Calming steam whisper waves */}
    <path d="M10 4.5C9.5 3.5 10.5 2.5 10 1.5" />
    <path d="M14 4.5C13.5 3.5 14.5 2.5 14 1.5" />
  </svg>
);

// 7. Peluquería Canina: Puppy Paw Print with Grooming Cleanliness
export const PetGroomingPawIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Main metacarpal pad */}
    <path d="M12 13C9.8 13 8 15 8.5 17.5C8.8 19 10.2 20.5 12 20.5C13.8 20.5 15.2 19 15.5 17.5C16 15 14.2 13 12 13Z" />
    {/* Leftmost toe pad */}
    <ellipse cx="5.5" cy="12.5" rx="1.75" ry="2.25" transform="rotate(-20 5.5 12.5)" />
    {/* Middle-left toe pad */}
    <ellipse cx="9" cy="8.5" rx="1.75" ry="2.5" transform="rotate(-8 9 8.5)" />
    {/* Middle-right toe pad */}
    <ellipse cx="15" cy="8.5" rx="1.75" ry="2.5" transform="rotate(8 15 8.5)" />
    {/* Rightmost toe pad */}
    <ellipse cx="18.5" cy="12.5" rx="1.75" ry="2.25" transform="rotate(20 18.5 12.5)" />
  </svg>
);

// 8. Fitness: Cast Iron Gym Dumbbell
export const FitnessDumbbellIcon: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Center barbell grip */}
    <path d="M8 12H16" />
    {/* Left inner weight plate */}
    <rect x="6.5" y="7" width="1.5" height="10" rx="0.75" />
    {/* Left outer weight plate */}
    <rect x="4" y="8.5" width="1.5" height="7" rx="0.75" />
    {/* Left collar tip */}
    <path d="M3 10.5V13.5" />
    {/* Right inner weight plate */}
    <rect x="16" y="7" width="1.5" height="10" rx="0.75" />
    {/* Right outer weight plate */}
    <rect x="18.5" y="8.5" width="1.5" height="7" rx="0.75" />
    {/* Right collar tip */}
    <path d="M21 10.5V13.5" />
  </svg>
);
