import SunCalc from "suncalc";
import { toZonedTime } from "date-fns-tz";
import { getNow } from "./time-sync";

interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

export function getSunTimes(date: Date, lat: number, lng: number): SunTimes {
  const times = SunCalc.getTimes(date, lat, lng);
  return { sunrise: times.sunrise, sunset: times.sunset };
}

/**
 * Returns "sunrise" | "sunset" | null depending on whether the sun event
 * falls within the given hour (0-23) in the specified timezone.
 */
export function getSunEventForHour(
  hour: number,
  timezone: string,
  lat: number,
  lng: number
): "sunrise" | "sunset" | null {
  const now = getNow();
  const times = SunCalc.getTimes(now, lat, lng);

  const sunriseZoned = toZonedTime(times.sunrise, timezone);
  const sunsetZoned = toZonedTime(times.sunset, timezone);

  if (sunriseZoned.getHours() === hour) return "sunrise";
  if (sunsetZoned.getHours() === hour) return "sunset";

  return null;
}

/**
 * Returns true if the given hour is a "night" hour —
 * before sunrise or after sunset in the specified timezone.
 */
export function isNightHour(
  hour: number,
  timezone: string,
  lat: number,
  lng: number
): boolean {
  const now = getNow();
  const times = SunCalc.getTimes(now, lat, lng);

  const sunriseZoned = toZonedTime(times.sunrise, timezone);
  const sunsetZoned = toZonedTime(times.sunset, timezone);

  const sunriseHour = sunriseZoned.getHours();
  const sunsetHour = sunsetZoned.getHours();

  return hour < sunriseHour || hour >= sunsetHour;
}
