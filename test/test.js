const Utime = require('../utime');
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

