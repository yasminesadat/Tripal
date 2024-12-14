let exchangeRates = null; 
let touristCurrency=null;

async function fetchExchangeRates() {
  const savedRates = sessionStorage.getItem('exchangeRates');
  if (savedRates) {
    exchangeRates = JSON.parse(savedRates);
  } else {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/f975ea74aec709add4731646/latest/EGP`);
    exchangeRates = await response.json();
    sessionStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
  }
  
  return exchangeRates;
}

async function getConversionRate(currency) {
  if (!exchangeRates) {
    await fetchExchangeRates();
  }
  return exchangeRates.conversion_rates[currency];
}

function getTouristCurrency() {
  return touristCurrency;
}

function setTouristCurrency(currency) {
  touristCurrency = currency; 
}

export { fetchExchangeRates, getConversionRate,getTouristCurrency,setTouristCurrency };