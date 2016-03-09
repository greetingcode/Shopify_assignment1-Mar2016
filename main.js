/*
  created by Minseok Kim on 29/12/2015
  revised on 01/03/2016
    revision 
      1. corrects the previous error that does not count weights untill 100kg 
      2. reflects the recent updated features of Javascript(ES6). 
      
  Minseok Kim
  minkim4568@gmail.com
  
  Algonquin College - Mobile Application Design and Development
*/

'use strict'
const MAX_WEIGHT = 100000;              // const is better as the number should be stronger.

document.addEventListener("DOMContentLoaded", init);

function init() {               
  callAJAX("http://shopicruit.myshopify.com/products.json");
}

function callAJAX(url) {                // ajax call for JSON data.
  let Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", url, false);
  Httpreq.send(null);
  window.shopifyData = JSON.parse(Httpreq.responseText);

  if (shopifyData) {                // checks if the designated array successfully received the JSON data
    collectItems();
  } else {
    alert("no json data is retrieved");
  }
}

function collectItems() {       // starts to sort out items from the JSON array.  
  let products = shopifyData.products;
  keyboardsAndComputers(products);
}

function keyboardsAndComputers(products) {
  window.user = {};             // makes a global variable within the function.
  user.keyboards = products.filter(function(obj) {              // sorts out items depending on product types. 
    return obj.product_type === 'Keyboard';
  });

  user.computers = products.filter(function(obj) {
    return obj.product_type === 'Computer';
  });

  if ((user.keyboards !== 0) && (user.computers !== 0)) {               // checks if both product types are successfully sorted
    calWeights();
  } else {
    alert('nothing');
  }
}

function calWeights() {
  let computers = user.computers;
  let keyboards = user.keyboards;
  computers.purchased = [];
  computers.purchased.totalPrice = 0;
  computers.purchased.totalWeight = 0;
  keyboards.purchased = [];
  keyboards.purchased.totalPrice = 0;
  keyboards.purchased.totalWeight = 0;
  let totalWeight = 0;
  do {
    totalWeight = user.computers.purchased.totalWeight + user.keyboards.purchased.totalWeight;
    if (totalWeight <= MAX_WEIGHT) {
      calculate(user.keyboards);
      calculate(user.computers);
    }
  } while (totalWeight <= MAX_WEIGHT);
  printPriceAndWeight();
}


function calculate(obj) {               // starts the weight and price calculation process.
  let keyLength = obj.length;
  for (let i = 0; i < keyLength; i++) {
    calProcess(obj, i);
  }
}

function calProcess(obj, i) {
  let variantsLength = obj[i].variants.length;
  for (let j = 0; j < variantsLength; j++) {
    let item = {};
    item.id = obj[i].id;
    item.handle = obj[i].handle;
    item.product_type = obj[i].product_type;
    item.color = obj[i].variants[j].title;
    item.grams = obj[i].variants[j].grams;
    item.price = obj[i].variants[j].price;
    user.keyboards.purchased.push(item);

    addPriceAndWeight(obj, i, j);
  }
}

function addPriceAndWeight(obj, i, j) {             // adds up prices and weights
  console.log(user.computers.purchased.totalWeight + user.keyboards.purchased.totalWeight);
  obj.purchased.totalWeight += obj[i].variants[j].grams;
  obj.purchased.totalPrice += parseFloat(obj[i].variants[j].price);
  let totalWeight = user.computers.purchased.totalWeight + user.keyboards.purchased.totalWeight;

  if (totalWeight <= MAX_WEIGHT) {              // updates the total weight and price only untill the condition is true
    window.Shopify_Answer = {};
    Shopify_Answer.totalPrice = user.computers.purchased.totalPrice + user.keyboards.purchased.totalPrice;
    Shopify_Answer.totalWeight = user.computers.purchased.totalWeight + user.keyboards.purchased.totalWeight;

  }
}

function printPriceAndWeight() {                // prints the answer. 
  document.write('<p>' + 'The total Price is ' + Shopify_Answer.totalPrice + '</p>' +
    '<p>' + 'The total Weight is ' + Shopify_Answer.totalWeight / 1000 + 'kg' + '</p>');
}
