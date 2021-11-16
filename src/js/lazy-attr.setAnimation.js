import removeUselessAttributes from "./lazy-attr.remove.useless.atributes";

/**
* Set animation parameters
* @param {HTMLElement} element
* @param {String} animationClass 
*/
function setAnimation(target, element, animationClass){
    //if(!isAnimationStoped(e)) return; //We wait the end of animation

    //Animation duration
    const animationTime = target.getAttribute('lazy-animation-time');
    if(animationTime) {
        element.style.animationDuration = animationTime + "s";
    }

    //Animation delay
    const animationDelay = target.getAttribute('lazy-animation-delay');
    if(animationDelay) {
        element.style.animationDelay = animationDelay + "s";
    }

    //Animation count
    const animationCount = target.getAttribute('lazy-animation-count');
    if(animationCount) {
        element.style.animationIterationCount = animationCount;
    }

    //Animation function
    const animationFunction = target.getAttribute('lazy-animation-function');
    if(animationFunction){
        element.style.animationTimingFunction = animationFunction;
    }

    //Set animation class
    element.classList.add(animationClass);

    if(target.getAttribute('lazy-reset') === null){

        //Delete useless attribute
        element.addEventListener('animationend', function(){
            //remove all useless attributes
            removeUselessAttributes(target, element);

            //Delete lazy-attr attributes
            window.lazy().parameters.forEach(function(param){
                param = param.replace(/(\[|\])/gi, "");
                target.removeAttribute(param);
            });
        });
    } else {

        //Delete useless attributes on lazy-reset elements
        element.addEventListener('animationend', function(){
            //remove all useless attributes
            removeUselessAttributes(target, element);
        });
    }
}

export default setAnimation;