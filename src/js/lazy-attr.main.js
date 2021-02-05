export default function lazyMain(){
    //Function to display error and info
    function displayInfo(msg){console.info("[INFO] Lazy-attr : " + msg);};
    function displayError(msg){console.error("[ERROR] Lazy-attr : " + msg);};

    /**
     * Main function
     * @param {*} entries 
     * @param {*} observer 
     */
    function callback(entries, observer){
        //For each elements in the observer
        entries.forEach(function(entry){
            const target = entry.target; //Element target

            //Intersecting
            if(entry.isIntersecting){
                /**
                 * Run or pause animation function
                 * @param {HTMLElement} element
                 * @param {String} state
                 */
                function animationState(element, state){
                    element.style.animationPlayState = state;
                    element.style.webkitAnimationPlayState = state;
                };

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
                    parent.style.webkitAnimationDuration = nullAttribute;

                    //animation delay
                    parent.style.animationDelay = nullAttribute;
                    parent.style.webkitAnimationDelay = nullAttribute;

                    //animation count
                    parent.style.animationIterationCount = nullAttribute;
                    parent.style.webkitAnimationIterationCount = nullAttribute;

                    //animation function
                    parent.style.animationTimingFunction = nullAttribute;
                    parent.style.webkitAnimationTimingFunction = nullAttribute;
                }

                /**
                 * Set animation parameters
                 * @param {HTMLElement} element
                 * @param {String} animationClass 
                 */
                function setAnimation(element, animationClass){
                    //if(!isAnimationStoped(e)) return; //We wait the end of animation

                    //Animation duration
                    const animationTime = target.getAttribute('lazy-animation-time');
                    if(animationTime) {
                        element.style.animationDuration = animationTime + "s";
                        element.style.webkitAnimationDuration = animationTime + "s";
                    }

                    //Animation delay
                    const animationDelay = target.getAttribute('lazy-animation-delay');
                    if(animationDelay) {
                        element.style.animationDelay = animationDelay + "s";
                        element.style.webkitAnimationDelay = animationDelay + "s";
                    }

                    //Animation count
                    const animationCount = target.getAttribute('lazy-animation-count');
                    if(animationCount) {
                        element.style.animationIterationCount = animationCount;
                        element.style.webkitAnimationIterationCount = animationCount;
                    }

                    //Animation function
                    const animationFunction = target.getAttribute('lazy-animation-function');
                    if(animationFunction){
                        element.style.animationTimingFunction = animationFunction;
                        element.style.webkitAnimationTimingFunction = animationFunction;
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

                //Animation class
                const targetAnimation = [];
                const animationClass = target.getAttribute('lazy-animation');
                const pointer = target.getAttribute('lazy-animation-pointer');

                if(pointer && animationClass){
                    const pointers = document.querySelectorAll(pointer);
                    pointers.forEach(function(pointer){
                        setAnimation(pointer, animationClass); //set animation
                        animationState(pointer, "paused");
                        targetAnimation.push(pointer);
                    });
                } else {

                    if(animationClass){
                        setAnimation(target, animationClass); //set animation
                        animationState(target, "paused");
                        targetAnimation.push(target);
                    }

                }

                //See loaded elements
                const loadedImg = target.complete && target.naturalHeight !== 0;
                const loadedVideo = target.readyState >=0; //>=3
                const loaded = loadedImg || loadedVideo;

                //Call callback function
                const loadedFunction = () => {
                    const callbackFunction = target.getAttribute('lazy-callback');
                    if(callbackFunction) window[callbackFunction]();
                }

                //Set class on lazy element
                const setClassLazy = (el) => {
                    const haveClass = el.classList.toString().indexOf('lazyattr') != -1;
                    if(haveClass) {
                        el.classList.remove('lazyattr');
                        el.classList.add('lazyloaded');
                    }
                }

                /**
                * Start animation function after load element if it is lazy or not
                */
                const startAnimation = () => {
                    targetAnimation.forEach(function(el){
                        setClassLazy(el);
                        animationState(el, "running");
                    });
                }

                if(loaded || !target.getAttribute("lazy-src")) {

                    loadedFunction();
                    startAnimation();

                 } else {

                    target.addEventListener('error', function(){
                        startAnimation();
                        displayError("cannot load url " + target.src);
                    });

                    //callback function
                    target.addEventListener('load', () => {
                        loadedFunction();

                        //start animation after load
                        startAnimation();
                    });

                    //callback function video
                    target.addEventListener('loadeddata', loadedFunction);
                }

                //Lazy video
                const srcPoster = target.getAttribute('lazy-video');
                if(srcPoster) target.setAttribute("poster", srcPoster);
                target.preload = "none";
                
                //Lazy iframe
                const code = target.getAttribute('lazy-embed');

                if(code){
                    //If it's not IE
                    if(!window.lazy()._data['isIE']){
                        let poster = target.getAttribute('lazy-poster'); //Permet de mettre un poster à la vidéo
                        if(poster) poster = "url('" + poster + "')"; else poster = "#000";
                        target.setAttribute("srcdoc", "<style>body{background: " + poster + "; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href='" + code + "'><span>▶</span></a>");
                    } else {
                        //IE do not support srcdoc
                        target.setAttribute('src', code);
                    }
                }
                
                //Lazy src
                const srcUrl = target.getAttribute('lazy-src');
                if(srcUrl) target.src = srcUrl;

                //Lazy srcset
                const srcSet = target.getAttribute('lazy-srcset');
                if(srcSet) target.setAttribute('srcset', srcSet);

                //Remove useless attributes after load
                target.removeAttribute('lazy-embed');
                target.removeAttribute('lazy-poster');
                target.removeAttribute('lazy-video');
                target.removeAttribute('lazy-src');

                if(target.getAttribute('lazy-reset') === null){ //Used to reload animation on scroll
                    observer.unobserve(target); //Stop observation
                };

            } else if(target.getAttribute('lazy-reset') != null && !window.lazy().isIntersectingWithoutTransform(target)) { //Reload animation
                //Reset function
                function resetAnimation(element, animationClass){
                    //remove animation
                    if(animationClass) element.classList.remove(animationClass);
                }

                //Reset class animation for pointer or target
                const animationClass = target.getAttribute('lazy-animation');
                const havePointer = target.getAttribute('lazy-animation-pointer');

                if(havePointer && animationClass){
                    const pointers = document.querySelectorAll(havePointer);
                    pointers.forEach(function(pointer){
                        resetAnimation(pointer, animationClass);
                    });
                } else {
                    resetAnimation(target, animationClass);
                }
            }
        });
    }

    //Get available
    if(window.IntersectionObserver && window.lazy() && window.lazyDatas){

        //Observer
        const observer = new IntersectionObserver(callback, window.lazy().options);
        window.lazyDatas["observer"] = observer;

        /**
         * Set observer on dom elements
         */
        function getLazyObject(){
            document.body.querySelectorAll(window.lazy().parameters.join(',')).forEach(function(el){
                //Get default width and height
                const sizeWidth = el.getAttribute('lazy-size-width');
                const sizeHeight = el.getAttribute('lazy-size-height');

                //Set default width and height (removed after load)
                if(sizeWidth) el.style.minWidth = sizeWidth;
                if(sizeHeight) el.style.minHeight = sizeHeight;

                //Start observing
                observer.observe(el);
            });
        }
        document.addEventListener("DOMNodeInserted", getLazyObject);
        //document.addEventListener("change", getLazyObject);
        getLazyObject();

        //Info
        displayInfo('version ' + window.lazy().version);

    } else {

        //Error
        displayError('incompatible or verify window.lazy and window.lazyDatas integration');
    }
}