import fs from 'fs';
import { Config, WorkdayCalculator } from './ArbeidsdagerKalkulator';

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