'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: `Danny Bimma`,
  transactions: [8000, 45000, 4800000, -2000, -4500, 6000000, -400, 444444],
  interestRate: 1.4,
  pin: 2996,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const transactionContainer = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const transactionDisplay = function (transactions, sort = false) {
  // clear previous transactions from display:
  transactionContainer.innerHTML = ``;

  const trans = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;

  // loop over the transactions in account5:
  trans.forEach(function (trans, index) {
    // create withdrawal / deposit logic:
    const type = trans > 0 ? `deposit` : `withdrawal`;
    // create html to display transactions:
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__value">${trans}€</div>
  </div>`;

    // insert html to be displayed:
    transactionContainer.insertAdjacentHTML('afterbegin', html);
  });
};

// Call transactionDisplay:
// transactionDisplay(account5.transactions);

// Calculate the total balance for account transactions:
const balanceDisplay = function (acc) {
  // use the reduce method:
  acc.balance = acc.transactions.reduce(function (acc, curr, i, arr) {
    return acc + curr;
  }, 0);
  // change balance display:
  labelBalance.textContent = `${acc.balance}€`;
};
// Call balanceDisplay:
// balanceDisplay(account5.transactions);

// Calculate the display summary:
const calcDisplaySummary = function (acc) {
  // calculate the incomes and store in a var:
  const incomes = acc.transactions
    .filter(transaction => transaction > 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  // insert the results into the html:
  labelSumIn.textContent = `${incomes}€`;
  // do the same for outgoing transactions:
  const outs = acc.transactions
    .filter(transaction => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  labelSumOut.textContent = `${Math.abs(outs)}€`;
  // calculate and display the interests:
  const interests = acc.transactions
    .filter(transaction => transaction > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interests}€`;
};
// Call calcDisplaySummary:
// calcDisplaySummary(account5.transactions);

// Implement Login:
// Event Handlers:
/*
HTML automatically reloads pages by default when forms are submitted. To stop 
the default action you have to explicitly do so with the prevent default method.
*/
// Create an undefined variable for current account:
let currentAcc;

btnLogin.addEventListener(`click`, event => {
  // stop default page submission/reload from login form:
  event.preventDefault();
  // return the user account that matches the user login:
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);
  console.log(currentAcc);
  // verify if input login pin matches the user account pin:
  // (the find method will return undefined if no element matches the condition.
  // to prevent console errors with wrong pins use optional chaining):
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    // display UI and message:
    labelWelcome.textContent = `Yo ${
      currentAcc.owner.split(' ')[0]
    }, wa gine on??!`;
    containerApp.style.opacity = 100;
    // clear input fields:
    inputLoginUsername.value = ` `;
    inputLoginPin.value = ` `;
    // remove focus from input fields:
    inputLoginPin.blur();
    inputLoginUsername.blur();
    // // display transactions:
    updateUI(currentAcc);
    // transactionDisplay(currentAcc.transactions);
    // // display balance:
    // balanceDisplay(currentAcc);
    // // display summary:
    // calcDisplaySummary(currentAcc);
  }
});

// Implement Transfers:
btnTransfer.addEventListener(`click`, event => {
  // stop default page submission/reload from login form:
  event.preventDefault();
  // store the transfer amount in a variable:
  const transAmount = Number(inputTransferAmount.value);
  // store the transfer recipient in a variable:
  const transRecipient = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  // clear input fields:
  inputTransferAmount.value = ` `;
  inputTransferTo.value = ` `;
  // define transfer conditions:
  if (
    transAmount > 0 &&
    transRecipient &&
    currentAcc.balance >= transAmount &&
    transRecipient?.userName !== currentAcc.userName
  ) {
    console.log(`Transfer validity has been successfully validated!`);
    // implement the actual transfer:
    currentAcc.transactions.push(-transAmount);
    transRecipient.transactions.push(transAmount);
    // update UI
    updateUI(currentAcc);
  }
});

