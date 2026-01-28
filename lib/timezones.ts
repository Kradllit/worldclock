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
  { id: "sf", city: "San Francisco", timezone: "America/Los_Angeles", label: "PST" },
  { id: "chicago", city: "Chicago", timezone: "America/Chicago", label: "CST" },
  { id: "nyc", city: "New York", timezone: "America/New_York", label: "EST" },
  { id: "london", city: "London", timezone: "Europe/London", label: "GMT" },
  { id: "kyiv", city: "Kyiv", timezone: "Europe/Kyiv", label: "EET" },
  { id: "warsaw", city: "Warsaw", timezone: "Europe/Warsaw", label: "CET" },
  { id: "dubai", city: "Dubai", timezone: "Asia/Dubai", label: "GST" },
  { id: "bangkok", city: "Bangkok", timezone: "Asia/Bangkok", label: "ICT" },
  { id: "tokyo", city: "Tokyo", timezone: "Asia/Tokyo", label: "JST" },
  { id: "sydney", city: "Sydney", timezone: "Australia/Sydney", label: "AEST" },
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
