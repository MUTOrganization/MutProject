import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 * Calculates the remaining time until the end date from the current date.
 * @param {string} startDate - The start datetime in ISO format (e.g., "2024-11-25T08:00:00Z").
 * @param {string} endDate - The end datetime in ISO format (e.g., "2024-11-25T17:00:00Z").
 * @returns {string} - Remaining time in "HH:mm:ss ชม." format or "Timeout" if the end date has passed.
 */
export function calculateRemainingTime(startDate, endDate) {
  const now = dayjs(); // Current date and time
  const start = dayjs(startDate); // Start date
  const end = dayjs(endDate); // End date

  // If current time is past the end time, return "Timeout"
  if (now.isAfter(end)) {
    return "Timeout";
  }

  // If current time is before the start time, calculate until the start
  const target = now.isBefore(start) ? start : end;

  const diff = target.diff(now); // Difference in milliseconds
  const timeLeft = dayjs.duration(diff); // Convert to duration

  const hours = String(timeLeft.hours()).padStart(2, "0");
  const minutes = String(timeLeft.minutes()).padStart(2, "0");
  const seconds = String(timeLeft.seconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ชม.`; // Return formatted time
}


export const generateDays = () => {
  return Array.from({ length: 31 }, (_, index) => ({
    key: index + 1,
    label: `${index + 1}`,
  }));
};

export const generatePeople = () => {
  return Array.from({ length: 15 }, (_, index) => ({
    key: index + 1,
    label: `${index + 1}`,
  }));
};


