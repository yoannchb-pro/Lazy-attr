import animationState from "../animations/lazy-attr.animation.state";

/**
* Used to remove useless attributes on not lazy-reset elements like the pointer
* @param {HTMLElement} parent
* @param {HTMLElement} pointer
*/
function removeUselessAttributesPointer(parent, pointer){
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

export default removeUselessAttributesPointer;