import { format } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

export interface TimezoneConfig {
  id: string;
  city: string;
  timezone: string;
  label: string;
}

export interface TimeRange {
  startHour: number;
  endHour: number;
}

export const TIMEZONES: TimezoneConfig[] = [
  // North America
  { id: "honolulu", city: "Honolulu", timezone: "Pacific/Honolulu", label: "HST" },
  { id: "anchorage", city: "Anchorage", timezone: "America/Anchorage", label: "AKST" },
  { id: "la", city: "Los Angeles", timezone: "America/Los_Angeles", label: "PST" },
  { id: "sf", city: "San Francisco", timezone: "America/Los_Angeles", label: "PST" },
  { id: "seattle", city: "Seattle", timezone: "America/Los_Angeles", label: "PST" },
  { id: "vancouver", city: "Vancouver", timezone: "America/Vancouver", label: "PST" },
  { id: "denver", city: "Denver", timezone: "America/Denver", label: "MST" },
  { id: "phoenix", city: "Phoenix", timezone: "America/Phoenix", label: "MST" },
  { id: "chicago", city: "Chicago", timezone: "America/Chicago", label: "CST" },
  { id: "dallas", city: "Dallas", timezone: "America/Chicago", label: "CST" },
  { id: "houston", city: "Houston", timezone: "America/Chicago", label: "CST" },
  { id: "mexico-city", city: "Mexico City", timezone: "America/Mexico_City", label: "CST" },
  { id: "nyc", city: "New York", timezone: "America/New_York", label: "EST" },
  { id: "boston", city: "Boston", timezone: "America/New_York", label: "EST" },
  { id: "miami", city: "Miami", timezone: "America/New_York", label: "EST" },
  { id: "toronto", city: "Toronto", timezone: "America/Toronto", label: "EST" },
  { id: "montreal", city: "Montreal", timezone: "America/Montreal", label: "EST" },
  { id: "atlanta", city: "Atlanta", timezone: "America/New_York", label: "EST" },

  // South America
  { id: "bogota", city: "Bogotá", timezone: "America/Bogota", label: "COT" },
  { id: "lima", city: "Lima", timezone: "America/Lima", label: "PET" },
  { id: "santiago", city: "Santiago", timezone: "America/Santiago", label: "CLT" },
  { id: "buenos-aires", city: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", label: "ART" },
  { id: "sao-paulo", city: "São Paulo", timezone: "America/Sao_Paulo", label: "BRT" },
  { id: "rio", city: "Rio de Janeiro", timezone: "America/Sao_Paulo", label: "BRT" },

  // Europe
  { id: "reykjavik", city: "Reykjavik", timezone: "Atlantic/Reykjavik", label: "GMT" },
  { id: "london", city: "London", timezone: "Europe/London", label: "GMT" },
  { id: "dublin", city: "Dublin", timezone: "Europe/Dublin", label: "GMT" },
  { id: "lisbon", city: "Lisbon", timezone: "Europe/Lisbon", label: "WET" },
  { id: "paris", city: "Paris", timezone: "Europe/Paris", label: "CET" },
  { id: "amsterdam", city: "Amsterdam", timezone: "Europe/Amsterdam", label: "CET" },
  { id: "brussels", city: "Brussels", timezone: "Europe/Brussels", label: "CET" },
  { id: "berlin", city: "Berlin", timezone: "Europe/Berlin", label: "CET" },
  { id: "frankfurt", city: "Frankfurt", timezone: "Europe/Berlin", label: "CET" },
  { id: "munich", city: "Munich", timezone: "Europe/Berlin", label: "CET" },
  { id: "zurich", city: "Zurich", timezone: "Europe/Zurich", label: "CET" },
  { id: "vienna", city: "Vienna", timezone: "Europe/Vienna", label: "CET" },
  { id: "prague", city: "Prague", timezone: "Europe/Prague", label: "CET" },
  { id: "warsaw", city: "Warsaw", timezone: "Europe/Warsaw", label: "CET" },
  { id: "rome", city: "Rome", timezone: "Europe/Rome", label: "CET" },
  { id: "milan", city: "Milan", timezone: "Europe/Rome", label: "CET" },
  { id: "madrid", city: "Madrid", timezone: "Europe/Madrid", label: "CET" },
  { id: "barcelona", city: "Barcelona", timezone: "Europe/Madrid", label: "CET" },
  { id: "stockholm", city: "Stockholm", timezone: "Europe/Stockholm", label: "CET" },
  { id: "oslo", city: "Oslo", timezone: "Europe/Oslo", label: "CET" },
  { id: "copenhagen", city: "Copenhagen", timezone: "Europe/Copenhagen", label: "CET" },
  { id: "helsinki", city: "Helsinki", timezone: "Europe/Helsinki", label: "EET" },
  { id: "tallinn", city: "Tallinn", timezone: "Europe/Tallinn", label: "EET" },
  { id: "riga", city: "Riga", timezone: "Europe/Riga", label: "EET" },
  { id: "vilnius", city: "Vilnius", timezone: "Europe/Vilnius", label: "EET" },
  { id: "kyiv", city: "Kyiv", timezone: "Europe/Kyiv", label: "EET" },
  { id: "bucharest", city: "Bucharest", timezone: "Europe/Bucharest", label: "EET" },
  { id: "sofia", city: "Sofia", timezone: "Europe/Sofia", label: "EET" },
  { id: "athens", city: "Athens", timezone: "Europe/Athens", label: "EET" },
  { id: "istanbul", city: "Istanbul", timezone: "Europe/Istanbul", label: "TRT" },
  { id: "moscow", city: "Moscow", timezone: "Europe/Moscow", label: "MSK" },

  // Middle East
  { id: "tel-aviv", city: "Tel Aviv", timezone: "Asia/Tel_Aviv", label: "IST" },
  { id: "jerusalem", city: "Jerusalem", timezone: "Asia/Jerusalem", label: "IST" },
  { id: "beirut", city: "Beirut", timezone: "Asia/Beirut", label: "EET" },
  { id: "riyadh", city: "Riyadh", timezone: "Asia/Riyadh", label: "AST" },
  { id: "doha", city: "Doha", timezone: "Asia/Qatar", label: "AST" },
  { id: "dubai", city: "Dubai", timezone: "Asia/Dubai", label: "GST" },
  { id: "abu-dhabi", city: "Abu Dhabi", timezone: "Asia/Dubai", label: "GST" },
  { id: "tehran", city: "Tehran", timezone: "Asia/Tehran", label: "IRST" },

  // Africa
  { id: "casablanca", city: "Casablanca", timezone: "Africa/Casablanca", label: "WET" },
  { id: "cairo", city: "Cairo", timezone: "Africa/Cairo", label: "EET" },
  { id: "lagos", city: "Lagos", timezone: "Africa/Lagos", label: "WAT" },
  { id: "nairobi", city: "Nairobi", timezone: "Africa/Nairobi", label: "EAT" },
  { id: "johannesburg", city: "Johannesburg", timezone: "Africa/Johannesburg", label: "SAST" },
  { id: "cape-town", city: "Cape Town", timezone: "Africa/Johannesburg", label: "SAST" },

  // South Asia
  { id: "karachi", city: "Karachi", timezone: "Asia/Karachi", label: "PKT" },
  { id: "mumbai", city: "Mumbai", timezone: "Asia/Kolkata", label: "IST" },
  { id: "delhi", city: "Delhi", timezone: "Asia/Kolkata", label: "IST" },
  { id: "bangalore", city: "Bangalore", timezone: "Asia/Kolkata", label: "IST" },
  { id: "kolkata", city: "Kolkata", timezone: "Asia/Kolkata", label: "IST" },
  { id: "chennai", city: "Chennai", timezone: "Asia/Kolkata", label: "IST" },
  { id: "dhaka", city: "Dhaka", timezone: "Asia/Dhaka", label: "BST" },

  // Southeast Asia
  { id: "bangkok", city: "Bangkok", timezone: "Asia/Bangkok", label: "ICT" },
  { id: "ho-chi-minh", city: "Ho Chi Minh", timezone: "Asia/Ho_Chi_Minh", label: "ICT" },
  { id: "hanoi", city: "Hanoi", timezone: "Asia/Bangkok", label: "ICT" },
  { id: "jakarta", city: "Jakarta", timezone: "Asia/Jakarta", label: "WIB" },
  { id: "singapore", city: "Singapore", timezone: "Asia/Singapore", label: "SGT" },
  { id: "kuala-lumpur", city: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur", label: "MYT" },
  { id: "manila", city: "Manila", timezone: "Asia/Manila", label: "PHT" },

  // East Asia
  { id: "hong-kong", city: "Hong Kong", timezone: "Asia/Hong_Kong", label: "HKT" },
  { id: "taipei", city: "Taipei", timezone: "Asia/Taipei", label: "CST" },
  { id: "shanghai", city: "Shanghai", timezone: "Asia/Shanghai", label: "CST" },
  { id: "beijing", city: "Beijing", timezone: "Asia/Shanghai", label: "CST" },
  { id: "shenzhen", city: "Shenzhen", timezone: "Asia/Shanghai", label: "CST" },
  { id: "seoul", city: "Seoul", timezone: "Asia/Seoul", label: "KST" },
  { id: "tokyo", city: "Tokyo", timezone: "Asia/Tokyo", label: "JST" },
  { id: "osaka", city: "Osaka", timezone: "Asia/Tokyo", label: "JST" },

  // Oceania
  { id: "perth", city: "Perth", timezone: "Australia/Perth", label: "AWST" },
  { id: "darwin", city: "Darwin", timezone: "Australia/Darwin", label: "ACST" },
  { id: "adelaide", city: "Adelaide", timezone: "Australia/Adelaide", label: "ACST" },
  { id: "brisbane", city: "Brisbane", timezone: "Australia/Brisbane", label: "AEST" },
  { id: "sydney", city: "Sydney", timezone: "Australia/Sydney", label: "AEST" },
  { id: "melbourne", city: "Melbourne", timezone: "Australia/Melbourne", label: "AEST" },
  { id: "auckland", city: "Auckland", timezone: "Pacific/Auckland", label: "NZST" },
  { id: "wellington", city: "Wellington", timezone: "Pacific/Auckland", label: "NZST" },
];

export const DEFAULT_TIMEZONE_IDS = ["sf", "chicago", "kyiv"];

export function getTimezoneById(id: string): TimezoneConfig | undefined {
  return TIMEZONES.find((tz) => tz.id === id);
}

export function getCurrentTimeInTimezone(timezone: string): Date {
  return toZonedTime(new Date(), timezone);
}

export function formatTime(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "h:mm a");
}

export function formatTimeShort(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "h:mm");
}

