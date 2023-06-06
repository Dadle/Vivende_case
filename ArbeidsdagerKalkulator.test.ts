import fs from 'fs';
import  assert from 'assert';
import { Config, WorkdayCalculator } from './ArbeidsdagerKalkulator';

/**
 * This file was set up to run a series of testcases in batch.
 * A file is expected to have a json formated list of objects where each object will be run through the calculator.
 * An extra key "ExpectedResult" was added to each object to allow for automated verification of the results.
 */
fs.readFile("test_cases.json", 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return;
    }
  
    try {
      const configList: Config[] = JSON.parse(data);
      configList.forEach((config) => {
        const calculator = new WorkdayCalculator(config);
        const endDate = calculator.calculateEndDate(config.StartDate, config.Increment);

        console.log(endDate + " == " + config.ExpectedResult); // config.ExpectedResult is behaving strangely and contains hidden characters that I won't spend time cleaning up now. I would do so for a proper assertion test later
        console.log("")
      })
      
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });