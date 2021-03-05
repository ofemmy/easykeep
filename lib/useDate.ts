export function getDateFromQuery(year: number, month: number) {
  var date = new Date(year, month, 1);
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return date;
}
export function getDateWithoutTimeZone(date: Date) {
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return date;
}
