

/**
 * Este metodo lo que hace es modificar el alto del elemento html ya sea un navbar__collapse o un 
 * dropdown__menú y se aprovehca de las propiedades css para las transiciones
 * @param {*} object Es el menú html al que se le va a modificar el alto
 */
const showMenu = object => {
    let childNodes = object.childNodes;
    let height = 0;

    //Se define el alto del primer elemento, ya que los menu solo tienen un hijo
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].classList) {
            height += childNodes[i].clientHeight;
            break;
        }
    }

    if (object.classList.contains('show')) {
        object.classList.toggle('show');
        object.style.height = `${height}px`;
        setTimeout(() => {
            object.style.height = '0px';
        }, 1);
    } else {
        object.classList.toggle('show');
        object.style.height = `${height}px`;
        setTimeout(() => {
            object.style.height = 'auto';
        }, 500);
    }

}

const menuController = () => {
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar .navbar__nav');
    const dropdowns = document.querySelectorAll('.dropdown');
    const main = document.querySelector('main');

    //Se agrega la fucionalidad del boton del menú
    navbarToggler.addEventListener('click', () => {
        showMenu(navbarCollapse);
    });

    //Si se da click fuera del menu este se debe cerrar, no se como funcionará por lo que
    //es codigo temporal
    main.addEventListener('click', ()=>{
        if(navbarCollapse.classList.contains('show')){
            showMenu(navbarCollapse);
        }
    })

    //Se agrega la funcionalidad a los menú de los dropdown
    dropdowns.forEach(drop => {
        drop.addEventListener('click', () => {
            let menu = drop.querySelector('.dropdown__nav');
            showMenu(menu);
            //Con lo siguiente se actualiza el chevron que apunta hacia abajo o arriba
            let caret = drop.querySelector('.navbar__link__append');
            if(menu.classList.contains('show')){
                caret.classList.remove('icon-chevron-down');
                caret.classList.add('icon-chevron-up');
            }else{
                caret.classList.remove('icon-chevron-up');
                caret.classList.add('icon-chevron-down');
            }
        })
    });
}

const sliderController = ()=>{
    const slider = document.querySelector('.slider');
    const sliderContainer = slider.querySelector('.slider__items');
    const btnNext = slider.querySelector('.slider__btn-next');
    const btnPrev = slider.querySelector('.slider__btn-prev');
    const items = sliderContainer.querySelectorAll('.slider__item');

    //Ahora lo que se hace es mover el ultimo elemento al primer lugar
    sliderContainer.insertBefore(items[items.length -1], items[0]);

    //Como ahora el ultimo aparece de primero lo que hago es poner un margen izquierdo
    //con valor igual al -100%
    sliderContainer.style.marginLeft = '-100%';

    //Ahora agrego el evento click al boton derecho
    btnNext.addEventListener('click', ()=>{
        const slider = document.querySelector('.slider');
        const sliderContainer = slider.querySelector('.slider__items');
        const items = sliderContainer.querySelectorAll('.slider__item');
        //Lo primero que hago es insertar el primer nodo al final
        
        sliderContainer.animate([
            {marginLeft: '-100%'},
            {marginLeft: '-200%'}
        ], {duration:700});

        setTimeout(() => {
            sliderContainer.appendChild(items[0]);    
        }, 700);
    })

    btnPrev.addEventListener('click', ()=>{
        const slider = document.querySelector('.slider');
        const sliderContainer = slider.querySelector('.slider__items');
        const items = sliderContainer.querySelectorAll('.slider__item');

        
        sliderContainer.animate([
            {marginLeft: '-100%'},
            {marginLeft: '0'}
        ], {duration:700});
        
        setTimeout(() => {
            sliderContainer.insertBefore(items[items.length -1], items[0]);        
        }, 700);

    })

}

/**
 * Este metodo controla los eventos que ocurren en las tarjetas de los producto
 * mas que nada lo que ocurre cuando se da click a la pildora de imagenes
 * y cuando se da click a alguna de las imagenes
 */
const cardGalleryControler = () =>{
    //Obtengo todas las tarjetas del documento
    let cards = document.querySelectorAll('.card');

    //Se agrega la funcionalidad a cada una de las tarjetas
    cards.forEach(card => {
        let pill = card.querySelector('.card__pill');
        let cardImg = card.querySelector('.card__img');
        let gallery = card.querySelector('.card__gallery');
        let galleryImgs = gallery.querySelectorAll('.card__gallery__img');

        /**
         * Pendiente que las imagenes de los producto se deben descargar cuando el cliente
         * le de click a la pildora de imagenes
         */
        pill.addEventListener('click', ()=>{
            if(pill.classList.contains('active')){
                pill.classList.remove('active');
                gallery.classList.remove('show');
            }else{
                pill.classList.add('active');
                gallery.classList.add('show');
            }
        })

        galleryImgs.forEach(img => {
            img.addEventListener('click', ()=>{
                let src = img.getAttribute('src');
                let srcDestination = cardImg.getAttribute('src');
                cardImg.setAttribute('src', src);
                img.setAttribute('src', srcDestination);
            })
        });
    });
}

window.addEventListener('load', () => {
    menuController();
    cardGalleryControler();
    sliderController();
})