import { Clock, HeartHandshake, MapPin, Stethoscope, BedDouble, UtensilsCrossed, type LucideIcon } from "lucide-react";

export const glanceIcons: Record<string, LucideIcon> = {
  care: Clock,
  medical: Stethoscope,
  rooms: BedDouble,
  meals: UtensilsCrossed,
  family: HeartHandshake,
  location: MapPin,
};
