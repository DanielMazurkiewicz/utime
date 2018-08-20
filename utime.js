
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 31, 31];
const zones = {
  utc: {byUtc:[], byLocal:[]}
};

let defaultZone = 'utc';
function positiveModulo(number, modulo) {
  var result = number % modulo;
  if (result < 0) result += modulo;
  return result;
}

function isLeapYear(year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function yearMonthIDtoArray(yearMonthID) {
  return [Math.floor(yearMonthID / 12) + 1970, positiveModulo(yearMonthID, 12) + 1];
}

function getMonthDays(year, month) {
  if (month === 2 && isLeapYear(year)) return 29;
  return monthDays[month -1];
}

function findTimeDifference(sortedZoneDb, timePoint, property) {
  if (!sortedZoneDb.length) return 0;

  var startIndex  = 0,
      stopIndex   = sortedZoneDb.length - 1,
      middle      = (stopIndex/2) | 0,
      zoneValue;

  while(startIndex <= stopIndex) {
    zoneValue = sortedZoneDb[middle][property];
    if (timePoint >= zoneValue) {
      startIndex = middle + 1;
    } else {
      stopIndex = middle - 1;
    }
    middle = ((stopIndex + startIndex) / 2) | 0;
  }

  var result;
  if (startIndex < 1) {
    result = sortedZoneDb[0];
  } else {
    result = sortedZoneDb[startIndex - 1];
  };

  return result[1] - result[0];
}

function deminifyZoneDb(zoneDb) {
  var result = [];
  if (zoneDb && zoneDb.length >= 3) {
    var elmement = [];
    var multiplier = zoneDb[zoneDb.length -1];
    var current, previous = zoneDb[0];
    elmement.push(previous * multiplier);
    for (let i = 1; i < zoneDb.length - 1; i++) {
      current = previous + zoneDb[i];
      elmement.push(current * multiplier);
      previous = current;
      if (elmement.length === 2) {
        result.push(elmement);
        elmement = [];
      }
    }
  }
  return result;
}

function Utime(timeZone, time, _timeIsLocal) {
  let timeLocal, timeDifference;
  if (typeof timeZone !== 'string') {
    time = timeZone;
    timeZone = defaultZone;
  }

  if (time === undefined) {
    time = (new Date()).getTime();
  } else if (time instanceof Array) {
    time = Date.UTC(
      time[0], 
      time[1] ? time[1] - 1 : 0, 
      time[2] || 1, 
      time[3] || 0, 
      time[4] || 0, 
      time[5] || 0) + (time[5] ? (time[5] - (time[5] | 0)) * 1000 : 0);
    _timeIsLocal = true;
  }

  if (_timeIsLocal) {
    timeLocal = time;
    timeDifference = findTimeDifference(zones[timeZone].byLocal, timeLocal, 1); 
    time = timeLocal - timeDifference;
  } else {
    timeDifference = findTimeDifference(zones[timeZone].byUtc, time, 0); 
    timeLocal = time + timeDifference;
  }

  this.getValue = () => time;
  this.getTimeZone = () => timeZone;

  this._timeLocal = () => timeLocal;
}

Utime.isRegistred = name => zone[name] ? true : false;
Utime.registerZone = (name, zoneDb, defaultTimeZone) => {
  if ((zoneDb[0] !== undefined) && !(zoneDb[0] instanceof Array)) {
    zoneDb = deminifyZoneDb(zoneDb);
  }
  zones[name] = {
    byUtc: zoneDb.sort((a, b) => a[0] - b[0]),
    byLocal: zoneDb.sort((a, b) => a[1] - b[1])
  }
  if (defaultTimeZone) defaultZone = name;
}


Utime.prototype = {
  in(zoneName, callback) {
    const utime = new Utime(zoneName, this.getValue());
    if (callback) callback(utime, zoneName)
    return utime;
  },

  toString(a) {
    const text = (new Date(this._timeLocal())).toISOString();
    const separator = text.indexOf('T');
    const date = text.substring(0, separator);
    const time = text.substring(separator + 1, text.length - 1);
    return date + ' ' + time;
  },
  toDate() {
    return new Date(this.getValue());
  },
  toArray() {
    const date = new Date(this._timeLocal());
    return [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds() + date.getUTCMilliseconds() / 1000
    ];
  },

  second() {
    const date = new Date(this._timeLocal());
    return date.getUTCSeconds() + date.getUTCMilliseconds() / 1000;
  },
  minute() {
    return (new Date(this._timeLocal())).getUTCMinutes();
  },
  hour() {
    return (new Date(this._timeLocal())).getUTCHours();
  },

  day() {
    return (new Date(this._timeLocal())).getUTCDate();
  },
  month() {
    return (new Date(this._timeLocal())).getUTCMonth() + 1;
  },
  year() {
    return (new Date(this._timeLocal())).getUTCFullYear();
  },
  dayOfWeek() {
    return ((this.getDayID() - 4)  % 7);
  },

  getYearMonthID() {
    const date = new Date(this._timeLocal());
    return (date.getUTCFullYear() - 1970) * 12 + date.getUTCMonth();
  },
  getWeekID() {
    return Math.floor(this._timeLocal()/604800000);
  },
  getDayID() {
    return Math.floor(this._timeLocal()/86400000);
  },
  getHourID() {
    return Math.floor(this._timeLocal()/3600000);
  },

  shiftSeconds(value, absolute) {
    if (absolute) return new Utime(this.getTimeZone(), this.getValue() + value * 1000);
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 1000, true);
  },
  shiftMinutes(value, absolute) {
    if (absolute) return new Utime(this.getTimeZone(), this.getValue() + value * 60000);
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 60000, true);
  },
  shiftHours(value, absolute) {
    if (absolute) return new Utime(this.getTimeZone(), this.getValue() + value * 3600000);
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 3600000, true);
  },
  shiftDays(value) {
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 86400000, true);
  },
  shiftWeeks(value) {
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 604800000, true);
  },
  shiftMonths(value) {
    const date = this.toArray();
    const year = date[0], month = date[1], day = date[2];
    const monthDaysBefore = getMonthDays(year, month);
    var result = year * 12 + (month - 1) + value;
    date[1] = positiveModulo(result, 12) + 1;
    date[0] = Math.floor(result / 12);

    const monthDaysAfter = getMonthDays(date[0], date[1]);
    if (monthDaysBefore === day || day > monthDaysAfter) {
      date[2] = monthDaysAfter;
    }

    return new Utime(this.getTimeZone(), date);
  },
  shiftYears(value) {
    const date = this.toArray();
    if (date[1] !== 2) {
      date[0] += value;
      return new Utime(this.getTimeZone(), date);
    }

    const leapBefore = isLeapYear(date[0]);
    const leapAfter = isLeapYear(date[0] += value);

    if (!leapBefore && leapAfter && date[2] === 28) {
      date[2] = 29;
    } else if (leapBefore && !leapAfter && date[2] === 29) {
      date[2] = 28;
    }
    return new Utime(this.getTimeZone(), date);
  },
  beginingOfHour(shiftHours = 0) {
    var local = this._timeLocal();
    return new Utime(this.getTimeZone(), (Math.floor(local / 3600000) + shiftHours)  * 3600000, true);
  },
  beginingOfDay(shiftDays = 0) {
    var local = this._timeLocal();
    return new Utime(this.getTimeZone(), (Math.floor(local / 86400000) + shiftDays) * 86400000, true);
  },
  beginingOfMonth(shiftMonths = 0) {
    return new Utime(this.getTimeZone(), yearMonthIDtoArray(this.getYearMonthID() + shiftMonths));
  },

  endOfHour(shiftHours = 0) {
    var local = this._timeLocal();
    return new Utime(this.getTimeZone(), (Math.floor(local / 3600000) + 1 + shiftHours) * 3600000, true);
  },
  endOfDay(shiftDays = 0) {
    var local = this._timeLocal();
    return new Utime(this.getTimeZone(), (Math.floor(local / 86400000) + 1 + shiftDays) * 86400000, true);
  },
  endOfMonth(shiftMonths = 0) {
    return new Utime(this.getTimeZone(), yearMonthIDtoArray(this.getYearMonthID() + shiftMonths + 1));
  },
  next(dayOfWeek, skipIfCurrent = true, shiftWeeks = 0) {
    var daysToShift = dayOfWeek - this.dayOfWeek();
    if (daysToShift < 0 || (skipIfCurrent && !daysToShift)) {
      daysToShift += 7;
    }
    daysToShift += shiftWeeks * 7;
    return this.shiftDays(daysToShift);
  },
  previous(dayOfWeek, skipIfCurrent = true, shiftWeeks = 0) {
    var daysToShift = this.dayOfWeek() - dayOfWeek;
    if (daysToShift < 0 || (skipIfCurrent && !daysToShift)) {
      daysToShift += 7;
    }
    daysToShift = -daysToShift + shiftWeeks * 7;
    return this.shiftDays(daysToShift);
  }
}

module.exports = Utime;