btnLoan.addEventListener(`click`, event => {
  // stop default page reload from html form:
  event.preventDefault();
  // store client requested amt in a variable:
  const loanReq = Number(inputLoanAmount.value);

  // check that conditions for loan are met:
  if (
    loanReq > 0 &&
    currentAcc.transactions.some(trans => trans >= loanReq / 10)
  ) {
    // credit loan req to acc:
    currentAcc.transactions.push(loanReq);
    // update UI:
    updateUI(currentAcc);
  }
  inputLoanAmount.value = ``;
});

// Add event handler to close account button:
btnClose.addEventListener(`click`, event => {
  // stop default page reload from html form:
  event.preventDefault();
  // check that the username & pin are valid:
  if (
    currentAcc.userName === inputCloseUsername.value &&
    currentAcc.pin === Number(inputClosePin.value)
  ) {
    // store the index calculation for the acc to be deleted:
    const index = accounts.findIndex(
      acc => acc.userName === currentAcc.userName
    );
    console.log(index);
    // delete the account using the splice method:
    accounts.splice(index, 1);
    // hide UI:
    containerApp.style.opacity = 0;
  }
});

// Create function to update UI:
const updateUI = function (acc) {
  // display transactions:
  transactionDisplay(acc.transactions);
  // display balance:
  balanceDisplay(acc);
  // display summary:
  calcDisplaySummary(acc);
};

