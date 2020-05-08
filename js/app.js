/**
 * Contiene los sliders que poseen autoplay
 */
let sliderIntervals = [];

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
    main.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
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
            if (menu.classList.contains('show')) {
                caret.classList.remove('icon-chevron-down');
                caret.classList.add('icon-chevron-up');
            } else {
                caret.classList.remove('icon-chevron-up');
                caret.classList.add('icon-chevron-down');
            }
        })
    });
}

const sliderController = () => {
    //Se recuperan todos los sliders del docuemento
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        //Se recupera el contenedor para poder ajustarle el ancho segun los elementos
        const sliderContainer = slider.querySelector('.slider__items');
        const btnNext = slider.querySelector('.slider__btn-next');
        const btnPrev = slider.querySelector('.slider__btn-prev');
        const items = sliderContainer.querySelectorAll('.slider__item');
        let id = slider.getAttribute('id');

        //Se ajusta el ancho del contenedor
        sliderContainer.style.width = `${items.length * 100}%`;
        //Se mueve el ultimo elemento al inicio
        sliderContainer.insertBefore(items[items.length - 1], items[0]);
        //Se mueve el margen un 100% a la izquierda
        sliderContainer.style.marginLeft = '-100%';

        if (btnNext && btnPrev) {
            btnNext.addEventListener('click', (e) => {
                sliderNext(id, 700);
                sliderAutoplayStop(searchSliderRoot(e.target));
            })

            btnPrev.addEventListener('click', (e) => {
                sliderPrev(id, 700);
                sliderAutoplayStop(searchSliderRoot(e.target));
            })
        }
    });

    sliderAutoplay('featureProductsSlider', 700, 3000);
    sliderAutoplay('textHeader', 500, 2500);

}

const searchSliderRoot = eTarget => {
    let parent = eTarget.parentNode;
    while (!parent.getAttribute('id')) {
        parent = parent.parentNode;
    }

    return parent.getAttribute('id');
}

/**
 * Mueve los elementos del slider hacia la izquierda y al finalizar ubica 
 * el primer elemento al final de la cola
 * @param {string} sliderId Es el identificador del slider
 * @param {Int32Array} duration tiempo en milisegundo
 */
const sliderNext = (sliderId, duration = 700) => {
    let slider = sliderParam(sliderId);

    slider.container.animate({ marginLeft: '-200%' }, duration, () => {
        $(slider.firstItem).insertAfter(slider.lastItem);
        slider.container[0].style.marginLeft = '-100%';
    })
}

/**
 * Mueve los elementos del slider de derecha a izquierda y al finalizar
 * ubica el ultimo elemento al inicio de todo
 * @param {string} sliderId El id del eslider que se quiere modificar
 * @param {int} duration El tiempo de la animacion en ms 700 ms por defecto
 */
const sliderPrev = (sliderId, duration = 700) => {
    let slider = sliderParam(sliderId);

    slider.container.animate({ marginLeft: '0' }, duration, () => {
        $(slider.lastItem).insertBefore(slider.firstItem);
        slider.container[0].style.marginLeft = '-100%';
    })
}

/**
 * Este metodo recupera el contendor del slider, el primer elemento y el ultimo
 * @param {string} sliderId Identificador del slider
 * @return {JSON} slider 
 */
const sliderParam = (sliderId) => {
    return {
        container: $(`#${sliderId} .slider__items`),
        firstItem: $(`#${sliderId} .slider__item:first`),
        lastItem: $(`#${sliderId} .slider__item:last`)
    }
}

/**
 * Agrega un intervalo de movimiento del slider que por defecto la animacion dura 700 ms 
 * y el tiempo del intervalo es de 1000 ms
 * @param {string} sliderId El identificador del slider
 * @param {int} duration es la velocidad de la animacion
 * @param {int} time tiempo en el que se repite el intervalo
 */
const sliderAutoplay = (sliderId, duration = 700, time = 1000, toRight = true) => {
    let interval = null;
    let slider = null;

    //En primer lugar se va a detener el intervalo que se está ejecuntado si lo hay
    sliderIntervals.forEach(item => {
        if (item.sliderId === sliderId) {
            clearInterval(item.interval);
            slider = item;
        }
    });

    //Se pone en marcha el nuevo intervalo
    interval = setInterval(() => {
        if (toRight) {
            sliderNext(sliderId, duration);
        } else {
            sliderPrev(sliderId, duration);
        }
    }, time);

    //Se actualiza o se crea el intervalo
    if (slider) {
        slider.interval = interval;
    } else {
        sliderIntervals.push({ sliderId, interval });
    }
}

const sliderAutoplayPause = (sliderId, delay = 5000, duration = 700, time = 1000) => {
    //TODO:No se como implementar esta funcionalidad
}

/**
 * Este metodo busca en el array de intervalos alguno que coincida con el id pasado
 * como parametro y detiene el proceso de ejecuacion
 * @param {string} sliderId Identificador del slider que tiene el autoplay
 */
const sliderAutoplayStop = sliderId => {
    for (let index = 0; index < sliderIntervals.length; index++) {
        const interval = sliderIntervals[index];
        if (interval.sliderId === sliderId) {
            clearInterval(interval.interval);
            break;
        }
    }
}
/**
 * Este metodo controla los eventos que ocurren en las tarjetas de los producto
 * mas que nada lo que ocurre cuando se da click a la pildora de imagenes
 * y cuando se da click a alguna de las imagenes
 */
const cardGalleryControler = () => {
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
        pill.addEventListener('click', () => {
            if (pill.classList.contains('active')) {
                pill.classList.remove('active');
                gallery.classList.remove('show');
            } else {
                pill.classList.add('active');
                gallery.classList.add('show');
            }
        })

        galleryImgs.forEach(img => {
            img.addEventListener('click', () => {
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