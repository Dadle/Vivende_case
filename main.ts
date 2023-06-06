import { Config, WorkdayCalculator } from './ArbeidsdagerKalkulator';

/**
 * This file was set up to parse the input from command line as requested in the case description.
 * This script was developed on a Windows machine, so if you are using a Mac or Linux OS you may need to format your json differently.
 * 
 * To run this file from the commandline, use this command:
 * 'npx ts-node main.ts "{""WorkdayStart"":{""Hours"":8,""Minutes"":0},""WorkdayStop"":{""Hours"":16,""Minutes"":0},""RecurringHolidays"":[{""Month"":7,""Day"":25}],""Holidays"":[{""Year"":2020,""Month"":7,""Day"":27}],""StartDate"":""30-07-2020 18:05"",""Increment"":-5.5}"
 */
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Missing input argument.');
    process.exit(1);
  }

let config: Config;

try {
    config = JSON.parse(args[0]);
  } catch (error) {
    console.error(`Invalid input argument. Please provide a valid JSON string.
    Example json: 
    "{""WorkdayStart"":{""Hours"":8,""Minutes"":0},
        ""WorkdayStop"":{""Hours"":16,""Minutes"":0},
        ""RecurringHolidays"":[{""Month"":7,""Day"":25}],
        ""Holidays"":[{""Year"":2020,""Month"":7,""Day"":27}],
        ""StartDate"":""30-07-2020 18:05"",
        ""Increment"":-5.5}"`);
    process.exit(1);
  }

const calculator = new WorkdayCalculator(config);
const endDate = calculator.calculateEndDate(config.StartDate, config.Increment);
console.log(endDate);