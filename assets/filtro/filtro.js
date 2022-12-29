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


let favs = JSON.parse(localStorage.getItem("favs")) || [];

const saveLocalStorage = (favsList) => {
  localStorage.setItem("favs", JSON.stringify(favsList));
};

const renderNews = async (noticia) => {
    const { publishedAt , urlToImage , title , author , description , url } = await noticia;
    return newsContainer.innerHTML += `
        <div class="each-news">
            <img src="${urlToImage}">
            <h2>${title}</h2>
            <h5>Autor: ${author}</h5>
            <p>${description}</p>
            <a class="btn-add-favs" href="${url}" target="__blank">Ir al enlace</a>
            <button class="btn-add-favs"
                data-id='${publishedAt}'
                data-titulo='${title}'
                data-enlace='${url}'
                data-img='${urlToImage}'>Añadir a favoritos</button>
        </div>`;
} 

const renderDividedNews = (listNews) => {
  listNews.map(renderNews).join("");
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

  newsContainer.innerHTML = "";

  if(todosBtn.classList.contains('active')) {
    return renderDividedNews(allNewsConteiner);
  } else if (cryptosBtn.classList.contains('active')) {
    return renderDividedNews(cryptoNewsConteiner);
  } else if (marketBtn.classList.contains('active')) {
    return renderDividedNews(marcketNewsConteiner);
  } else if (brokerBtn.classList.contains('active')) {
    return renderDividedNews(brokerNewsConteiner);
  }
};

// favoritos

const renderFavNews = (notice) => {
	const { enlace , id , img , titulo } = notice;
	return `
		<div class="fav-item" id="${id}">
			<div>
				<img src="${img}" alt="Portada de la Noticia">
				<h3>${titulo}</h3>
			</div>
			<a href="${enlace}" target="__blank">Ir al enlace</a>
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

const createProductData = (enlace , id , img , titulo) => {
	return { enlace , id , img , titulo };
};

const createFavNotice = (notice) => {
	favs = [...favs, { ...notice, quantity: 1 }];
};

const isExistingTheNews = (notice) => {
  return favs.some((i)=> i.id === notice.id)
}

const checkFavsState = () => {
	saveLocalStorage(favs);
	renderFavs(favs);
};

const changeFilterState = (e) => {
  const selectedCategory = e.target.dataset.category;
  changeBtnActiveState(selectedCategory);
  loadCoinsFilter()
};

const showSuccessModal = (msg) => {
	successModal.classList.add("active-modal");
	successModal.textContent = msg;
	setTimeout(() => {
	  successModal.classList.remove("active-modal");
	}, 1500);
};
  
const addNews = (e) => {
  console.log(e.target.dataset)
	if (!e.target.classList.contains("btn-add-favs")) return;
	const { enlace , id , img , titulo } = e.target.dataset;

	const noticia = createProductData(enlace , id , img , titulo);
  
	if (isExistingTheNews(noticia)) {
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