import { format } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { getNow } from "./time-sync";

export interface TimezoneConfig {
  id: string;
  city: string;
  timezone: string;
  label: string;
  flag: string;
  lat: number;
  lng: number;
}

export interface TimeRange {
  startHour: number;
  endHour: number;
}

export const TIMEZONES: TimezoneConfig[] = [
  // North America
  { id: "honolulu", city: "Honolulu", timezone: "Pacific/Honolulu", label: "HST", flag: "🇺🇸", lat: 21.31, lng: -157.86 },
  { id: "anchorage", city: "Anchorage", timezone: "America/Anchorage", label: "AKST", flag: "🇺🇸", lat: 61.22, lng: -149.90 },
  { id: "la", city: "Los Angeles", timezone: "America/Los_Angeles", label: "PST", flag: "🇺🇸", lat: 34.05, lng: -118.24 },
  { id: "sf", city: "San Francisco", timezone: "America/Los_Angeles", label: "PST", flag: "🇺🇸", lat: 37.77, lng: -122.42 },
  { id: "seattle", city: "Seattle", timezone: "America/Los_Angeles", label: "PST", flag: "🇺🇸", lat: 47.61, lng: -122.33 },
  { id: "vancouver", city: "Vancouver", timezone: "America/Vancouver", label: "PST", flag: "🇨🇦", lat: 49.28, lng: -123.12 },
  { id: "denver", city: "Denver", timezone: "America/Denver", label: "MST", flag: "🇺🇸", lat: 39.74, lng: -104.99 },
  { id: "phoenix", city: "Phoenix", timezone: "America/Phoenix", label: "MST", flag: "🇺🇸", lat: 33.45, lng: -112.07 },
  { id: "chicago", city: "Chicago", timezone: "America/Chicago", label: "CST", flag: "🇺🇸", lat: 41.88, lng: -87.63 },
  { id: "dallas", city: "Dallas", timezone: "America/Chicago", label: "CST", flag: "🇺🇸", lat: 32.78, lng: -96.80 },
  { id: "houston", city: "Houston", timezone: "America/Chicago", label: "CST", flag: "🇺🇸", lat: 29.76, lng: -95.37 },
  { id: "mexico-city", city: "Mexico City", timezone: "America/Mexico_City", label: "CST", flag: "🇲🇽", lat: 19.43, lng: -99.13 },
  { id: "nyc", city: "New York", timezone: "America/New_York", label: "EST", flag: "🇺🇸", lat: 40.71, lng: -74.01 },
  { id: "boston", city: "Boston", timezone: "America/New_York", label: "EST", flag: "🇺🇸", lat: 42.36, lng: -71.06 },
  { id: "miami", city: "Miami", timezone: "America/New_York", label: "EST", flag: "🇺🇸", lat: 25.76, lng: -80.19 },
  { id: "toronto", city: "Toronto", timezone: "America/Toronto", label: "EST", flag: "🇨🇦", lat: 43.65, lng: -79.38 },
  { id: "montreal", city: "Montreal", timezone: "America/Montreal", label: "EST", flag: "🇨🇦", lat: 45.50, lng: -73.57 },
  { id: "atlanta", city: "Atlanta", timezone: "America/New_York", label: "EST", flag: "🇺🇸", lat: 33.75, lng: -84.39 },

  // South America
  { id: "bogota", city: "Bogotá", timezone: "America/Bogota", label: "COT", flag: "🇨🇴", lat: 4.71, lng: -74.07 },
  { id: "lima", city: "Lima", timezone: "America/Lima", label: "PET", flag: "🇵🇪", lat: -12.05, lng: -77.04 },
  { id: "santiago", city: "Santiago", timezone: "America/Santiago", label: "CLT", flag: "🇨🇱", lat: -33.45, lng: -70.67 },
  { id: "buenos-aires", city: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", label: "ART", flag: "🇦🇷", lat: -34.60, lng: -58.38 },
  { id: "sao-paulo", city: "São Paulo", timezone: "America/Sao_Paulo", label: "BRT", flag: "🇧🇷", lat: -23.55, lng: -46.63 },
  { id: "rio", city: "Rio de Janeiro", timezone: "America/Sao_Paulo", label: "BRT", flag: "🇧🇷", lat: -22.91, lng: -43.17 },

  // Europe
  { id: "reykjavik", city: "Reykjavik", timezone: "Atlantic/Reykjavik", label: "GMT", flag: "🇮🇸", lat: 64.15, lng: -21.94 },
  { id: "london", city: "London", timezone: "Europe/London", label: "GMT", flag: "🇬🇧", lat: 51.51, lng: -0.13 },
  { id: "dublin", city: "Dublin", timezone: "Europe/Dublin", label: "GMT", flag: "🇮🇪", lat: 53.35, lng: -6.26 },
  { id: "lisbon", city: "Lisbon", timezone: "Europe/Lisbon", label: "WET", flag: "🇵🇹", lat: 38.72, lng: -9.14 },
  { id: "paris", city: "Paris", timezone: "Europe/Paris", label: "CET", flag: "🇫🇷", lat: 48.86, lng: 2.35 },
  { id: "amsterdam", city: "Amsterdam", timezone: "Europe/Amsterdam", label: "CET", flag: "🇳🇱", lat: 52.37, lng: 4.90 },
  { id: "brussels", city: "Brussels", timezone: "Europe/Brussels", label: "CET", flag: "🇧🇪", lat: 50.85, lng: 4.35 },
  { id: "berlin", city: "Berlin", timezone: "Europe/Berlin", label: "CET", flag: "🇩🇪", lat: 52.52, lng: 13.40 },
  { id: "frankfurt", city: "Frankfurt", timezone: "Europe/Berlin", label: "CET", flag: "🇩🇪", lat: 50.11, lng: 8.68 },
  { id: "munich", city: "Munich", timezone: "Europe/Berlin", label: "CET", flag: "🇩🇪", lat: 48.14, lng: 11.58 },
  { id: "zurich", city: "Zurich", timezone: "Europe/Zurich", label: "CET", flag: "🇨🇭", lat: 47.38, lng: 8.54 },
  { id: "vienna", city: "Vienna", timezone: "Europe/Vienna", label: "CET", flag: "🇦🇹", lat: 48.21, lng: 16.37 },
  { id: "prague", city: "Prague", timezone: "Europe/Prague", label: "CET", flag: "🇨🇿", lat: 50.08, lng: 14.44 },
  { id: "warsaw", city: "Warsaw", timezone: "Europe/Warsaw", label: "CET", flag: "🇵🇱", lat: 52.23, lng: 21.01 },
  { id: "rome", city: "Rome", timezone: "Europe/Rome", label: "CET", flag: "🇮🇹", lat: 41.90, lng: 12.50 },
  { id: "milan", city: "Milan", timezone: "Europe/Rome", label: "CET", flag: "🇮🇹", lat: 45.46, lng: 9.19 },
  { id: "madrid", city: "Madrid", timezone: "Europe/Madrid", label: "CET", flag: "🇪🇸", lat: 40.42, lng: -3.70 },
  { id: "barcelona", city: "Barcelona", timezone: "Europe/Madrid", label: "CET", flag: "🇪🇸", lat: 41.39, lng: 2.17 },
  { id: "stockholm", city: "Stockholm", timezone: "Europe/Stockholm", label: "CET", flag: "🇸🇪", lat: 59.33, lng: 18.07 },
  { id: "oslo", city: "Oslo", timezone: "Europe/Oslo", label: "CET", flag: "🇳🇴", lat: 59.91, lng: 10.75 },
  { id: "copenhagen", city: "Copenhagen", timezone: "Europe/Copenhagen", label: "CET", flag: "🇩🇰", lat: 55.68, lng: 12.57 },
  { id: "helsinki", city: "Helsinki", timezone: "Europe/Helsinki", label: "EET", flag: "🇫🇮", lat: 60.17, lng: 24.94 },
  { id: "tallinn", city: "Tallinn", timezone: "Europe/Tallinn", label: "EET", flag: "🇪🇪", lat: 59.44, lng: 24.75 },
  { id: "riga", city: "Riga", timezone: "Europe/Riga", label: "EET", flag: "🇱🇻", lat: 56.95, lng: 24.11 },
  { id: "vilnius", city: "Vilnius", timezone: "Europe/Vilnius", label: "EET", flag: "🇱🇹", lat: 54.69, lng: 25.28 },
  { id: "kyiv", city: "Kyiv", timezone: "Europe/Kyiv", label: "EET", flag: "🇺🇦", lat: 50.45, lng: 30.52 },
  { id: "bucharest", city: "Bucharest", timezone: "Europe/Bucharest", label: "EET", flag: "🇷🇴", lat: 44.43, lng: 26.10 },
  { id: "sofia", city: "Sofia", timezone: "Europe/Sofia", label: "EET", flag: "🇧🇬", lat: 42.70, lng: 23.32 },
  { id: "athens", city: "Athens", timezone: "Europe/Athens", label: "EET", flag: "🇬🇷", lat: 37.98, lng: 23.73 },
  { id: "istanbul", city: "Istanbul", timezone: "Europe/Istanbul", label: "TRT", flag: "🇹🇷", lat: 41.01, lng: 28.98 },
  { id: "moscow", city: "Moscow", timezone: "Europe/Moscow", label: "MSK", flag: "🇷🇺", lat: 55.76, lng: 37.62 },

  // Middle East
  { id: "tel-aviv", city: "Tel Aviv", timezone: "Asia/Tel_Aviv", label: "IST", flag: "🇮🇱", lat: 32.09, lng: 34.78 },
  { id: "jerusalem", city: "Jerusalem", timezone: "Asia/Jerusalem", label: "IST", flag: "🇮🇱", lat: 31.77, lng: 35.23 },
  { id: "beirut", city: "Beirut", timezone: "Asia/Beirut", label: "EET", flag: "🇱🇧", lat: 33.89, lng: 35.50 },
  { id: "riyadh", city: "Riyadh", timezone: "Asia/Riyadh", label: "AST", flag: "🇸🇦", lat: 24.69, lng: 46.72 },
  { id: "doha", city: "Doha", timezone: "Asia/Qatar", label: "AST", flag: "🇶🇦", lat: 25.29, lng: 51.53 },
  { id: "dubai", city: "Dubai", timezone: "Asia/Dubai", label: "GST", flag: "🇦🇪", lat: 25.20, lng: 55.27 },
  { id: "abu-dhabi", city: "Abu Dhabi", timezone: "Asia/Dubai", label: "GST", flag: "🇦🇪", lat: 24.45, lng: 54.65 },
  { id: "tehran", city: "Tehran", timezone: "Asia/Tehran", label: "IRST", flag: "🇮🇷", lat: 35.69, lng: 51.39 },

  // Africa
  { id: "casablanca", city: "Casablanca", timezone: "Africa/Casablanca", label: "WET", flag: "🇲🇦", lat: 33.57, lng: -7.59 },
  { id: "cairo", city: "Cairo", timezone: "Africa/Cairo", label: "EET", flag: "🇪🇬", lat: 30.04, lng: 31.24 },
  { id: "lagos", city: "Lagos", timezone: "Africa/Lagos", label: "WAT", flag: "🇳🇬", lat: 6.52, lng: 3.38 },
  { id: "nairobi", city: "Nairobi", timezone: "Africa/Nairobi", label: "EAT", flag: "🇰🇪", lat: -1.29, lng: 36.82 },
  { id: "johannesburg", city: "Johannesburg", timezone: "Africa/Johannesburg", label: "SAST", flag: "🇿🇦", lat: -26.20, lng: 28.05 },
  { id: "cape-town", city: "Cape Town", timezone: "Africa/Johannesburg", label: "SAST", flag: "🇿🇦", lat: -33.93, lng: 18.42 },

  // Central Asia
  { id: "bishkek", city: "Bishkek", timezone: "Asia/Bishkek", label: "KGT", flag: "🇰🇬", lat: 42.87, lng: 74.59 },
  { id: "almaty", city: "Almaty", timezone: "Asia/Almaty", label: "ALMT", flag: "🇰🇿", lat: 43.24, lng: 76.95 },
  { id: "tashkent", city: "Tashkent", timezone: "Asia/Tashkent", label: "UZT", flag: "🇺🇿", lat: 41.30, lng: 69.28 },
  { id: "astana", city: "Astana", timezone: "Asia/Almaty", label: "ALMT", flag: "🇰🇿", lat: 51.17, lng: 71.43 },

  // South Asia
  { id: "karachi", city: "Karachi", timezone: "Asia/Karachi", label: "PKT", flag: "🇵🇰", lat: 24.86, lng: 67.01 },
  { id: "mumbai", city: "Mumbai", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳", lat: 19.08, lng: 72.88 },
  { id: "delhi", city: "Delhi", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳", lat: 28.61, lng: 77.21 },
  { id: "bangalore", city: "Bangalore", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳", lat: 12.97, lng: 77.59 },
  { id: "kolkata", city: "Kolkata", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳", lat: 22.57, lng: 88.36 },
  { id: "chennai", city: "Chennai", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳", lat: 13.08, lng: 80.27 },
  { id: "dhaka", city: "Dhaka", timezone: "Asia/Dhaka", label: "BST", flag: "🇧🇩", lat: 23.81, lng: 90.41 },

  // Southeast Asia
  { id: "bangkok", city: "Bangkok", timezone: "Asia/Bangkok", label: "ICT", flag: "🇹🇭", lat: 13.76, lng: 100.50 },
  { id: "ho-chi-minh", city: "Ho Chi Minh", timezone: "Asia/Ho_Chi_Minh", label: "ICT", flag: "🇻🇳", lat: 10.82, lng: 106.63 },
  { id: "hanoi", city: "Hanoi", timezone: "Asia/Bangkok", label: "ICT", flag: "🇻🇳", lat: 21.03, lng: 105.85 },
  { id: "jakarta", city: "Jakarta", timezone: "Asia/Jakarta", label: "WIB", flag: "🇮🇩", lat: -6.21, lng: 106.85 },
  { id: "singapore", city: "Singapore", timezone: "Asia/Singapore", label: "SGT", flag: "🇸🇬", lat: 1.35, lng: 103.82 },
  { id: "kuala-lumpur", city: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur", label: "MYT", flag: "🇲🇾", lat: 3.14, lng: 101.69 },
  { id: "manila", city: "Manila", timezone: "Asia/Manila", label: "PHT", flag: "🇵🇭", lat: 14.60, lng: 120.98 },

  // East Asia
  { id: "hong-kong", city: "Hong Kong", timezone: "Asia/Hong_Kong", label: "HKT", flag: "🇭🇰", lat: 22.32, lng: 114.17 },
  { id: "taipei", city: "Taipei", timezone: "Asia/Taipei", label: "CST", flag: "🇹🇼", lat: 25.03, lng: 121.57 },
  { id: "shanghai", city: "Shanghai", timezone: "Asia/Shanghai", label: "CST", flag: "🇨🇳", lat: 31.23, lng: 121.47 },
  { id: "beijing", city: "Beijing", timezone: "Asia/Shanghai", label: "CST", flag: "🇨🇳", lat: 39.90, lng: 116.40 },
  { id: "shenzhen", city: "Shenzhen", timezone: "Asia/Shanghai", label: "CST", flag: "🇨🇳", lat: 22.54, lng: 114.06 },
  { id: "seoul", city: "Seoul", timezone: "Asia/Seoul", label: "KST", flag: "🇰🇷", lat: 37.57, lng: 126.98 },
  { id: "tokyo", city: "Tokyo", timezone: "Asia/Tokyo", label: "JST", flag: "🇯🇵", lat: 35.68, lng: 139.69 },
  { id: "osaka", city: "Osaka", timezone: "Asia/Tokyo", label: "JST", flag: "🇯🇵", lat: 34.69, lng: 135.50 },

  // Oceania
  { id: "perth", city: "Perth", timezone: "Australia/Perth", label: "AWST", flag: "🇦🇺", lat: -31.95, lng: 115.86 },
  { id: "darwin", city: "Darwin", timezone: "Australia/Darwin", label: "ACST", flag: "🇦🇺", lat: -12.46, lng: 130.84 },
  { id: "adelaide", city: "Adelaide", timezone: "Australia/Adelaide", label: "ACST", flag: "🇦🇺", lat: -34.93, lng: 138.60 },
  { id: "brisbane", city: "Brisbane", timezone: "Australia/Brisbane", label: "AEST", flag: "🇦🇺", lat: -27.47, lng: 153.03 },
  { id: "sydney", city: "Sydney", timezone: "Australia/Sydney", label: "AEST", flag: "🇦🇺", lat: -33.87, lng: 151.21 },
  { id: "melbourne", city: "Melbourne", timezone: "Australia/Melbourne", label: "AEST", flag: "🇦🇺", lat: -37.81, lng: 144.96 },
  { id: "auckland", city: "Auckland", timezone: "Pacific/Auckland", label: "NZST", flag: "🇳🇿", lat: -36.85, lng: 174.76 },
  { id: "wellington", city: "Wellington", timezone: "Pacific/Auckland", label: "NZST", flag: "🇳🇿", lat: -41.29, lng: 174.78 },
];

export const FALLBACK_TIMEZONE_IDS = ["sf", "chicago", "kyiv"];

export function getTimezoneById(id: string): TimezoneConfig | undefined {
  return TIMEZONES.find((tz) => tz.id === id);
}

export function findTimezoneByIANA(iana: string): TimezoneConfig | undefined {
  return TIMEZONES.find((tz) => tz.timezone === iana);
}

/**
 * Returns default timezone IDs based on the user's detected local timezone.
 * Places the local timezone first, then picks two geographically diverse defaults.
 */
export function getDefaultTimezoneIds(): string[] {
  if (typeof window === "undefined") return FALLBACK_TIMEZONE_IDS;

  try {
    const localIANA = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTz = findTimezoneByIANA(localIANA);

    if (!localTz) return FALLBACK_TIMEZONE_IDS;

    // Pick two companion timezones that differ from the local one
    const companions = ["sf", "chicago", "kyiv", "london", "tokyo", "sydney"];
    const picked: string[] = [localTz.id];

    for (const id of companions) {
      if (picked.length >= 3) break;
      const tz = getTimezoneById(id);
      if (tz && tz.timezone !== localTz.timezone) {
        picked.push(id);
      }
    }

    // If we still don't have 3, just return what we have
    return picked.length >= 2 ? picked : FALLBACK_TIMEZONE_IDS;
  } catch {
    return FALLBACK_TIMEZONE_IDS;
  }
}

export function getCurrentTimeInTimezone(timezone: string): Date {
  return toZonedTime(getNow(), timezone);
}

export function formatTime(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "h:mm a");
}

export function formatTimeShort(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "h:mm");
}

export function formatTimeLarge(date: Date, timezone: string, use24h = false): string {
  return formatInTimeZone(date, timezone, use24h ? "HH:mm" : "h:mm");
}

export function formatSeconds(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "ss");
}

export function formatAmPm(date: Date, timezone: string, use24h = false): string {
  if (use24h) return "";
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

export function formatHourShort(hour: number, use24h = false): string {
  if (use24h) return `${hour.toString().padStart(2, "0")}:00`;
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export function getHourInTimezone(baseTimezone: string, targetTimezone: string, baseHour: number): { hour: number; dayOffset: number } {
  const now = getNow();
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
  const now = getNow();
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
  const today = getNow().getDay();
  const targetDay = (today + dayOffset + 7) % 7;
  return days[targetDay];
}

export function getCurrentHour(timezone: string): number {
  const now = getNow();
  const zonedTime = toZonedTime(now, timezone);
  return zonedTime.getHours();
}
