# utime
Javascript Date-Time minimalistic library

# Installation
```
npm install utime --save
```

# Timezones database repository
You can download timezone data from this repository:
https://github.com/DanielMazurkiewicz/utime-db

# Basic usage
Download desired timezones data, here we will use portuguese, polish and ukrainian zones.

```
const Utime = require('utime');
const pl = require('./pl');
const ua = require('./ua');
const pt = require('./pt');

Utime.registerZone('ua', ua);
Utime.registerZone('pl', pl, true); //true means this will be a default time zone
Utime.registerZone('pt', pt);


function printDateAndTime(utime) {
  console.log(`===== ${utime.getTimeZone()} =====`);
  console.log(utime.toString());
}


const plTime = new Utime('pl'); //will create Utime with current time
printDateAndTime(plTime);       //will print current time in Poland


const uaTime = plTime.in('ua');
printDateAndTime(uaTime);       //will print current time in Ukraine


const plTimeNumber = new Utime('pl', 4329474300000); //number represents date and time, can be retrieved by getValue() method
printDateAndTime(plTimeNumber);
console.log(plTimeNumber.getValue()); //prints number representing date and time - eg. can be stored and used to create new utime instance


const uaTimeArray = new Utime('ua', [2002, 1, 1,  12, 23, 13.8]); //date and time for given timezone can be provided in more readable array form
printDateAndTime(uaTimeArray);


const plTimeArray = new Utime([2002, 1, 1,  12, 23, 13.8]); //default time zone will be used - in this case "pl"
printDateAndTime(plTimeArray);


(new Utime())
  .in('pl', printDateAndTime)
  .in('ua', printDateAndTime)
  .in('pt', printDateAndTime)

const ptTimeToShift = new Utime('pt');
printDateAndTime(ptTimeToShift);
printDateAndTime(ptTimeToShift.shiftWeeks(2));

```

# API

## Utime.registerZone(name, timeZoneDatabase, defaultTimeZone)
Registers new time zone database with given name. Last parameter is optional and points a default time zone. Clean instance of Utime contains "utc" zone which is also default until new zone will be registeres as default

## Utime.isRegistered(name)
Checks if given time zone name is already registered

## utime.in(name, callback)
Returns new instance of Utime with date and time in given by name timezone.
Callback is optional, its argument is a new instance of Utime

## utime.getValue()
Returns number representing date and time

## utime.toString()
Returns date and time in current time zone as text in simplified ISO format

## utime.toDate()
Returns Javascript Date() instance

## utime.toArray()
Returns current time zone date and time as an array (together with timezone name can be used to instantiate new Utime)

## utime.second()
Returns number representing current time zone seconds

## utime.minute()
Returns number representing current time zone minutes

## utime.hour()
Returns number representing current time zone hours

## utime.day()
Returns number representing current time zone day

## utime.month()
Returns number representing current time zone month

## utime.year()
Returns number representing current time zone year

## utime.dayOfWeek()
Returns number representing current time zone day of week where 0 means Monday and 6 means Sunday

## utime.getYearMonthID()
Returns number representing current time zone unique identifier for combination of year and month

## utime.getWeekID()
Returns number representing current time zone unique identifier of week

## utime.getDayID()
Returns number representing current time zone unique identifier of day

## utime.getHourID()
Returns number representing current time zone unique identifier of hour

## utime.getTimeZone()
Returns text representing a registered name of current time zone

## utime.shiftSeconds(value, absolute)
Returns new instance of Utime with current time zone date and time shifted by given number of seconds (can be also negative).
"absolute" is optional parameter and set to true makes shift not taking into consideration time changes, just shifts given number of seconds

## utime.shiftMinutes(value)
Returns new instance of Utime with current time zone date and time shifted by given number of minutes (can be also negative).
"absolute" is optional parameter and set to true makes shift not taking into consideration time changes, just shifts given number of minutes

## utime.shiftHours(value)
Returns new instance of Utime with current time zone date and time shifted by given number of hours (can be also negative).
"absolute" is optional parameter and set to true makes shift not taking into consideration time changes, just shifts given number of hours

## utime.shiftDays(value)
Returns new instance of Utime with current time zone date and time shifted by given number of days (can be also negative)

## utime.shiftWeeks(value)
Returns new instance of Utime with current time zone date and time shifted by given number of weeks (can be also negative)

## utime.shiftMonths(value)
Returns new instance of Utime with current time zone date and time shifted by given number of months (can be also negative)

## utime.shiftYears(value)
Returns new instance of Utime with current time zone date and time shifted by given number of years (can be also negative)

## utime.beginingOfHour()
Returns new instance of Utime with current time zone date and time adjusted to begining of an hour

## utime.beginingOfDay()
Returns new instance of Utime with current time zone date and time adjusted to begining of a day

## utime.beginingOfMonth()
Returns new instance of Utime with current time zone date and time adjusted to begining of a month

## utime.endOfHour()
Returns new instance of Utime with current time zone date and time adjusted to end of an hour (exactly begining of next hour)

## utime.endOfDay()
Returns new instance of Utime with current time zone date and time adjusted to end of a day (exactly begining of next day)

## utime.endOfMonth()
Returns new instance of Utime with current time zone date and time adjusted to end of a day (exactly begining of next month)

## next(dayOfWeek, dontReturnCurrentDay = true)
Returns new instance of Utime with current time zone date and time adjusted to next occurence of day provided by "dayOdWeek" parameter.
"dontReturnCurrentDay" is optional and if set to false allows to return as result also current day (if it matches dayOfWeek)

## previous(dayOfWeek, dontReturnCurrentDay = true)
Returns new instance of Utime with current time zone date and time adjusted to previous occurence of day provided by "dayOdWeek" parameter.
"dontReturnCurrentDay" is optional and if set to false allows to return as result also current day (if it matches dayOfWeek)

