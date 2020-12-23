/**
 * https://github.com/yoannchb-pro/Lazy-attr
 * VERSION: 1.1.0
 */
'use strict';

//Foreach creation for IE
if(window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
if(window.HTMLCollection && !HTMLCollection.prototype.forEach) {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

//Datas
window.lazyDatas = {
    updateURL: "https://cdn.jsdelivr.net/npm/lazy-attr@latest/lazy-attr.min.js",
    originalObserver: true
};

//Locked methods
window.lazy = function(){
    /**
     * See object intersecting
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
     * Return if an element is intersecting without tranform of animation
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

    /**
     * verify if there is an update or not
     * @param {Function} fback 
     */
    function getLastVersion(fback){
        let req = new XMLHttpRequest();
        req.onload = function(){
            const res = req.responseText;

            const p = '[#version]';
            let nv = res.substring(res.indexOf(p)+p.length);
            nv = nv.substring(nv.indexOf(p)+p.length);
            nv = nv.substring(0, nv.indexOf(p));
            fback({version: nv});
        }
        req.onerror = function(){
            fback({error: true});
        }

        req.open('GET', window.lazyDatas["updateURL"]);
        req.send();
    };

    /**
     * Change animation of lazy block (e for element, a for animation name and r to reload or no the animation)
     * @param {HTMLElement} e 
     * @param {String} a 
     * @param {Boolean} r 
     */
    function changeAnimation(e, a, r){
        let reset = e.getAttribute('lazy-reset');
        reset = reset != null && reset != undefined ? true : false;
        if(reset){
            let backAnimation = e.getAttribute('lazy-animation');

            if(backAnimation && a){
                let pointer = e.getAttribute('lazy-animation-pointer');
                if(pointer){
                    //with pointer
                    document.querySelectorAll(pointer).forEach(function(p){
                        p.classList.remove(backAnimation);
                    });
                } else {
                    //no pointer
                    e.classList.remove(backAnimation);
                }
                e.removeAttribute('lazy-animation');
            }
            e.setAttribute('lazy-animation', a);

            //Reload animation
            if(r) {
                window.lazy()._data["observer"].unobserve(e);
                window.lazy()._data["observer"].observe(e);
            }
        } else {
            console.warn('Lazy-attr : Cannot change animation of not lazy-reset element !');
        }
    };

    return {
        //datas
        _data: window.lazyDatas,
        //methods
        changeAnimation: changeAnimation,
        getLastVersion: getLastVersion,
        isIntersecting: isIntersecting,
        isIntersectingWithoutTransform: isIntersectingWithoutTransform,
        //search attributes parameters for observer
        parameters: ["[lazy-reset]", 
                    "[lazy-animation]",  
                    "[lazy-animation-time]", 
                    "[lazy-animation-delay]",
                    "[lazy-src]",
                    "[lazy-video]",
                    "[lazy-embed]",
                    "[lazy-animation-pointer]",
                    "[lazy-animation-function]",
                    "[lazy-animation-count]"],
        //animation list
        animations: ["zoomin",
                     "zoomout", 
                    "opacity", 
                    "slide-left",
                    "slide-right",
                     "slide-bottom", 
                     "slide-top", 
                     "corner-top-left",
                     "corner-top-right",
                     "corner-bottom-left",
                     "corner-bottom-right",
                     "shake", 
                     "rotate",
                     "blur",
                     "flip",
                     "flip-up"],
        //options
        options: {
            root: null,
            rootMargin: "0px",
            threshold: 0
        },
        //version
        version: "1.1.0",
        //version matcher
        versionMatcher: "[#version]1.1.0[#version]" 
    }
}

//WARN for update
window.addEventListener('load', function(){
    window.lazy().getLastVersion(function(v){
        if(v.error){
            console.error("Lazzy-attr : error while fetching to see for update !");
        } else {
            try{
                let ver = v.version;
                let actv = window.lazy().version;
    
                let nv = ver>actv;
                let good = ver===actv;
                let error = ver<actv;
    
                if(nv) console.warn("Lazzy-attr : new version " + ver + " available !");
                if(good) console.info("Lazy-attr : you have the latest version " + actv)
                if(error) console.warn("Lazzy-attr : " + actv + " is not a valid version !");
            } catch(e) {}
        }
    });
});

//Create IntersectionObserver for old version of navigator
if(!window.IntersectionObserver){

    //Create a prototype of the IntersectionObserver polyfill
    window.IntersectionObserver = function IntersectionObserver(callback, options){
        this.callback = callback;
        this.elements = [];
        window.lazyDatas.originalObserver = false;
    
        function init(){
            const obj = this;
            function listener(){
                const entries = [];
                obj.elements.forEach(function(element){
                    let intersect = window.lazy().isIntersecting(element);

                    entries.push({
                        target: element,
                        isIntersecting: intersect
                    });
                });
                callback(entries, obj);
            };
    
            this.listener = listener;

            const requestAnimationFrameSetup = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
            if(requestAnimationFrameSetup){
                (function loopDomChangement(){
                    listener();
                    requestAnimationFrameSetup(loopDomChangement);
                })();
            } else {
                console.error('Lazy-attr : your browser do not requestAnimationFrame');
            }
        }

        function observe(e){
            if(e) {
                this.elements.push(e);
            }
        }
    
        function unobserve(e){
            if(e) {
                let index = this.elements.indexOf(e);
                if(index != -1) {
                    this.elements.splice(index, 1);
                }
            }
        }
        
        this.init = init;
        this.observe = observe;
        this.unobserve = unobserve;
        
        this.init();
    }
}

//DOM loaded
window.addEventListener('load', function(){
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
                if(loaded || !target.getAttribute("lazy-src")) startAnimation(); else {
                    target.addEventListener('error', function(){
                        startAnimation();
                        displayError("cannot load url " + target.src);
                    });
                    target.addEventListener('load', startAnimation);
                    //target.addEventListener('loadeddata', startAnimation);
                }

                //Lazy video
                let srcPoster = target.getAttribute('lazy-video');
                if(srcPoster) target.setAttribute("poster", srcPoster);
                target.preload = "none";
                
                //Lazy iframe
                let code = target.getAttribute('lazy-embed');
                if(code){
                    let poster = target.getAttribute('lazy-poster'); //Permet de mettre un poster à la vidéo
                    if(poster) poster = "url('" + poster + "')"; else poster = "#000";
                    target.setAttribute("srcdoc", "<style>body{background: " + poster + "; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href='${code}'><span>▶</span></a>");
                }
                
                //Lazy src
                let srcUrl = target.getAttribute('lazy-src');
                if(srcUrl) target.src = srcUrl;

                //Remove useless attributes after load
                target.removeAttribute('lazy-embed');
                target.removeAttribute('lazy-poster');
                target.removeAttribute('lazy-video');
                target.removeAttribute('lazy-src');

                if(target.getAttribute('lazy-reset') === null){ //Used to reload animation on scroll
                    observer.unobserve(target); //Stop observation
                };

            //Not intersecting
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
});