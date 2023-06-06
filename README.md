# Vivende_case
Intervju case for Vivende


# Installation instrcutions

To run this script npx ts-node is all that is required. 
You will need to have ts-node and typescript installed as dependencies. 

Here are the steps to install them:
- Node.js: Download it from the official website https://nodejs.org
- Open a terminal or command prompt and navigate to your project directory.
- Run the following command to install ts-node and typescript as local dependencies in your project:
- npm install ts-node typescript --save-dev
This command installs ts-node and typescript as dev dependencies and adds them to the devDependencies section of your project's package.json file.

Once you have installed ts-node and typescript, you can use npx ts-node to run TypeScript files directly without explicitly compiling them to JavaScript.

To run a single json input from the case description run this command:

`$ npx ts-node main.ts "{""WorkdayStart"":{""Hours"":8,""Minutes"":0},""WorkdayStop"":{""Hours"":16,""Minutes"":0},""RecurringHolidays"":[{""Month"":7,""Day"":25}],""Holidays"":[{""Year"":2020,""Month"":7,""Day"":27}],""StartDate"":""30-07-2020 18:05"",""Increment"":-5.5}"`

(Keep in mind that this json example is formated for windows and the formating may deviate if you are using Mac or Linux OS.)


If you wish to just run a bunch of cases in one batch run this command:

`$ npx ts-node ArbeidsdagerKalkulator.test.ts`
