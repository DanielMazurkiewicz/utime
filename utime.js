
const zones = {
  utc: {byUtc:[], byLocal:[]}
};

let defaultZone = 'utc';

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
      time[2], 
      time[3], 
      time[4], 
      time[5]) + (time[5] ? (time[5] - (time[5] | 0)) * 1000 : 0);
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

  toString() {
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

  shiftSeconds(value) {
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 1000, true);
  },
  shiftMinutes(value) {
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 60000, true);
  },
  shiftHours(value) {
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 3600000, true);
  },
  shiftDays(value) {
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 86400000, true);
  },
  shiftWeeks(value) {
    return new Utime(this.getTimeZone(), this._timeLocal() + value * 604800000, true);
  }
}

module.exports = Utime;
