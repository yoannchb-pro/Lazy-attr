import setAnimation from "../animations/lazy-attr.setAnimation";
import animationState from "../animations/lazy-attr.animation.state";

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

            //Set configuration
            const config = { target: target };
            for(const [key, value] of Object.entries(window.lazy().parameters)){
                config[key] = target.getAttribute(value);
            };

            if(config.pointer != null) config.pointer = document.querySelectorAll(config.pointer);


            //Intersecting
            if(entry.isIntersecting){
                if(config.pointer){

                    config.pointer.forEach(function(pointer){
                        if (config.animation){
                            setAnimation(config, pointer); //set animation
                            animationState(pointer, "paused");
                        }
                    });

                } else {

                    if(config.animation){
                        setAnimation(config); //set animation
                        animationState(target, "paused");
                    }

                }

                //See loaded elements
                const loadedImg = target.complete && target.naturalHeight !== 0;
                const loadedVideo = target.readyState >=0; //>=3
                const loaded = loadedImg || loadedVideo;

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
                    if(config.pointer) config.pointer.forEach(function(el){
                        setClassLazy(el);
                        animationState(el, "running");
                        //remove skeleton animation
                        window.lazy().skeletons.forEach(className => el.classList.remove(className));
                    }); else {
                        setClassLazy(config.target);
                        animationState(config.target, "running");

                        window.lazy().skeletons.forEach(className => config.target.classList.remove(className));
                    }
                }

                if(loaded || (!config.src && !config.srcset && !config.background)) {

                    startAnimation();
                    
                    //Event handler
                    const event = new CustomEvent('lazy-loaded', config);
                    target.dispatchEvent(event);
                    if(config.pointer) config.pointer.forEach(e => e.dispatchEvent(event));

                } else if(config.background){

                    //Lazy-background
                    const srcBackground = config.background;

                    if(srcBackground) {
                        const cacheImg = new Image();
                        cacheImg.src = srcBackground;
                        cacheImg.addEventListener('error', function(){
                            startAnimation();
                            displayError("cannot load url " + target.src);
                        });
                        cacheImg.addEventListener('load', () => {
                            target.style.backgroundImage = "url('" + cacheImg.src + "')";
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
                        //start animation after load
                        startAnimation();
                    });
                }

                //Lazy video
                const srcPoster = config.video;
                if(srcPoster) target.setAttribute("poster", srcPoster);
                target.preload = "none";
                
                //Lazy iframe
                const code = config.embed;

                if(code){
                    //If it's not IE
                    if(!window.lazy()._data['isIE']){
                        let poster = config.poster; //Permet de mettre un poster à la vidéo
                        if(poster) poster = "url('" + poster + "')"; else poster = "#000";
                        target.setAttribute("srcdoc", "<style>body{background: " + poster + "; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href='" + code + "'><span>&#9654;</span></a>");
                    } else {
                        //IE do not support srcdoc
                        target.setAttribute('src', code);
                    }
                }
                
                //Lazy src
                const srcUrl = config.src;
                if(srcUrl) target.src = srcUrl;

                //Lazy srcset
                const srcSet = config.srcset;
                if(srcSet) target.setAttribute('srcset', srcSet);

                //Remove useless attributes after load
                target.removeAttribute('lazy-embed');
                target.removeAttribute('lazy-poster');
                target.removeAttribute('lazy-video');
                target.removeAttribute('lazy-src');
                target.removeAttribute('lazy-srcset');
                target.removeAttribute('lazy-background');
                
                if(config.reset === null){ //Used to reload animation on scroll
                    target.removeAttribute('lazy-observe');
                    observer.unobserve(target); //Stop observation
                };

            } else if(config.reset != null && !window.lazy().isIntersectingWithoutTransform(target)) { //Reload animation
                //Reset function
                function resetAnimation(element, animationClass){
                    //remove animation
                    if(animationClass) element.classList.remove(animationClass);
                }

                //Reset class animation for pointer or target
                if(config.pointer && config.animation){
                    config.pointer.forEach(function(pointer){
                        resetAnimation(pointer, config.animation);
                        // pointer.style.animationDirection = 'reverse';
                    });
                } else {
                    resetAnimation(target, config.animation);
                }

                //Dispatch event on quit
                const event = new CustomEvent('lazy-quit', config);
                target.dispatchEvent(event);
                if(config.pointer) config.pointer.forEach(e => e.dispatchEvent(event));

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
            const tags = Object.values(window.lazy().parameters).map(e => `[${e}]`);

            document.body.querySelectorAll(tags.join(',')).forEach(function(el){
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

        //Recording change from the dom
        function getMutationObserver() {
            return (
              window.MutationObserver ||
              window.WebKitMutationObserver ||
              window.MozMutationObserver
            );
        }

        const MutationObserver = getMutationObserver();

        const observerDOM = new MutationObserver(function(mutations){
            if (!mutations) return;

            mutations.forEach((mutation) => {
                const addedNodes = Array.prototype.slice.call(mutation.addedNodes);
                const removedNodes = Array.prototype.slice.call(mutation.removedNodes);

                if(addedNodes && addedNodes.length > 0) getLazyObject();
                
                removedNodes.forEach(node => {
                    try { observer.unobserve(node) } catch(e) {}
                });
            })
        });

        observerDOM.observe(window.document.documentElement, {
            childList: true,
            subtree: true,
            removedNodes: true
        });

        //document.addEventListener("change", getLazyObject);
        getLazyObject();

        //Info
        displayInfo('version ' + window.lazy().version);

    } else {

        //Error
        displayError('Incompatible or verify window.lazy and window.lazyDatas integration');
    }
}