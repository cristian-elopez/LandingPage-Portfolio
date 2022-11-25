// const barsBtn = document.querySelector(".btn-menu-navbar");
const overlay = document.querySelector(".overlay");
const favsBtn = document.querySelector(".btn-favs");
const favoritos = document.querySelector(".favoritos");
const usersBtn = document.querySelector(".btn-users");
const body = document.querySelector("body");
const barsMenu = document.querySelector(".navbar-links");
const btnMenuResponsive = document.querySelector(".btn-menu-responsive");
const usuarios = document.querySelector(".users");
const usersContainer = document.querySelector(".open-users");

  
// botones del nav

const toggleFavs = () => {
	favoritos.classList.toggle("show-favoritos");
	if (usuarios.classList.contains("show-users")) {
		usuarios.classList.remove("show-users");
		return
	}
	if (barsMenu.classList.contains("open-menu")) {
		barsMenu.classList.remove("open-menu")
		return;
	};
	overlay.classList.toggle("show-overlay");
};

const toggleUsers = () => {
	usuarios.classList.toggle("show-users");
	if (favoritos.classList.contains("show-favoritos")) {
		favoritos.classList.remove("show-favoritos");
		return;
	}
	if (barsMenu.classList.contains("open-menu")) {
		barsMenu.classList.remove("open-menu")
		return;
	};
	overlay.classList.toggle("show-overlay");
};

const toggleMenu = () => {
	if (usuarios.classList.contains("show-users")) {
		usuarios.classList.remove("show-users")
		return;
};
	if (favoritos.classList.contains("show-favoritos")) {
		favoritos.classList.remove("show-favoritos")
		return;
};
	overlay.classList.toggle("show-overlay");
};

const init = () => {
	favsBtn.addEventListener("click", toggleFavs);
	usersBtn.addEventListener("click", toggleUsers);
	btnMenuResponsive.addEventListener("click", toggleMenu);
};

init(); 