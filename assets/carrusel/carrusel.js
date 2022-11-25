 const carruselBig = document.querySelector('.carrusel-big');
 const point = document.querySelectorAll('.point');

 point.forEach( ( eachPoint , i ) => {
    const pointFuntion = () => {
        let posicion = i;
        let operacion = posicion * -33.3;

        carruselBig.style.transform = `translateX(${operacion}%)`

        point.forEach( ( eachPunto , i ) => {
            point[i].classList.remove('point-active')
        });
        point[i].classList.add('point-active');
       
    };


    point[i].addEventListener('click', pointFuntion)
})