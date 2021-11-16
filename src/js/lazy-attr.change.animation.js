/**
 * Change animation of lazy block (e for element, a for animation name and r to reload or no the animation)
 * @param {HTMLElement} e 
 * @param {String} a 
 * @param {Boolean} r 
 */
 function changeAnimation(e, a, r){
    let reset = e.getAttribute('lazy-reset');
    reset = reset != null && reset != undefined ? true : false;

    if(reset){
        
        let backAnimation = e.getAttribute('lazy-animation');

        if(backAnimation && a){
            let pointer = e.getAttribute('lazy-animation-pointer');
            if(pointer){
                //with pointer
                document.querySelectorAll(pointer).forEach(function(p){
                    p.classList.remove(backAnimation);
                });
            } else {
                //no pointer
                e.classList.remove(backAnimation);
            }
            e.removeAttribute('lazy-animation');
        }

        e.setAttribute('lazy-animation', a);

        //Reload animation
        if(r) {
            window.lazy()._data["observer"].unobserve(e);
            window.lazy()._data["observer"].observe(e);
        }

    } else {
        console.warn('Lazy-attr : Cannot change animation of not lazy-reset element !');
    }
};

export default changeAnimation;