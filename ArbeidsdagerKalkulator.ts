interface Time {
  Hours: number;
  Minutes: number;
}

interface Holiday {
  Year: number;
  Month: number;
  Day: number;
}

export interface Config {
  WorkdayStart: Time;
  WorkdayStop: Time;
  RecurringHolidays: Holiday[];
  Holidays: Holiday[];
  StartDate: string;
  Increment: number;
  ExpectedResult: Holiday
}

export class WorkdayCalculator {
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
      recurringHoliday.setMonth(holiday.Month - 1, holiday.Day); // -1 to account for zero-based indexing for months
      return recurringHoliday;
    });

    this.holidays = config.Holidays.map((holiday) => {
      const fixedHoliday = new Date();
      fixedHoliday.setFullYear(holiday.Year, holiday.Month - 1, holiday.Day); // -1 to account for zero-based indexing for months
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
    let remainingminutesIncrements = Math.floor(Math.abs(increment) % 1 * 60 * workdayHours);
    

    while (remainingdayIncrements > 0) {      
      if (this.isWorkday(currentDate)) {
            remainingdayIncrements--;
      }
      currentDate.setDate(currentDate.getDate() + incrementDirection);
    }
    
    while (remainingminutesIncrements > 0) {
      if (this.isWorkingHours(currentDate)) {
            remainingminutesIncrements--;
      }
      currentDate.setMinutes(currentDate.getMinutes() + incrementDirection);
    }

    while (!this.isWorkday(currentDate)) { // In case the day we end up on is not a workday
      currentDate.setDate(currentDate.getDate() + incrementDirection);
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
            return false; // Outside working hours
      } else if (currentHour === startHour && currentMinutes < startMinutes) {
            return false; // Outside working hours
      }      

      // Checking if time is after workday stop
      if (currentHour > stopHour) {
            return false; // Outside working hours
      } else if (currentHour === stopHour && currentMinutes > stopMinutes) {
            return false; // Outside working hours
      }

      return true // Inside working hours
          
  }

  private isWorkday(date: Date): boolean {
    const day = date.getDay();
    if (day === 0 || day === 6) {
      return false; // Weekend
    }

    if (this.isHoliday(date)) {
      return false; // Holiday
    }

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

  public formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
