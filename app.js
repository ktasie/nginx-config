import fs from 'fs';
import os from 'os';
import promptSync from 'prompt-sync';
import singleDomainBlockConfig from './singleDomainBlockConfig.js';
import deleteDomainBlock from './deleteDomainBlock.js';

const prompt = promptSync({ sigint: true });

const menuItem = new Map();

menuItem.set(1, '1. Create a new domain configuration block on nginx: ');
menuItem.set(
  2,
  '2. Create bulk domains SSL based configuration block on nginx (domains.txt): ',
);
menuItem.set(
  3,
  '3. Delete a single domain configurations block and SSL certificate from nginx: ',
);
menuItem.set(4, '4. Exit:');
//menuItem.set('question', 'What do you want to do? (select 1-4): ');

const domainPath = './domains.txt';
let arrDomains = [];

for (let [key, values] of menuItem) {
  console.log(values);
}

console.log('');

const feedback = { num: 0, ssl: '', domain: '' };

const exitProgram = () => {
  console.log('Program exiting... ');
  process.exit();
};

while (feedback.num < 1 || feedback.num > 4) {
  feedback.num = prompt('What do you want to do? (select 1-4): ');
  feedback.num = Number(feedback.num);
}

if (feedback.num === 4) {
  exitProgram();
} else if (feedback.num === 1) {
  feedback.domain = prompt('What is the domain name (without www)? ');

  while (feedback.ssl === '') {
    feedback.ssl = prompt(`Will ${feedback.domain} be secured (y/n)? `);
    feedback.ssl = feedback.ssl.toUpperCase();
    //console.log(feedback)
  }
} else if (feedback.num === 2) {
  const domains = fs.readFileSync(`${domainPath}`, 'utf-8');
  arrDomains = domains.split(os.EOL);
} else if (feedback.num === 3) {
  while (feedback.domain === '') {
    feedback.domain = prompt('What is the domain name (without www)? ');
  }
}

switch (feedback.num) {
  case 1:
    singleDomainBlockConfig(feedback);
    break;
  case 2:
    // Loop through number of domains
    for (let i = 0; i < arrDomains.length; i++) {
      feedback.ssl = 'Y';
      feedback.domain = arrDomains[i];
      singleDomainBlockConfig(feedback);
    }
    break;
  case 3:
    deleteDomainBlock(feedback.domain);
    break;
  default:
    console.log('Please contact Admin. How did you get here!');
}
