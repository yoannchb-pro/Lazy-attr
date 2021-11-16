import animationState from "./lazy-attr.animation.state";

/**
* used to remove useless attributes on not lazy-reset elements t=target and e=pointer
* @param {HTMLElement} parent
* @param {HTMLElement} pointer
*/
function removeUselessAttributes(parent, pointer){
    const nullAttribute = null;
    //remove animation
    if(window.lazy()._data['originalObserver']){
        const animationName = parent.getAttribute('lazy-animation');
        if(animationName) pointer.classList.remove(animationName);
    }

    //remove size
    parent.style.minWidth = nullAttribute;
    parent.style.minHeight = nullAttribute;

    //animation running
    animationState(pointer, nullAttribute);

    //animation duration
    parent.style.animationDuration = nullAttribute;

    //animation delay
    parent.style.animationDelay = nullAttribute;

    //animation count
    parent.style.animationIterationCount = nullAttribute;

    //animation function
    parent.style.animationTimingFunction = nullAttribute;
}

export default removeUselessAttributes;