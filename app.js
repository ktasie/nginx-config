import promptSync from 'prompt-sync';
import singleDomainBlockConfig from './singleDomainBlockConfig.js';

const prompt = promptSync({ sigint: true })

const menuItem = new Map();


menuItem.set(1, '1. Create a new domain configuration block on nginx: ');
menuItem.set(2, '2. Create bulk domains configuration block on nginx (upload a file domains.txt): ');
menuItem.set(3, '3. Delete a single domain configurations block and SSL certificate from nginx: ')
menuItem.set(4, '4. Exit:');
//menuItem.set('question', 'What do you want to do? (select 1-4): ');

for(let [key, values] of menuItem){
    console.log(values)
}

console.log('');

const feedback = { num: 0, ssl: '', domain: ''};

const exitProgram = ()=>{
    console.log('Program exiting... ')
    process.exit();
}

while(feedback.num < 1 || feedback.num > 4){
    feedback.num = prompt('What do you want to do? (select 1-4): ');
    feedback.num = Number(feedback.num)
}

if(feedback.num === 4){
    exitProgram();
}

feedback.domain = prompt('What is the domain name (without www)? ');

while(feedback.ssl === ''){
    
    feedback.ssl = prompt(`Will ${feedback.domain} be secured (y/n)? `)
    feedback.ssl = feedback.ssl.toUpperCase();
    console.log(feedback)

}

switch(feedback.num){
    case(1): 
        singleDomainBlockConfig(feedback)
        break;
    case(2): 
        console.log('2 selected');
        break;
    case(3):
        console.log('3 selected')
        break;
    default:
        console.log('ends')
}




