import { format } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { getNow } from "./time-sync";

export interface TimezoneConfig {
  id: string;
  city: string;
  timezone: string;
  label: string;
  flag: string;
}

export interface TimeRange {
  startHour: number;
  endHour: number;
}

export const TIMEZONES: TimezoneConfig[] = [
  // North America
  { id: "honolulu", city: "Honolulu", timezone: "Pacific/Honolulu", label: "HST", flag: "🇺🇸" },
  { id: "anchorage", city: "Anchorage", timezone: "America/Anchorage", label: "AKST", flag: "🇺🇸" },
  { id: "la", city: "Los Angeles", timezone: "America/Los_Angeles", label: "PST", flag: "🇺🇸" },
  { id: "sf", city: "San Francisco", timezone: "America/Los_Angeles", label: "PST", flag: "🇺🇸" },
  { id: "seattle", city: "Seattle", timezone: "America/Los_Angeles", label: "PST", flag: "🇺🇸" },
  { id: "vancouver", city: "Vancouver", timezone: "America/Vancouver", label: "PST", flag: "🇨🇦" },
  { id: "denver", city: "Denver", timezone: "America/Denver", label: "MST", flag: "🇺🇸" },
  { id: "phoenix", city: "Phoenix", timezone: "America/Phoenix", label: "MST", flag: "🇺🇸" },
  { id: "chicago", city: "Chicago", timezone: "America/Chicago", label: "CST", flag: "🇺🇸" },
  { id: "dallas", city: "Dallas", timezone: "America/Chicago", label: "CST", flag: "🇺🇸" },
  { id: "houston", city: "Houston", timezone: "America/Chicago", label: "CST", flag: "🇺🇸" },
  { id: "mexico-city", city: "Mexico City", timezone: "America/Mexico_City", label: "CST", flag: "🇲🇽" },
  { id: "nyc", city: "New York", timezone: "America/New_York", label: "EST", flag: "🇺🇸" },
  { id: "boston", city: "Boston", timezone: "America/New_York", label: "EST", flag: "🇺🇸" },
  { id: "miami", city: "Miami", timezone: "America/New_York", label: "EST", flag: "🇺🇸" },
  { id: "toronto", city: "Toronto", timezone: "America/Toronto", label: "EST", flag: "🇨🇦" },
  { id: "montreal", city: "Montreal", timezone: "America/Montreal", label: "EST", flag: "🇨🇦" },
  { id: "atlanta", city: "Atlanta", timezone: "America/New_York", label: "EST", flag: "🇺🇸" },

  // South America
  { id: "bogota", city: "Bogotá", timezone: "America/Bogota", label: "COT", flag: "🇨🇴" },
  { id: "lima", city: "Lima", timezone: "America/Lima", label: "PET", flag: "🇵🇪" },
  { id: "santiago", city: "Santiago", timezone: "America/Santiago", label: "CLT", flag: "🇨🇱" },
  { id: "buenos-aires", city: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", label: "ART", flag: "🇦🇷" },
  { id: "sao-paulo", city: "São Paulo", timezone: "America/Sao_Paulo", label: "BRT", flag: "🇧🇷" },
  { id: "rio", city: "Rio de Janeiro", timezone: "America/Sao_Paulo", label: "BRT", flag: "🇧🇷" },

  // Europe
  { id: "reykjavik", city: "Reykjavik", timezone: "Atlantic/Reykjavik", label: "GMT", flag: "🇮🇸" },
  { id: "london", city: "London", timezone: "Europe/London", label: "GMT", flag: "🇬🇧" },
  { id: "dublin", city: "Dublin", timezone: "Europe/Dublin", label: "GMT", flag: "🇮🇪" },
  { id: "lisbon", city: "Lisbon", timezone: "Europe/Lisbon", label: "WET", flag: "🇵🇹" },
  { id: "paris", city: "Paris", timezone: "Europe/Paris", label: "CET", flag: "🇫🇷" },
  { id: "amsterdam", city: "Amsterdam", timezone: "Europe/Amsterdam", label: "CET", flag: "🇳🇱" },
  { id: "brussels", city: "Brussels", timezone: "Europe/Brussels", label: "CET", flag: "🇧🇪" },
  { id: "berlin", city: "Berlin", timezone: "Europe/Berlin", label: "CET", flag: "🇩🇪" },
  { id: "frankfurt", city: "Frankfurt", timezone: "Europe/Berlin", label: "CET", flag: "🇩🇪" },
  { id: "munich", city: "Munich", timezone: "Europe/Berlin", label: "CET", flag: "🇩🇪" },
  { id: "zurich", city: "Zurich", timezone: "Europe/Zurich", label: "CET", flag: "🇨🇭" },
  { id: "vienna", city: "Vienna", timezone: "Europe/Vienna", label: "CET", flag: "🇦🇹" },
  { id: "prague", city: "Prague", timezone: "Europe/Prague", label: "CET", flag: "🇨🇿" },
  { id: "warsaw", city: "Warsaw", timezone: "Europe/Warsaw", label: "CET", flag: "🇵🇱" },
  { id: "rome", city: "Rome", timezone: "Europe/Rome", label: "CET", flag: "🇮🇹" },
  { id: "milan", city: "Milan", timezone: "Europe/Rome", label: "CET", flag: "🇮🇹" },
  { id: "madrid", city: "Madrid", timezone: "Europe/Madrid", label: "CET", flag: "🇪🇸" },
  { id: "barcelona", city: "Barcelona", timezone: "Europe/Madrid", label: "CET", flag: "🇪🇸" },
  { id: "stockholm", city: "Stockholm", timezone: "Europe/Stockholm", label: "CET", flag: "🇸🇪" },
  { id: "oslo", city: "Oslo", timezone: "Europe/Oslo", label: "CET", flag: "🇳🇴" },
  { id: "copenhagen", city: "Copenhagen", timezone: "Europe/Copenhagen", label: "CET", flag: "🇩🇰" },
  { id: "helsinki", city: "Helsinki", timezone: "Europe/Helsinki", label: "EET", flag: "🇫🇮" },
  { id: "tallinn", city: "Tallinn", timezone: "Europe/Tallinn", label: "EET", flag: "🇪🇪" },
  { id: "riga", city: "Riga", timezone: "Europe/Riga", label: "EET", flag: "🇱🇻" },
  { id: "vilnius", city: "Vilnius", timezone: "Europe/Vilnius", label: "EET", flag: "🇱🇹" },
  { id: "kyiv", city: "Kyiv", timezone: "Europe/Kyiv", label: "EET", flag: "🇺🇦" },
  { id: "bucharest", city: "Bucharest", timezone: "Europe/Bucharest", label: "EET", flag: "🇷🇴" },
  { id: "sofia", city: "Sofia", timezone: "Europe/Sofia", label: "EET", flag: "🇧🇬" },
  { id: "athens", city: "Athens", timezone: "Europe/Athens", label: "EET", flag: "🇬🇷" },
  { id: "istanbul", city: "Istanbul", timezone: "Europe/Istanbul", label: "TRT", flag: "🇹🇷" },
  { id: "moscow", city: "Moscow", timezone: "Europe/Moscow", label: "MSK", flag: "🇷🇺" },

  // Middle East
  { id: "tel-aviv", city: "Tel Aviv", timezone: "Asia/Tel_Aviv", label: "IST", flag: "🇮🇱" },
  { id: "jerusalem", city: "Jerusalem", timezone: "Asia/Jerusalem", label: "IST", flag: "🇮🇱" },
  { id: "beirut", city: "Beirut", timezone: "Asia/Beirut", label: "EET", flag: "🇱🇧" },
  { id: "riyadh", city: "Riyadh", timezone: "Asia/Riyadh", label: "AST", flag: "🇸🇦" },
  { id: "doha", city: "Doha", timezone: "Asia/Qatar", label: "AST", flag: "🇶🇦" },
  { id: "dubai", city: "Dubai", timezone: "Asia/Dubai", label: "GST", flag: "🇦🇪" },
  { id: "abu-dhabi", city: "Abu Dhabi", timezone: "Asia/Dubai", label: "GST", flag: "🇦🇪" },
  { id: "tehran", city: "Tehran", timezone: "Asia/Tehran", label: "IRST", flag: "🇮🇷" },

  // Africa
  { id: "casablanca", city: "Casablanca", timezone: "Africa/Casablanca", label: "WET", flag: "🇲🇦" },
  { id: "cairo", city: "Cairo", timezone: "Africa/Cairo", label: "EET", flag: "🇪🇬" },
  { id: "lagos", city: "Lagos", timezone: "Africa/Lagos", label: "WAT", flag: "🇳🇬" },
  { id: "nairobi", city: "Nairobi", timezone: "Africa/Nairobi", label: "EAT", flag: "🇰🇪" },
  { id: "johannesburg", city: "Johannesburg", timezone: "Africa/Johannesburg", label: "SAST", flag: "🇿🇦" },
  { id: "cape-town", city: "Cape Town", timezone: "Africa/Johannesburg", label: "SAST", flag: "🇿🇦" },

  // Central Asia
  { id: "bishkek", city: "Bishkek", timezone: "Asia/Bishkek", label: "KGT", flag: "🇰🇬" },
  { id: "almaty", city: "Almaty", timezone: "Asia/Almaty", label: "ALMT", flag: "🇰🇿" },
  { id: "tashkent", city: "Tashkent", timezone: "Asia/Tashkent", label: "UZT", flag: "🇺🇿" },
  { id: "astana", city: "Astana", timezone: "Asia/Almaty", label: "ALMT", flag: "🇰🇿" },

  // South Asia
  { id: "karachi", city: "Karachi", timezone: "Asia/Karachi", label: "PKT", flag: "🇵🇰" },
  { id: "mumbai", city: "Mumbai", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳" },
  { id: "delhi", city: "Delhi", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳" },
  { id: "bangalore", city: "Bangalore", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳" },
  { id: "kolkata", city: "Kolkata", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳" },
  { id: "chennai", city: "Chennai", timezone: "Asia/Kolkata", label: "IST", flag: "🇮🇳" },
  { id: "dhaka", city: "Dhaka", timezone: "Asia/Dhaka", label: "BST", flag: "🇧🇩" },

  // Southeast Asia
  { id: "bangkok", city: "Bangkok", timezone: "Asia/Bangkok", label: "ICT", flag: "🇹🇭" },
  { id: "ho-chi-minh", city: "Ho Chi Minh", timezone: "Asia/Ho_Chi_Minh", label: "ICT", flag: "🇻🇳" },
  { id: "hanoi", city: "Hanoi", timezone: "Asia/Bangkok", label: "ICT", flag: "🇻🇳" },
  { id: "jakarta", city: "Jakarta", timezone: "Asia/Jakarta", label: "WIB", flag: "🇮🇩" },
  { id: "singapore", city: "Singapore", timezone: "Asia/Singapore", label: "SGT", flag: "🇸🇬" },
  { id: "kuala-lumpur", city: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur", label: "MYT", flag: "🇲🇾" },
  { id: "manila", city: "Manila", timezone: "Asia/Manila", label: "PHT", flag: "🇵🇭" },

  // East Asia
  { id: "hong-kong", city: "Hong Kong", timezone: "Asia/Hong_Kong", label: "HKT", flag: "🇭🇰" },
  { id: "taipei", city: "Taipei", timezone: "Asia/Taipei", label: "CST", flag: "🇹🇼" },
  { id: "shanghai", city: "Shanghai", timezone: "Asia/Shanghai", label: "CST", flag: "🇨🇳" },
  { id: "beijing", city: "Beijing", timezone: "Asia/Shanghai", label: "CST", flag: "🇨🇳" },
  { id: "shenzhen", city: "Shenzhen", timezone: "Asia/Shanghai", label: "CST", flag: "🇨🇳" },
  { id: "seoul", city: "Seoul", timezone: "Asia/Seoul", label: "KST", flag: "🇰🇷" },
  { id: "tokyo", city: "Tokyo", timezone: "Asia/Tokyo", label: "JST", flag: "🇯🇵" },
  { id: "osaka", city: "Osaka", timezone: "Asia/Tokyo", label: "JST", flag: "🇯🇵" },

  // Oceania
  { id: "perth", city: "Perth", timezone: "Australia/Perth", label: "AWST", flag: "🇦🇺" },
  { id: "darwin", city: "Darwin", timezone: "Australia/Darwin", label: "ACST", flag: "🇦🇺" },
  { id: "adelaide", city: "Adelaide", timezone: "Australia/Adelaide", label: "ACST", flag: "🇦🇺" },
  { id: "brisbane", city: "Brisbane", timezone: "Australia/Brisbane", label: "AEST", flag: "🇦🇺" },
  { id: "sydney", city: "Sydney", timezone: "Australia/Sydney", label: "AEST", flag: "🇦🇺" },
  { id: "melbourne", city: "Melbourne", timezone: "Australia/Melbourne", label: "AEST", flag: "🇦🇺" },
  { id: "auckland", city: "Auckland", timezone: "Pacific/Auckland", label: "NZST", flag: "🇳🇿" },
  { id: "wellington", city: "Wellington", timezone: "Pacific/Auckland", label: "NZST", flag: "🇳🇿" },
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
