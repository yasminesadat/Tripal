let exchangeRates = null; 

async function fetchExchangeRates() {
  const savedRates = sessionStorage.getItem('exchangeRates');
  
  if (savedRates) {
    exchangeRates = JSON.parse(savedRates);
  } else {
    const response = await fetch('https://v6.exchangerate-api.com/v6/f975ea74aec709add4731646/latest/EGP');
    exchangeRates = await response.json();
    sessionStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
  }
  
  return exchangeRates;
}

async function getConversionRate(currency) {
  if (!exchangeRates) {
    await fetchExchangeRates();
  }
  console.log("exchange rates areee "+ exchangeRates);
  return exchangeRates.conversion_rates[currency];
  
}

export { fetchExchangeRates, getConversionRate };
