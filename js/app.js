

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

    //Se agrega la fucionalidad del boton del menú
    navbarToggler.addEventListener('click', () => {
        showMenu(navbarCollapse);
    });

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

window.addEventListener('load', () => {
    menuController();
})