export function formatTimeLarge(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "h:mm");
}

export function formatAmPm(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "a");
}

export function formatDate(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "EEE, MMM d");
}

export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export function formatHourShort(hour: number): string {
  if (hour === 0) return "12a";
  if (hour === 12) return "12p";
  if (hour < 12) return `${hour}a`;
  return `${hour - 12}p`;
}

export function getHourInTimezone(baseTimezone: string, targetTimezone: string, baseHour: number): { hour: number; dayOffset: number } {
  const now = new Date();
  const baseDate = toZonedTime(now, baseTimezone);
  baseDate.setHours(baseHour, 0, 0, 0);

  const baseOffset = getTimezoneOffset(baseTimezone);
  const targetOffset = getTimezoneOffset(targetTimezone);
  const diffHours = (targetOffset - baseOffset) / 60;

  let targetHour = baseHour + diffHours;
  let dayOffset = 0;

  if (targetHour >= 24) {
    targetHour -= 24;
    dayOffset = 1;
  } else if (targetHour < 0) {
    targetHour += 24;
    dayOffset = -1;
  }

  return { hour: Math.floor(targetHour), dayOffset };
}

function getTimezoneOffset(timezone: string): number {
  const now = new Date();
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / 1000 / 60;
}

export function isWorkingHour(hour: number): boolean {
  return hour >= 9 && hour < 18;
}

export function getTimeDifference(fromTimezone: string, toTimezone: string): string {
  const fromOffset = getTimezoneOffset(fromTimezone);
  const toOffset = getTimezoneOffset(toTimezone);
  const diffHours = (toOffset - fromOffset) / 60;

  if (diffHours === 0) return "Same time";
  const sign = diffHours > 0 ? "+" : "";
  return `${sign}${diffHours}h`;
}

export function getDayName(dayOffset: number): string {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date().getDay();
  const targetDay = (today + dayOffset + 7) % 7;
  return days[targetDay];
}

export function getCurrentHour(timezone: string): number {
  const now = new Date();
  const zonedTime = toZonedTime(now, timezone);
  return zonedTime.getHours();
}
