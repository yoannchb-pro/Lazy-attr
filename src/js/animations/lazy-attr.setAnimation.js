import removeUselessAttributesPointer from "../utils/lazy-attr.remove.useless.atributes";

/**
 * Set animation parameters
 * @param {Object} config 
 */
function setAnimation(config, elementToAnimate = false){
    const target = config.target;
    const animationClass = config.animation || '';

    elementToAnimate = elementToAnimate ? elementToAnimate : config.target;

    // if(elementToAnimate.style.animationPlayState == "running") return; //We wait the end of animation

    //Animation duration
    const animationTime = target.getAttribute('lazy-animation-time');
    if(animationTime) {
        elementToAnimate.style.animationDuration = animationTime + "s";
    }

    //Animation delay
    const animationDelay = target.getAttribute('lazy-animation-delay');
    if(animationDelay) {
        elementToAnimate.style.animationDelay = animationDelay + "s";
    }

    //Animation count
    const animationCount = target.getAttribute('lazy-animation-count');
    if(animationCount) {
        elementToAnimate.style.animationIterationCount = animationCount;
    }

    //Animation function
    const animationFunction = target.getAttribute('lazy-animation-function');
    if(animationFunction){
        elementToAnimate.style.animationTimingFunction = animationFunction;
    }

    //Set animation class
    elementToAnimate.classList.add(animationClass);

    if(config.reset === null){

        //Delete useless attribute
        elementToAnimate.addEventListener('animationend', function(){
            //remove all useless attributes for the element to animate (can be the pointer)
            if(target != elementToAnimate) removeUselessAttributesPointer(target, elementToAnimate);

            //Delete lazy-attr attributes
            Object.values(window.lazy().parameters).forEach(function(param){
                target.removeAttribute(param);
            });
        });

    } else {

        //Delete useless attributes on lazy-reset elements
        elementToAnimate.addEventListener('animationend', function(){
            //remove all useless attributes
            removeUselessAttributesPointer(target, elementToAnimate);
        });

    }
}

export default setAnimation;