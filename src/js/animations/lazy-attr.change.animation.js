/**
 * Change animation of lazy-attr element
 * @param {HTMLElement} element
 * @param {String} animationName
 * @param {Boolean} reload
 */
 function changeAnimation(element, animationName, reload = true){
    let reset = element.getAttribute('lazy-reset');
    reset = reset != null && reset != undefined ? true : false;

    if(reset){
        
        const backAnimation = element.getAttribute('lazy-animation');

        if(backAnimation && animationName){

            const pointer = element.getAttribute('lazy-animation-pointer');

            if(pointer){
                //with pointer
                document.querySelectorAll(pointer).forEach(function(p){
                    p.classList.remove(backAnimation);
                });
            } else {
                //no pointer
                element.classList.remove(backAnimation);
            }
            element.removeAttribute('lazy-animation');
        }

        element.setAttribute('lazy-animation', animationName);

        //Reload animation
        if(reload) {
            window.lazy()._data["observer"].unobserve(element);
            window.lazy()._data["observer"].observe(element);
        }

    } else {
        console.warn('Lazy-attr : Cannot change animation of not lazy-reset element !');
    }
};

export default changeAnimation;