import setAnimation from "./lazy-attr.setAnimation";
import animationState from "./lazy-attr.animation.state";

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
                //Animation class
                const targetAnimation = [];
                const animationClass = target.getAttribute('lazy-animation');
                const pointer = target.getAttribute('lazy-animation-pointer');

                if(pointer){
                    const pointers = document.querySelectorAll(pointer);
                    pointers.forEach(function(pointer){
                        if (animationClass){
                            setAnimation(target, pointer, animationClass); //set animation
                            animationState(pointer, "paused");
                        }
                        targetAnimation.push(pointer);
                    });
                } else {

                    if(animationClass){
                        setAnimation(target, target, animationClass); //set animation
                        animationState(target, "paused");
                    }
                    targetAnimation.push(target);

                }

                //See loaded elements
                const loadedImg = target.complete && target.naturalHeight !== 0;
                const loadedVideo = target.readyState >=0; //>=3
                const loaded = loadedImg || loadedVideo;

                //Call callback function
                const loadedFunction = function(){
                    const callbackFunction = target.getAttribute('lazy-callback');
                    if(callbackFunction) window[callbackFunction](target);
                }

                //Set class on lazy element
                const setClassLazy = function(el){
                    const haveClass = el.classList.toString().indexOf('lazyattr') != -1;
                    if(haveClass) {
                        el.classList.remove('lazyattr');
                        el.classList.add('lazyloaded');
                    }
                }

                /**
                * Start animation function after load element if it is lazy or not
                */
                const startAnimation = function(){
                    targetAnimation.forEach(function(el){
                        setClassLazy(el);
                        animationState(el, "running");
                        //remove skeleton animation
                        window.lazy().skeletons.forEach(className => el.classList.remove(className));
                    });
                }

                if(loaded || (!target.getAttribute("lazy-src") && !target.getAttribute('lazy-srcset') && !target.getAttribute('lazy-background'))) {

                    loadedFunction();
                    startAnimation();

                } else if(target.getAttribute('lazy-background')){

                    //Lazy-background
                    const srcBackground = target.getAttribute('lazy-background');

                    if(srcBackground) {
                        const cacheImg = new Image();
                        cacheImg.src = srcBackground;
                        cacheImg.addEventListener('error', function(){
                            startAnimation();
                            displayError("cannot load url " + target.src);
                        });
                        cacheImg.addEventListener('load', () => {
                            target.style.backgroundImage = "url('" + cacheImg.src + "')";
                            loadedFunction();
                            startAnimation();
                        });
                    }
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
                        target.setAttribute("srcdoc", "<style>body{background: " + poster + "; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href='" + code + "'><span>&#9654;</span></a>");
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
                target.removeAttribute('lazy-srcset');
                target.removeAttribute('lazy-background');

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

        //Set observer on dom elements
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
        displayError('Incompatible or verify window.lazy and window.lazyDatas integration');
    }
}