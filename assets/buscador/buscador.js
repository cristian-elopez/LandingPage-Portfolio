const form = document.getElementById("buscador-form");
const tbody = document.querySelector('.tbody');
const searchInput = document.querySelector('.buscador-input');
const btnPopulares = document.querySelector('.top-btn');

const requestCoins = async (value) => {
  const baseUrl = 'https://api.coinlore.net/api/tickers/'
  const response = await fetch(baseUrl);
  const json = await response.json();
  const data = json.data;
  const results = value
    ? divideArray(data.filter((coin) => 
    coin.name.toLowerCase().includes(value.toLowerCase())
    ),10)
    : divideArray(data, 10);

  return {
    results: results,
    total: results.length,
    current: 0,
  };
};

function divideArray(arr, size) {
  let chunk = [];
  for(let i = 0; i < arr.length; i += size) {
    chunk.push(arr.slice(i, i + size)) 
  }
  return chunk;
}

const renderCoin = (coin) => {
    const {rank,
        name, 
        symbol, 
        price_usd, 
        market_cap_usd, 
        percent_change_24h 
    } = coin;
  
    return `
    <tr>
      <td>#${rank}</td>
      <td class="coin-title">
        ${name} (${symbol.toUpperCase()})
      </td>
      <td>$${price_usd}</td>
      <td>$${market_cap_usd}</td>
      <td><span class="${percent_change_24h < 0 ? 'down' : 'up'}">${percent_change_24h}</span></td>
    </tr> 
    `
};

const renderCoins = async (coins, current) => {
    if(!coins.length) {
      tbody.innerHTML = `<h1> No se encontraron resultados, realice una nueva busqueda </h1>`
      btnPopulares.classList.remove('hidden');
      form.reset();
      return;
    }
  
    tbody.innerHTML = coins[current].map(renderCoin).join('')
};

const setCoins = (coins) => {
    current = coins.current
    total = coins.total
    results = coins.results
};

const loadCoins = async (e) => {
    e.preventDefault();
  
    const searchedValue = searchInput.value.trim();
  
    let coins = await requestCoins(searchedValue);
    setCoins(coins);
  
    if(searchedValue) {
      btnPopulares.classList.remove('hidden');
      form.reset()
    } else {
      btnPopulares.classList.add('hidden');
    }
  
    renderCoins(results, current);
};
  
const buscador = () => {
    requestCoins();
    window.addEventListener('DOMContentLoaded', loadCoins);
    form.addEventListener('submit', loadCoins);
    btnPopulares.addEventListener('click', loadCoins);
};

buscador();