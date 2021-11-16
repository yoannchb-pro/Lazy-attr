/**
* See object intersecting for polyfill
* @param {HTMLElement} element 
*/
  function isIntersecting(element){
    const width = window.innerWidth;
    const height = window.innerHeight;

    const pos = element.getBoundingClientRect();

    let hIntersect = false;
    let vIntersect = false;

    let topCondition = pos.top >= 0 && pos.top <= height;
    let bottomCondition = pos.bottom >= 0 && pos.bottom <= height;
    let leftCondition = pos.left >= 0 && pos.left <= width;
    let rightCondition = pos.right >= 0 && pos.right <= width;

    if(topCondition || bottomCondition) vIntersect = true;
    if(leftCondition || rightCondition) hIntersect = true;

    if(hIntersect && vIntersect) return true;

    return false;
}

/**
* Return if an element is intersecting without tranform animation
* @param {HTMLElement} el
*/
function isIntersectingWithoutTransform(el){
    const width = window.innerWidth;
    const height = window.innerHeight;

    function isElementIntersecting(element){
        const parentRect = element.offsetParent.getBoundingClientRect();
        const left = parentRect.left + element.offsetLeft;
        const top = parentRect.top + element.offsetTop;
        const bottom = top + element.offsetHeight;
        const right = left + element.offsetWidth;

        let hIntersect = false;
        let vIntersect = false;

        let topCondition = top >= 0 && top <= height;
        let bottomCondition = bottom >= 0 && bottom <= height;
        let leftCondition = left >= 0 && left <= width;
        let rightCondition = right >= 0 && right <= width;

        if(topCondition || bottomCondition) vIntersect = true;
        if(leftCondition || rightCondition) hIntersect = true;

        if(hIntersect && vIntersect) return true;
    }

    const pointer = el.getAttribute('lazy-animation-pointer');

    return isElementIntersecting(el) || (pointer != null ? isElementIntersecting(document.querySelector(pointer)) : false);
}

export default {isIntersecting, isIntersectingWithoutTransform};