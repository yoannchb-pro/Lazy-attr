/**
* Run or pause animation function
* @param {HTMLElement} element
* @param {String} state
*/
function animationState(element, state){
    element.style.animationPlayState = state;
};

export default animationState;