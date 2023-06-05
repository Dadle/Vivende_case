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
  RecurringHolidays: Time[];
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

    this.recurringHolidays = config.RecurringHolidays.map((holiday) => {
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
    const endDate = this.addWorkdays(date, increment);
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

  private addWorkdays(startDate: Date, increment: number): Date {
    let currentDate = new Date(startDate.getTime());
    let remainingIncrement = increment;

    while (remainingIncrement > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (this.isWorkday(currentDate)) {
        remainingIncrement -= 1;
      }
    }

    while (remainingIncrement < 0) {
      currentDate.setDate(currentDate.getDate() - 1);
      if (this.isWorkday(currentDate)) {
        remainingIncrement += 1;
      }
    }

    return currentDate;
  }

  private isWorkday(date: Date): boolean {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return false; // Weekend
    }

    if (this.isHoliday(date)) {
      return false; // Holiday
    }

    return (
      date >= this.getWorkdayStart(date) &&
      date <= this.getWorkdayStop(date)
    );
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

  private getWorkdayStart(date: Date): Date {
    const workdayStart = new Date(date);
    workdayStart.setHours(this.workdayStart.getHours(), this.workdayStart.getMinutes(), 0, 0);
    return workdayStart;
  }

  private getWorkdayStop(date: Date): Date {
    const workdayStop = new Date(date);
    workdayStop.setHours(this.workdayStop.getHours(), this.workdayStop.getMinutes(), 0, 0);
    return workdayStop;
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
    const config: Config[] = JSON.parse(data);
    config.forEach((entry) => {
      console.log(entry);
    })
    
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});