const urlBaseFilter = 'https://newsapi.org/v2/everything?';
const apiKey = 'apiKey=b5f559a026d348d1a7181eeb63c1301d';

const allParams =   urlBaseFilter +
                    'language=es&' +
                    'q=crypto&' +
                    'pageSize=10&' +
                    apiKey;

const cryptoParams =    urlBaseFilter +
                        'language=es&' +
                        'q=bitcoin&' +
                        'pageSize=10&' +
                        apiKey;

const marketParams =    urlBaseFilter +
                        'language=es&' +
                        'q=mercado&' +
                        'pageSize=10&' +
                        apiKey;

const brokersParams =   urlBaseFilter +
                        'language=es&' +
                        'q=broker&' +
                        'pageSize=10&' +
                        apiKey;

const genericFetch = async ( url ) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.articles;
};

const newsContainer = document.querySelector('.news-container');
const todosBtn = document.getElementById('todas-btn');
const cryptosBtn = document.getElementById('cryptos-btn');
const marketBtn = document.getElementById('mercado-btn');
const brokerBtn = document.getElementById('brokers-btn');
const categoriesList = document.querySelectorAll(".category");
const categories = document.querySelector(".categories");

const successModal = document.querySelector(".add-modal");
const btnDelete = document.querySelector(".btn-delete");
const favContainer = document.querySelector(".fav-container");

const renderNews = async (noticia) => {
    const { urlToImage , title , author , description , url } = await noticia;
    return newsContainer.innerHTML += `
        <div class="each-news">
            <img src="${urlToImage}">
            <h2>${title}</h2>
            <h5>Autor: ${author}</h5>
            <p>${description}</p>
            <a class="btn-add-favs" href="${url}" target="__blank">Ir al enlace</a>
            <button class="btn-add-favs"
                data-titulo='${title}'
                data-enlace='${url}'
                data-img='${urlToImage}'>Añadir a favoritos</button>
        </div>`;
} 

const renderDividedNews = (listNews) => {
  listNews.map(renderNews).join("");
};

const changeFilterState = (e) => {
  const selectedCategory = e.target.dataset.category;
  changeBtnActiveState(selectedCategory);
};

const changeBtnActiveState = (selectedCategory) => {
  const categories = [...categoriesList];
  categories.forEach((categoryBtn) => {
    if (categoryBtn.dataset.category !== selectedCategory) {
      categoryBtn.classList.remove("active");
      return;
    }
    categoryBtn.classList.add("active");
  });
};

const loadCoinsFilter = async () => {
  const allNewsConteiner = await genericFetch(allParams);
  const cryptoNewsConteiner = await genericFetch(cryptoParams);
  const marcketNewsConteiner = await genericFetch(marketParams);
  const brokerNewsConteiner = await genericFetch(brokersParams);

  if(todosBtn.classList.contains('active')) {
    renderDividedNews(allNewsConteiner);
  } else if (cryptosBtn.classList.contains('active')) {
    renderDividedNews(cryptoNewsConteiner);
  } else if (marketBtn.classList.contains('active')) {
    renderDividedNews(marcketNewsConteiner);
  } else if (brokerBtn.classList.contains('active')) {
    renderDividedNews(brokerNewsConteiner);
  }
};

// favoritos

let favs = JSON.parse(localStorage.getItem("favs")) || [];

const saveLocalStorage = (favsList) => {
  localStorage.setItem("favs", JSON.stringify(favsList));
};

const renderFavNews = (favNews) => {
	const { urlToImage , title , url } = favNews;
	return `
		<div class="fav-item">
			<div>
				<img src="${urlToImage}" alt="Portada de la Noticia">
				<h3>${title}</h3>
			</div>
			<a href="${url}" target="__blank">Ir al enlace</a>
		</div>
	`;
};
  
const renderFavs = () => {
	// Si el carrito esta vacío
	if (!favs.length) {
		favContainer.innerHTML = `<p> No hay productos en el carrito. </p>`;
	  return;
	}
	// Renderizamos lo que hay
	favContainer.innerHTML = favs.map(renderFavNews).join("");
};

const createProductData = (urlToImage,title,url) => {
	return { urlToImage , title , url };
};

const createFavNotice = (notice) => {
	favs = [...favs, { ...notice, quantity: 1 }];
};

const isExistingCartProduct = (theNews) => {
	return favs.find((item) => item.url === theNews.url);
};

const checkFavsState = () => {
	saveLocalStorage(favs);
	renderFavs(favs);
};

const showSuccessModal = (msg) => {
	successModal.classList.add("active-modal");
	successModal.textContent = msg;
	setTimeout(() => {
	  successModal.classList.remove("active-modal");
	}, 1500);
};
  
const addNews = (e) => {
	if (!e.target.classList.contains("btn-add-favs")) return;
	const { urlToImage , title , url } = e.target.dataset;
  
	const noticia = createProductData(urlToImage,title,url);
	console.log(noticia)
  
	if (isExistingCartProduct(noticia)) {
	  showSuccessModal("La noticia ya estaba en favoritos");
	} else {
	  createFavNotice(noticia);
	  showSuccessModal("La noticia se agregó a favoritos");
	}
	checkFavsState();
};

const resetFavsItems = () => {
	favs = [];
	checkFavsState();
};

const filtro = () => {
  window.addEventListener("DOMContentLoaded",loadCoinsFilter);
  categories.addEventListener("click", changeFilterState);
  newsContainer.addEventListener("click", addNews);
	document.addEventListener("DOMContentLoaded", renderFavs);
	btnDelete.addEventListener("click", resetFavsItems)
};

filtro();