let sorted = false;
btnSort.addEventListener(`click`, e => {
  e.preventDefault();
  transactionDisplay(currentAcc.transactions, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Simple Array Methods:
console.log(`---SIMPLE ARRAY METHODS---`);
/*
Methods in JS are simply functions that you can call on objects, ot functions
that are attached to objects. And since arrays are considered objects in JS, they
have a bunch of useful methods to take advantage of when working with them. 
*/

// The Slice Method:
console.log(`---THE SLICE METHOD---`);
/*
This slice method on arrays is very similar to the slice methods used on strings. 
Using it will allow you to extract any range of elements from an array without 
mutating the original array. Instead, it returns a new array made of the extracted
elements from the array the method was used on.

The slice method can take two arguments. The first being the index of the element
you want to start the extraction at, and the second argument is the index of the 
element that you the extract to stop at but not include. If the second argument 
is not provided, the slice method will extract all the array elements from the specified
starting point until the end of the array. If NO arguments are provided, the slice method
will just make a shallow copy of the array.
*/

// Store letters in a variable:
const alphaOne = [`a`, `b`, `c`, `d`, `e`, `f`, `g`];
// Use the slice method and store the value in a new variable:
const extOne = alphaOne.slice(2);
// Log the extracted value to the console:
console.log(extOne);

// Use the slice method and include the second argument:
const fromAtoC = alphaOne.slice(0, 3);
// Log result to the console:
console.log(fromAtoC);

// Use the slice method to copy the alphaOne array:
const alphaCopy = alphaOne.slice();
// Log the copy to the console:
console.log(alphaCopy);

// The Splice Method:
console.log(`---THE SPLICE METHOD---`);
/*
The splice method basically works in the same exact way as the slice method, 
but the major difference is that the splice method actually mutates the array
on which it is called. 

Another minor difference is with the second argument. In the splice method the 
inclusion of the second argument is know as the delete count. So called because
it deletes the amount of elements specified starting from the first argument. 
*/

// Use splice on the alphaOne array:
console.log(alphaOne.splice(2));
// Log alphaOne to the console:
console.log(alphaOne);
// Call the slice method on alphaCopy with 2 arguments:
console.log(alphaCopy.splice(1, 4));
// Log alpha copy to the console:
console.log(alphaCopy);

// The Reverse Method:
console.log(`---THE REVERSE METHOD---`);
/*
The reverse method is a pretty simple one as far as JS methods go. It does
exactly what it sounds like it does, which is simply to reverse the elements
in an array.

It's important to note that the reverse method DOES mutate the original array
as well as returning a the reversed value.
*/

// Store letters in a variable again:
const alphaTwo = [`a`, `b`, `c`, `d`, `e`, `f`, `g`];
// Use the reverse method on alphaTwo and store the returned value:
const twoAlpha = alphaTwo.reverse();
// Log twoAlpha to the console:
console.log(twoAlpha);
// Log alphaTwo to the console:
console.log(alphaTwo);

// The Concat Method:
console.log(`---THE CONCAT METHOD---`);
/*
The concat method is another pretty straightforward array method. It 
simply joins the array its called on with the array passed in as an argument. 

It does NOT mutate the original array.
*/

// Create an array of numbers;
const ranNum = [1, 2, 3];
// Create another array of number:
const ranNumTwo = [4, 5, 6];
// Join the two arrays above using the concat method:
const oneToSix = ranNum.concat(ranNumTwo);
// Log the result to the console:
console.log(oneToSix);

// The Join Method:
console.log(`---THE JOIN METHOD---`);
/*
The join method produces a string from all the elements of an array joined
together by the character passed in as an argument
*/

// Use the join method one oneToSix:
console.log(oneToSix.join(` and a `));

// Looping Arrays: forEach:
console.log(`---Looping Over Arrays---`);
/*
You have experience looping over arrays using the for of loop, but the for each
loop is fundamentally different.
*/

// Array of bank account transactions:
// (The positive numbers are deposits. Negative numbers are withdrawals)
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Loop movements and log to the console if each value was a withdrawal or deposit:
// Use for of statement:
console.log(`---FOR OF STATEMENT---`);

for (const transaction of movements) {
  // if number is more than 0 print deposit msg:
  transaction > 0
    ? console.log(
        `You've successfully deposited $${transaction}. Very right to save ya money!!`
      )
    : console.log(
        `You've successfully withdrawn $${Math.abs(
          transaction
        )}. Don't spend all one place`
      );
}

/*
The forEach method is a cleaner and easier alternative to the for of statement. But
it's very different, because it's actually a higher-oder function that takes a call-
back function. And it works by looping over the array and for each iteration it will
execute the code in the call-back function. And since the forEach method is a higher-
order function calling a call-back function, it will pass in the current element of
the array as a argument on each iteration.
*/
console.log(`---FOR EACH STATEMENT---`);

// Use a for each method to produce the same result as above:
movements.forEach(function (transaction) {
  if (transaction > 0) {
    console.log(
      `You've successfully deposited $${transaction}. Very right to save ya money!!`
    );
  } else {
    console.log(
      `You've successfully withdrawn $${Math.abs(
        transaction
      )}. Don't spend all one place`
    );
  }
});

/*
When using the for of statement, you were able to access the index number of
each iterable by using destructuring in order to make a counter or track 
entries.

The same thing can be done with the forEach method but much easier! When you
use the forEach method, it passes in each element in an array as an argument 
on each iteration. But it also passes in the current index and the entire 
array. And you can access them by passing them in as parameters to the forEach
higher order function. The names you give those parameters doesn't matter because 
they always represent the same things. But the order matters!! The first param 
is always the array values, the second is always the index numbers, and the third 
is the array itself.
*/
console.log(`---FOR EACH STATEMENT PARAMS---`);

// Loop over the array again with more params:
movements.forEach(function (transaction, transNum, accountHistory) {
  if (transaction > 0) {
    console.log(
      `This is visit number ${
        transNum + 1
      } you made to this ATM. You've successfully deposited $${transaction}. Very right to save ya money!!`
    );
  } else {
    console.log(
      `This is visit number ${
        transNum + 1
      } you made to this ATM. You've successfully withdrawn $${Math.abs(
        transaction
      )}. Don't spend all one place!! Your account history is (${accountHistory})!!`
    );
  }
});

// forEach With Maps and Sets:
console.log(`---FOR EACH WITH MAPS AND SETS---`);
/*
The forEach method works in pretty much the same when called on maps as it does on
arrays. The forEach method will call a callback function that will be executed for
each iteration of the array / map. With maps, the arguments that the forEach method
passes into the callback function represent the value, the key, and the map itself.

And the forEach method works the same it on sets as it does on maps, there's only one
minor difference due to the fact that sets don't have keys. So with sets the second 
parameters represents the same value as the first.
*/

// Currencies map:
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Call the forEach method on the currencies map:
currencies.forEach(function (value, key, map) {
  console.log(`Currency: ${value} (${key})`);
});

// Creating DOM Elements:
/*

*/

// Coding Challenge #1
console.log(`---CODING CHALLENGE---`);
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about 
their dog's age, and stored the data into an array (one array for each). For now, 
they are just interested in knowing whether a dog is an adult or a puppy. A dog is 
an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages 
('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, 
not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied 
array (because it's a bad practice to mutate function parameters)

2. Create an array with both Julia's (corrected) and Kate's data

3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, 
and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")

4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
GOOD LUCK 😀
*/

// 1:
// Create a function called checkDogs with 2 parameters for julia and kate's data:
const checkDogs = function (dogsJulia, dogsKate) {
  // create a shallow copy of Julia's array data:
  const juliaData = dogsJulia;
  // remove the last two elements from juliaData:
  juliaData.length = 3;
  // remove the first elements from juliaData:
  juliaData.shift();

  // 2:
  // Create an array with both Julia's (corrected) & Kate's data:
  const fullDogData = juliaData.concat(dogsKate);

  // 3:
  // loop over fullDogData with forEach and get each element and it's index:
  fullDogData.forEach(function (dogAge, dogIndex) {
    // if dogAge is more than or equal to 3 then log adult dog msg:
    if (dogAge >= 3) {
      console.log(
        `Dog number ${dogIndex + 1} is an adult, and is ${dogAge} years old!`
      );
      // else log puppy msg:
    } else {
      console.log(`Dog number ${dogIndex + 1} is still a puppy 🐶!`);
    }
  });
};

// 4:
const juliaArr = [3, 5, 2, 12, 7];
const KateArr = [4, 1, 15, 8, 3];

const juliaArr1 = [9, 16, 6, 8, 3];
const kateArr1 = [10, 5, 6, 1, 4];

checkDogs(juliaArr, KateArr);
checkDogs(juliaArr1, kateArr1);

// Data Transformations (Map, Filter, Reduce):
/*
In JavaScript they are 3 big and important data transformation tools
that you will find yourself using fairly often. And they are all 
basically methods that are used to create new arrays based on the data
pull out of existing arrays:

Map:
This is yet another method that you can use to loop over arrays, and it
actually works in a similar fashion to the forEach method. The differentiating 
factor is that Map will create a whole new array when it loops over an existing 
one.

Filter:
This method allows you to do just as the name says. It will filter through an array
and return a new array filled with elements from the array it was called on that meets
a certain condition. 

Reduce:
This is used to boil down or (reduce) all the elements in an array into one single value.
*/

// The Map Method:
console.log(`---THE MAP METHOD---`);

// Create an array of account balances:
const accBalances = [100, 438, 634, 795, 345, 3845, 87654, 6834, 476548];

// Use the map method to multiply all numbers in accBalances by 4.20:
const weedBalances = accBalances.map(function (amt) {
  return amt * 4.2;
});

// Log accBalances and weedBalances to the console:
console.log(accBalances);
console.log(weedBalances);

// Arrow function version:
const arrowTest = accBalances.map(amt => amt * 0.25);
// Log arrowTest to the console;
console.log(arrowTest);

// Computing Usernames:
console.log(`---COMPUTING USERNAMES---`);
/*
Usernames for the fictional back accounts in this codebase are made up 
of the initials of the user's full name. Write some code using the methods
you've learnt to compute usernames. 
*/

// Create a function to compute usernames from the user accounts:
const nameCode = function (accounts) {
  // mutate each account passed into the function:
  accounts.forEach(function (account) {
    // add a new property to each account called userName and set it to the owner
    // property in the account objects:
    account.userName = account.owner
      // convert the letters from the userName to lowercase:
      .toLocaleLowerCase()
      // split the string by it's spaces to create an array of 3 names:
      .split(` `)
      // loop over the array that was created by split and return a new array with
      // only the first letters of the names in the array:
      .map(function (initials) {
        return initials[0];
      })
      // join the letters returned by the map method
      // together in a single string:
      .join(``);
  });
};

// Call the nameCode function and pass the accounts array into ot:
nameCode(accounts);
// Log accounts to the console:
console.log(accounts);

// The Filter Method:
console.log(`---THE FILTER METHOD---`);
/*
As mentioned briefly above, the filter method is used on arrays to extract/
filter all the elements that meet a certain condition. And just like with the
forEach and map methods, the filtration is made possible though the magic of 
callback functions. Most of the time, the callback function you write in the
filter method should return a boolean value. All the array elements that
return true from the boolean operation will be placed into the new array, and 
all the elements that return false will be filtered out.
*/

// Call the filter method on accBalances:
const bigMoney = accBalances.filter(function (bal) {
  // filter out the balances that or less than 900
  return bal > 1000;
});

// Log accBalances to the console:
console.log(accBalances);
// Log bigMoney to the console:
console.log(bigMoney);

// The Reduce Method:
console.log(`---THE REDUCE METHOD---`);
/*
The reduce method is used to reduce all the elements in an array down 
to one value, like adding up the sum of all numbers in an array. It 
also makes use of callback functions to work, but the callback works
differently than it does with the map and filter methods. With reduce,
the first parameter in the callback is the accumulator. The accumulator 
is like a snowball variable, it's the value you will keep adding to based
on the callback's codeblock. The other 3 parameters you can use with the 
callback are the same as with map and filter. 

But there's more, the callback function is only the first of two arguments 
used with the reduce method. The second argument is used to set the initial 
value of the accumulator. 
*/

// Call the reduce method on the movements array:
console.log(movements);
const totalBalance = movements.reduce(function (
  accumulator,
  currentValue,
  currentIndex,
  array
) {
  console.log(
    `Iteration: #${currentIndex} - Accumulator Value: ${accumulator} - Current Value: ${currentValue}`
  );
  return accumulator + currentValue;
},
0);

// Log totalBalance to the console:
console.log(totalBalance);

// Use reduce to find the highest value in an array:
const highestNum = accBalances.reduce(function (acc, curr, i, arr) {
  // if the acc is greater than the curr, the return the curr:
  if (acc > curr) {
    return acc;
  } else return curr;
}, accBalances[0]);

// Log highestNum to the console:
console.log(highestNum);

// Coding Challenge #2
console.log(`---CODING CHALLENGE #2---`);
/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages 
to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and 
does the following things in order:

1. Calculate the dog age in human years using the following formula: 
if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, 
humanAge = 16 + dogAge * 4.

2. Exclude all dogs that are less than 18 human years old.
(which is the same as keeping dogs that are at least 18 years old).

3. Calculate the average human age of all adult dogs .
(you should already know from other challenges how we calculate averages 😉).

4. Run the function for both test datasets
TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK 😀
*/

// Create the dog age converter calculator function:
const calcAverageHumanAge = function (ages) {
  // 1 - convert ages to human ages:
  const humanAge = ages.map(function (age) {
    return age <= 2 ? age * 2 : 16 + age * 4;
  });
  // 2 - filter out all dogs less than 18 human years old:
  const legalAges = humanAge.filter(function (age) {
    return age >= 18;
  });
  // Log humanAge and legalAges to the console:
  console.log(humanAge);
  console.log(legalAges);
  // 3 - calc the average age in the array of ages:
  const averageAge =
    legalAges.reduce((acc, age) => acc + age, 0) / legalAges.length;
  return averageAge;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1);
console.log(avg2);

// The Magic of Chaining Array Methods:
console.log(`---THE MAGIC OF CHAINING METHODS---`);
/*
Up until this point, you've used to map, filter, and reduce method all in 
isolation. But you can up the ante by making your code so dry that it'll
be borderline unreadable. Such elite code is made possible by the ability 
to daisy-chain array methods. 

A use-case for this would be taking an array of account transactions, convert
the currency to USD, and then add them all up. Most developers would just 
carry out each operation separately, store each of the results in a separate 
variable, and used them as needed. But if you aspire to be an elite dev, then
it's much cooler to do it all in one go. 
*/
// Call the filter method on the movements array & filter for elements that
// are greater than 0.
// That operation returns an array that you can then call the map method on to
// convert the transactions to USD.
// Then the result of the map method will also produce an array that you can
// the reduce method on to add up the array elements.
const totalDepositsUSD = movements
  .filter(transaction => transaction > 0)
  .map(transaction => transaction * 1.1)
  .reduce((acc, transaction) => acc + transaction, 0);

console.log(totalDepositsUSD);

// Coding Challenge #3
console.log(`---CHALLENGE #3---`);
/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as 
an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
const ageConverter = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// Call ageConverter with test data and log results to console:
const testData1 = [5, 2, 4, 1, 15, 8, 3];
const testData2 = [16, 6, 10, 5, 6, 1, 4];
console.log(ageConverter(testData1));
console.log(ageConverter(testData2));

// The Find Method:
/*
You can use the find method to retrieve an element from an array based on 
a certain condition. And just like the other array method you've done thus
far, the find method works by making use of callback functions. And just like 
the filter method, the callback function of the find method has to return a 
boolean value. But unlike most of the other array methods, te find method does
not return a new array, instead it only returns the first element in the array
that satisfy the condition in the callback function.
*/

// Find the first withdrawal in movements:
const firstDraw = movements.find(trans => trans < 0);
console.log(movements);
console.log(firstDraw);

// Find your account in the accounts array:
const myAccount = accounts.find(acc => acc.owner === `Danny Bimma`);
console.log(accounts);
console.log(myAccount);

// The FindIndex Method:
console.log(`---THE FIND INDEX METHOD---`);
/*
The findIndex method is a very close cousin of the find method. And it's 
works in pretty much the same way except for one crucial difference. Instead
of returning an array element, the findIndex method returns the index of an
array element. 
*/

// The Some and Every Method:
console.log(`---THE SOME AND EVERY METHOD---`);
/*
The some method is very similar to the includes method. While the includes method 
is more of a comparison operation that you use to check if a particular value is 
in an array. The some method works in the same way, but it used to check for array
elements that meet a certain condition. The condition has the result in a boolean 
value, and the some method will also return a boolean value. 
*/

// Check for elements greater than 800 in the movements array:
const over800 = movements.some(trans => trans > 800);
console.log(movements);
console.log(over800);

// Every:
console.log(`---EVERY---`);
/*
The every method works in the same way as the some method. Except, it only 
returns true of all if the elements in an array meet the condition
*/

// Check if all of the elements in the movements array are even divisible by 2:
const evenCheck = movements.every(trans => trans / 2 === 0);
console.log(movements);
console.log(evenCheck);

// Check if all the elements more than -1000:
const overNegative1000 = movements.every(trans => trans > -1000);
console.log(movements);
console.log(overNegative1000);

// Flat and FlatMap:
console.log(`---FLAT AND FLATMAP---`);
/*
The flat and flatmap array methods are pretty simple and easy to understand.

The flat method is used to join the nested elements of an array into one 
stand alone array. When you call the flat method on an array, you can pass
in an argument to state deep you want the nested extractions to go. 

And the flatMap method basically combines the functionality of the map
and flat methods into one method. This is due to how often they are often 
used together.
*/

// Create an array of arrays:
const nestedArr = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];
// // Call the flat method on nestedArr and store in a variable:
// const liberatedArr = nestedArr.flat();
// // Log new array to the console:
// console.log(liberatedArr);

// // Store all transactions from all accounts into one array:
// const accTrans = accounts.map(acc => acc.transactions);
// console.log(accTrans);
// // Store the array of transaction arrays into one array:
// const allTrans = accTrans.flat();
// console.log(allTrans);
// // Add all elements in the allTrans array together:
// const totalAssetValue = allTrans.reduce((acc, trans) => acc + trans, 0);
// console.log(totalAssetValue);

const totalAssetValue = accounts
  .map(acc => acc.transactions)
  .flat()
  .reduce((acc, trans) => acc + trans, 0);

console.log(totalAssetValue);

// Sorting Arrays:
console.log(`---SORTING ARRAYS---`);
/*
Sorting is a very essential aspect of computer programming and 
web development. As a result there are countless methods and 
algorithms out there to help devs sort their code out. 

JavaScript has a built in sorting method called sort. It mutates
the array it was called on and sorts the elements in ascending order. 
And it is very important to note that the sort method was built to
sort strings by default. So because JS is weird af, if you call the
sort method on an array of numbers without a compare callback it treats 
the numbers likes strings when sorting them. 

To get the sort method to sort numbers in the way you want, you have 
to use the compare callback function with it. The two arguments you 
pass into the compare callback (usually "a" and "b") represent any two 
consecutive numbers in the array. 

If the compare callback returns a negative number (< 0), then the value 
of "a" will come first. 

If the compare callback returns a positive number (> 0), then the value 
of "b" will come first. 
*/

// Create an array of strings called owners:
const owners = accounts.map(acc => acc.owner);
console.log(owners);

// Call the sort method on the owners array:
console.log(owners.sort());

// Call the sort method on an array of numbers:
// console.log(movements);
// console.log(movements.sort());

// Sorting numbers correctly (ascending):
movements.sort((a, b) => a - b);
console.log(movements);

// Descending;
movements.sort((a, b) => b - a);
console.log(movements);

// Personal Challenge:
console.log(`---PERSONAL CHALLENGE---`);

// Store an array of random numbers:
const randomDigits = [
  11, 21, 33, 56, 90, 54, 22, 0, 100, 8643, 4735, 7634, 678, 57, 89, 69, 2, 5,
];

// Sort randomDigits in ascending order:
randomDigits.sort((a, b) => (a < b ? -1 : 1));
console.log(randomDigits);

// Sort randomDigits in descending order:
randomDigits.sort((a, b) => (a < b ? 1 : -1));
console.log(randomDigits);

// More Ways of Creating a Filling Arrays:
console.log(`---MORE WAYS OF CREATING AND FILLING ARRAYS---`);
/*
Up until this point you've only been creating arrays manually and not programmatically, 
this is fine if you already know all the data you want put into a particular array. But
there are many situations where you will need to fill an array with data you have yet to 
receive. For these instances, there are many ways to dynamically create arrays and fill
them with data. 
 */

// The array constructor method:
const emptyArr = new Array(22);
console.log(emptyArr);
/*
Using the array constructor method and only passing in one argument will create
an array with a number of empty elements (whatever num you passed in as an argument).

When an empty array is created like this using the array constructor method, it's 
almost completely useless since no methods can be called on the resulting array. 
None that is, except one. Which is the fill method!!
*/

// The fill method:
emptyArr.fill(8);
console.log(emptyArr);
/*
When you call the fill method on an array with empty elements and pass in only
one argument. The method will fill all the empty elements in the array with 
whatever value you passed in as an argument.

However, the fill method works in a similar way to the slice method when using 
multiple arguments. The first is the value to be inserted into the array, the
second is the index at which you want the injection to start, and the final
is the index you want the injected to end at. 
*/
console.log(emptyArr.fill(`Hey Danny!`, 3, 7));

// The Array.from method:
const sevenBy123 = Array.from({ length: 7 }, () => 123);
console.log(sevenBy123);

const oneTo8 = Array.from({ length: 8 }, (_, currentIndex) => currentIndex + 1);
console.log(oneTo8);
/*
It's important to note that when using Array.from, you are calling the
built-in from method on the built-in Array function! And not on an actual
array!

To use this method you can first pass-in an object with a length property and value, 
the second argument can be a mapping function that will work just like the callback
in the map method. Which means the mapping function will have access to the current
element via the first argument, and the second argument will have access to the current
index. 

The Array.from method was initially introduced into JS in order to convert array like
objects (strings, sets, node lists, etc.) into actual arrays. So although it can be 
useful for dynamically creating arrays, it's most useful when used with objects like 
node lists. 

A node list is created when using QuerySelectorAll with the DOM. When used it
returns a node list of all the HTML elements that you specify. 

Since a node list is not a real array, it's not possible to call array methods like. 
map and reduce on them, that is not unless you convert the node list to a real array 
first.
*/
labelBalance.addEventListener(`click`, () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace(`€`, ``))
  );

  console.log(movementsUI);
});

// Use array.from to create an array of 100 random dice rolls:
// (populate an array with a random number between 1-6 100 times):
const roll100 = Array.from({ length: 100 }, () =>
  Math.floor(Math.random() * 7 + 1)
);
console.log(roll100);

// Array Methods Practice:
console.log(`---ARRAY METHODS PRACTICE---`);

// 1. Calculate how much money has been deposited to the bank in total:
const totalDeposits = accounts
  .flatMap(acc => acc.transactions)
  .filter(trans => trans > 0)
  .reduce((total, current) => total + current, 0);

console.log(totalDeposits);

// 2. Count how many deposits > 1,000 the bank has received:
const depositsOver1000 = accounts
  .flatMap(acc => acc.transactions)
  .filter(trans => trans >= 1000).length;

console.log(depositsOver1000);

// or
const over1000 = accounts
  .flatMap(acc => acc.transactions)
  .reduce((counter, current) => (current >= 1000 ? counter + 1 : counter), 0);
console.log(over1000);

// 3. Create an object which contains the sum of all deposits and withdraws:
const sums = accounts
  .flatMap(acc => acc.transactions)
  .reduce(
    (sums, current) => {
      current > 0 ? (sums.deposits += current) : (sums.withdrawals += current);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(sums);

// 4. Create a function that transforms any string into title case:
const animeTitle1 = `rascal does not dream of bunny girl senpai`;
const animeTitle2 = `that time i died and got reincarnated as a slime`;

const titleConverter = function (title) {
  const exceptions = [`a`, `an`, `and`, `the`, `but`, `or`, `in`, `on`, `with`];

  const titleCase = title
    .toLowerCase()
    .split(` `)
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(` `);
  return titleCase;
};

console.log(titleConverter(animeTitle1));
console.log(titleConverter(animeTitle2));

// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are 
eating too much or too little. Eating too much means the dog's current food portion 
is larger than the recommended portion, and eating too little is the opposite. Eating 
an okay amount means the dog's current food portion is within a range 10% above and 10% 
below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended 
food portion and add it to the object as a new property. Do NOT create a new array, simply 
loop over the array. 
Formula: recommendedFood = weight ** 0.75 * 28. 
(The result is in grams of food, and the weight needs to be in kg)

2. Find Sarah's dog and log to the console whether it's eating too much or too little. 
HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, 
and so this one is a bit tricky (on purpose) 🤓

3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and 
an array with all owners of dogs who eat too little ('ownersEatTooLittle').

4. Log a string to the console for each array created in 3., 
like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's 
dogs eat too little!"

5. Log to the console whether there is any dog eating EXACTLY the amount of food that is 
recommended (just true or false)

6. Log to the console whether there is any dog eating an OKAY amount of food 
(just true or false)

7. Create an array containing the dogs that are eating an OKAY amount of food 
(try to reuse the condition used in 6.)

8. Create a shallow copy of the dogs array and sort it by recommended food portion in an 
ascending order 
(keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary 
lecture to choose between them 😉

HINT 2: Being within a range 10% above and below the recommended portion means: 
current > (recommended * 0.90) && current < (recommended * 1.10). 
Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. Calculate recommended food portion for each dog:
dogs.forEach(dog => (dog.recommendedFood = dog.weight ** 0.75 * 28));
console.log(dogs);

// 2. Find Sarah's dog and log to the console whether it's eating too much or too little.
const sarahDog = dogs.find(dog => dog.owners.includes(`Sarah`));
console.log(sarahDog);

if (sarahDog.curFood > sarahDog.recommendedFood * 1.1) {
  console.log(`Sarah's dog eats too much!`);
} else console.log(`Sarah's dog eats too little!`);

// 3. Create a new array from the dogs array containing all owners of dogs who eat too much ('ownersEatTooMuch').
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood * 1.1)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood * 0.9)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4. Log a string to the console for each array created in 3.
console.log(`${ownersEatTooMuch.join(` and `)}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(` and `)}'s dogs eat too little!`);

// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
const eatingExactly = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(eatingExactly);

// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
const eatingOkay = dogs.some(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(eatingOkay);

// 7. Create an array containing the dogs that are eating an OKAY amount of food.
const eatingOkayDogs = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(eatingOkayDogs);

// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order.
const sortedDogs = [...dogs].sort(
  (a, b) => a.recommendedFood - b.recommendedFood
);
console.log(sortedDogs);
