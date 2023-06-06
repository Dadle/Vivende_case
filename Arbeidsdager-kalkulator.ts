import fs from 'fs';

interface Time {
  Hours: number;
  Minutes: number;
}

interface Holiday {
  Year: number;
  Month: number;
  Day: number;
}

interface Config {
  WorkdayStart: Time;
  WorkdayStop: Time;
  RecurringHolidays: Holiday[];
  Holidays: Holiday[];
  StartDate: string;
  Increment: number;
}

class WorkdayCalculator {
  private workdayStart: Date;
  private workdayStop: Date;
  private recurringHolidays: Date[];
  private holidays: Date[];

  constructor(config: Config) {
    this.workdayStart = new Date();
    this.workdayStart.setHours(config.WorkdayStart.Hours, config.WorkdayStart.Minutes, 0, 0);

    this.workdayStop = new Date();
    this.workdayStop.setHours(config.WorkdayStop.Hours, config.WorkdayStop.Minutes, 0, 0);

    this.recurringHolidays = config.RecurringHolidays.map((holiday: Holiday) => {
      const recurringHoliday = new Date();
      recurringHoliday.setMonth(holiday.Month - 1, holiday.Day);
      return recurringHoliday;
    });

    this.holidays = config.Holidays.map((holiday) => {
      const fixedHoliday = new Date();
      fixedHoliday.setFullYear(holiday.Year, holiday.Month - 1, holiday.Day);
      return fixedHoliday;
    });
  }

  public calculateEndDate(startDate: string, increment: number): string {
    const date = this.parseStartDate(startDate);
    const endDate = this.incrementWorkdays(date, increment);
    return this.formatDate(endDate);
  }

  private parseStartDate(startDate: string): Date {
    const [datePart, timePart] = startDate.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const date = new Date();
    date.setFullYear(year, month - 1, day);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private incrementWorkdays(startDate: Date, increment: number): Date {
    const currentDate = new Date(startDate.getTime());
    const workdayHours = this.workdayStop.getHours() - this.workdayStart.getHours();
    const incrementDirection = Math.sign(increment);
    let remainingdayIncrements = Math.floor(Math.abs(increment));
    const rawHours = 0; //Math.abs(increment % 1) * workdayHours;
    const rawMinutes = Math.abs(increment) % 1;
    console.log("increment: " + increment);
    console.log("increment % 1: " + increment % 1);
    console.log("rawDays: " + Math.floor(Math.abs(increment)));
    console.log("rawHours: " + rawHours);
    console.log("rawMinutes: " + rawMinutes);
    let remaininghourIncrements = Math.floor(Math.abs(rawHours));
    let remainingminutesIncrements = Math.floor(rawMinutes * 60 * workdayHours);
    

    console.log("remaininghourIncrements: " + remaininghourIncrements);
    console.log("remainingminutesIncrements: " + remainingminutesIncrements);
    console.log("currentDate: " + currentDate)
    
    console.log(remaininghourIncrements)
    console.log(incrementDirection)
    console.log(workdayHours)

    console.log("")
    console.log("Starting Days incrementation")
    console.log("Current time is: " + currentDate)

    while (remainingdayIncrements > 0) {      
      if (this.isWorkday(currentDate)) {
            remainingdayIncrements--;
      }
      currentDate.setDate(currentDate.getDate() + incrementDirection);
      //console.log("Remaining day increments: " + remainingdayIncrements)
      //console.log("Current time is: " + currentDate)
    }
    while (!this.isWorkday(currentDate)) { // In case the day we end up on is not a workday
      currentDate.setDate(currentDate.getDate() + incrementDirection);
      //console.log("Still not a workday")
      //console.log("Current time is: " + currentDate)
    }
    console.log("Current time after days: " + currentDate)

    console.log("")
    console.log("Starting Hours incrementation")

    while (remaininghourIncrements > 0) {
      
      console.log("Remaining hour increments: " + remaininghourIncrements)
      console.log("Current time is: " + currentDate)
      if (this.isWorkingHours(currentDate)) {
            remaininghourIncrements--;
      }
      currentDate.setHours(currentDate.getHours() + incrementDirection);
    }

    console.log("")
    console.log("Starting minutes incrementation")

    while (remainingminutesIncrements > 0) {
      
      //console.log("Remaining minutes increments: " + remainingminutesIncrements)
      //console.log("Current time is: " + currentDate)
      if (this.isWorkingHours(currentDate)) {
            remainingminutesIncrements--;
      }
      currentDate.setMinutes(currentDate.getMinutes() + incrementDirection);
    }

    return currentDate;
  }

  private isWorkingHours(date: Date): boolean {
      const currentHour = date.getHours()
      const currentMinutes = date.getMinutes()
      const startHour = this.workdayStart.getHours()
      const startMinutes = this.workdayStart.getMinutes()
      const stopHour = this.workdayStop.getHours()
      const stopMinutes = this.workdayStop.getMinutes()

      // Checking if time is before workday start
      if (currentHour < startHour) {
            //console.log("Outside working hours")
            return false; // Outside working hours
      } else if (currentHour === startHour && currentMinutes < startMinutes) {
            //console.log("Outside working hours")
            return false; // Outside working hours
      }      

      // Checking if time is after workday stop
      if (currentHour > stopHour) {
            //console.log("Outside working hours")
            return false; // Outside working hours
      } else if (currentHour === stopHour && currentMinutes > stopMinutes) {
            //console.log("Outside working hours")
            return false; // Outside working hours
      }

      //console.log("Inside working hours")
      return true // Inside working hours
          
  }

  private isWorkday(date: Date): boolean {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      //console.log("Weekend")
      return false; // Weekend
    }

    if (this.isHoliday(date)) {
      //console.log("Holiday")
      return false; // Holiday
    }

    //console.log("Workday")

    return true
  }

  private isHoliday(date: Date): boolean {
    for (const recurringHoliday of this.recurringHolidays) {
      if (date.getMonth() === recurringHoliday.getMonth() && date.getDate() === recurringHoliday.getDate()) {
        return true;
      }
    }

    for (const holiday of this.holidays) {
      if (date.getFullYear() === holiday.getFullYear() && date.getMonth() === holiday.getMonth() && date.getDate() === holiday.getDate()) {
        return true;
      }
    }

    return false;
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}

// Parsing command line arguments
/*const args = process.argv.slice(2);
const config: Config = JSON.parse(args[0]);
const calculator = new WorkdayCalculator(config);
const endDate = calculator.calculateEndDate(config.StartDate, config.Increment);
console.log(endDate);*/


fs.readFile("test_cases.json", 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const configList: Config[] = JSON.parse(data);
    configList.forEach((config) => {
      if (config.Increment != -5.5){
            //return;
      }
      const calculator = new WorkdayCalculator(config);
      const endDate = calculator.calculateEndDate(config.StartDate, config.Increment);
      console.log(endDate);
      console.log("")
    })
    
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});