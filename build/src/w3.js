module.exports = (date = new Date()) => {
  const year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const offset = -date.getTimezoneOffset();
  let offsetHours = Math.abs(Math.floor(offset / 60));
  let offsetMinutes = Math.abs(offset) - offsetHours * 60;
  let offsetSign = '+';

  month++;

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  if (hours < 10) {
    hours = '0' + hours;
  }

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (offsetHours < 10) {
    offsetHours = '0' + offsetHours;
  }

  if (offsetMinutes < 10) {
    offsetMinutes = '0' + offsetMinutes;
  }

  if (offset < 0) {
    offsetSign = '-';
  }

  return (
    year +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds +
    offsetSign +
    offsetHours +
    ':' +
    offsetMinutes
  );
}
