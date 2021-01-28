export default function lazyMain(){
    //Function to display error and info
    function displayInfo(m){console.info("[INFO] Lazy-attr : " + m);};
    function displayError(m){console.error("[ERROR] Lazy-attr : " + m);};

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
                 * @param {HTMLElement} e 
                 * @param {String} m 
                 */
                function animationState(e, m){
                    e.style.animationPlayState = m;
                    e.style.webkitAnimationPlayState = m;
                };

                /**
                 * used to remove useless attributes on not lazy-reset elements t=target and e=pointer
                 * @param {HTMLElement} t 
                 * @param {HTMLElement} e 
                 */
                function removeUselessAttributes(t, e){
                    let resetP = null;
                    //remove animation
                    if(window.lazy()._data['originalObserver']){
                        let animationName = t.getAttribute('lazy-animation');
                        if(animationName) e.classList.remove(animationName);
                    }
                    //animation running
                    animationState(e, resetP);
                    //animation duration
                    t.style.animationDuration = resetP;
                    t.style.webkitAnimationDuration = resetP;
                    //animation delay
                    t.style.animationDelay = resetP;
                    t.style.webkitAnimationDelay = resetP;
                    //animation count
                    t.style.animationIterationCount = resetP;
                    t.style.webkitAnimationIterationCount = resetP;
                    //animation function
                    t.style.animationTimingFunction = resetP;
                    t.style.webkitAnimationTimingFunction = resetP;
                }

                /**
                 * Set animation parameters
                 * @param {HTMLElement} e 
                 * @param {String} animationClass 
                 */
                function setAnimation(e, animationClass){
                    //if(!isAnimationStoped(e)) return; //We wait the end of animation

                    //Animation duration
                    let animationTime = target.getAttribute('lazy-animation-time');
                    if(animationTime) {
                        e.style.animationDuration = animationTime + "s";
                        e.style.webkitAnimationDuration = animationTime + "s";
                    }

                    //Animation delay
                    let animationDelay = target.getAttribute('lazy-animation-delay');
                    if(animationDelay) {
                        e.style.animationDelay = animationDelay + "s";
                        e.style.webkitAnimationDelay = animationDelay + "s";
                    }

                    //Animation count
                    let animationCount = target.getAttribute('lazy-animation-count');
                    if(animationCount) {
                        e.style.animationIterationCount = animationCount;
                        e.style.webkitAnimationIterationCount = animationCount;
                    }

                    //Animation function
                    let animationFunction = target.getAttribute('lazy-animation-function');
                    if(animationFunction){
                        e.style.animationTimingFunction = animationFunction;
                        e.style.webkitAnimationTimingFunction = animationFunction;
                    }

                    //Set animation class
                    e.classList.add(animationClass);

                    if(target.getAttribute('lazy-reset') === null){

                        //Delete useless attribute
                        e.addEventListener('animationend', function(){
                            //remove all useless attributes
                            removeUselessAttributes(target, e);

                            //Delete lazy-attr attributes
                            window.lazy().parameters.forEach(function(p){
                                p = p.replace(/\[/gi, "").replace(/\]/gi, "");
                                target.removeAttribute(p);
                            });
                        });
                    } else {

                        //Delete useless attributes on lazy-reset elements
                        e.addEventListener('animationend', function(){
                            //remove all useless attributes
                            removeUselessAttributes(target, e);
                        });
                    }
                }

                //Animation class
                const targetAnimation = [];
                let animationClass = target.getAttribute('lazy-animation');
                let pointer = target.getAttribute('lazy-animation-pointer');
                if(pointer && animationClass){
                    let t = document.querySelectorAll(pointer);
                    t.forEach(function(e){
                        setAnimation(e, animationClass); //set animation
                        animationState(e, "paused");
                        targetAnimation.push(e);
                    });
                } else {
                    if(animationClass){
                        setAnimation(target, animationClass); //set animation
                        animationState(target, "paused");
                        targetAnimation.push(target);
                    }
                }

                /**
                 * Start animation function after load element if it is lazy or not
                 */
                function startAnimation(){
                    targetAnimation.forEach(function(e){
                        animationState(e, "running");
                    });
                }

                let loadedImg = target.complete && target.naturalHeight !== 0;
                let loadedVideo = target.readyState >=0; //>=3
                let loaded = loadedImg || loadedVideo;

                const loadedFunction = () => {
                    const callbackFunction = target.getAttribute('lazy-callback');
                    if(callbackFunction) window[callbackFunction]();
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
                let srcPoster = target.getAttribute('lazy-video');
                if(srcPoster) target.setAttribute("poster", srcPoster);
                target.preload = "none";
                
                //Lazy iframe
                let code = target.getAttribute('lazy-embed');
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

            } else if(target.getAttribute('lazy-reset') != null && !window.lazy().isIntersectingWithoutTransform(target)){ //Reload animation
                //Reset function
                function resetAnimation(e, animationClass){
                    //remove animation
                    if(animationClass) e.classList.remove(animationClass);
                }

                //Reset class animation for pointer or target
                let animationClass = target.getAttribute('lazy-animation');
                let pointer = target.getAttribute('lazy-animation-pointer');
                if(pointer && animationClass){
                    let t = document.querySelectorAll(pointer);
                    t.forEach(function(e){
                        resetAnimation(e, animationClass);
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
        let observer = new IntersectionObserver(callback, window.lazy().options);
        window.lazyDatas["observer"] = observer;

        /**
         * Set observer on dom elements
         */
        function getLazyObject(){
            document.body.querySelectorAll(window.lazy().parameters.join(',')).forEach(function(e){
                observer.observe(e);
            });
        }
        document.addEventListener("DOMNodeInserted", getLazyObject);
        document.addEventListener("change", getLazyObject);
        getLazyObject();

        //Info
        displayInfo('version ' + window.lazy().version);
    } else {
        //Error
        displayError('incompatible or verify window.lazy and window.lazyDatas integration');
    }
}