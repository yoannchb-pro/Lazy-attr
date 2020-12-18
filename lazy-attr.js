/**
 * https://github.com/yoannchb-pro/Lazy-attr
 * VERSION: 1.0.8
 */

//Datas
window.lazyDatas = {
    updateURL: "https://cdn.jsdelivr.net/gh/yoannchb-pro/lazy-attr@latest/lazy-attr.min.js"
};

//Locked methods
window.lazy = () => {
    //verify if there is an update or not
    const getLastVersion = () => {
        return new Promise(async (resolve, reject) => {
            let u = window.lazyDatas["updateURL"];

            let req = await fetch(u).catch(e => reject({error: true}));
            let res = await req.text().catch(e => reject({error: true}));

            let p = '[#version]';
            let nv = res.substring(res.indexOf(p)+p.length);
            nv = nv.substring(0, nv.indexOf(p));

            resolve({version: nv});
        });
    };

    //Change animation of lazy block (e for element, a for animation name and r to reload or no the animation)
    const changeAnimation = (e, a, r=false) => {
        let reset = e.getAttribute('lazy-reset');
        reset = reset != null && reset != undefined ? true : false;
        if(reset){
            let backAnimation = e.getAttribute('lazy-animation');

            if(backAnimation && a){
                let pointer = e.getAttribute('lazy-animation-pointer');
                if(pointer){
                    //with pointer
                    document.querySelectorAll(pointer).forEach(p => {
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
        version: "1.0.8",
        //version matcher
        versionMatcher: "[#version]1.0.8[#version]" 
    }
}

//WARN for update
window.addEventListener('load', async () => {
    let v = await window.lazy().getLastVersion();
    if(v.error){
        console.error("Lazzy-attr : error while fetching to see for update !");
    } else {
        try{
            let ver = v.version;
            let actv = window.lazy().version;

            let nv = ver>actv;
            let good = ver===actv;
            let error = ver<actv;

            if(nv) console.warn(`Lazzy-attr : new version ${ver} available !`);
            if(good) console.info(`Lazy-attr : you have the latest version ${actv}`)
            if(error) console.warn(`Lazzy-attr : ${actv} is not a valid version !`);
        } catch(e) {}
    }
});



//Create IntersectionObserver for old version of navigator
if(!window.IntersectionObserver){

    //Create a prototype of the IntersectionObserver
    window.IntersectionObserver = class IntersectionObserver{
        constructor(callback, options){
            this.callback = callback;
            this.elements = [];
            this.init();
        }
    
        init(){
            const obj = this;
            const listener = () => {
                const x = window.scrollX;
                const y = window.scrollY;
                const entries = [];
                obj.elements.forEach(element => {
                    let intersect = false;
    
                    let bodyRect = document.body.getBoundingClientRect();
                    let pos = element.getBoundingClientRect();
    
                    let hIntersect = false;
                    let vIntersect = false;
    
                    let top = pos.top - bodyRect.top;
                    let bottom = pos.bottom - bodyRect.bottom;
                    let right = pos.right - bodyRect.right;
                    let left = pos.left - bodyRect.left;
    
                    let topCondition = (top >= y && top <= y+window.innerHeight);
                    let bottomCondition = (bottom <= y+window.innerHeight && bottom >= y);
                    let leftCondition = (left >= x && left <= x+window.innerWidth);
                    let rightCondition = (right <= x+window.innerWidth && right >= x);
    
                    if(topCondition || bottomCondition) vIntersect = true;
                    if(leftCondition || rightCondition) hIntersect = true;
    
                    if(hIntersect && vIntersect) intersect = true;
    
                    entries.push({
                        target: element,
                        isIntersecting: intersect
                    });
                });
                this.callback(entries, obj);
            };
    
            this.listener = listener;
    
            window.addEventListener('scroll', listener);
        }
    
        observe(e){
            if(e) {
                this.elements.push(e);
                this.listener();
            }
        }
    
        unobserve(e){
            if(e) {
                let index = this.elements.indexOf(e);
                if(index != -1) {
                    this.elements.splice(index, 1);
                    this.listener();
                }
            }
        }
    }
}

//DOM loaded
window.addEventListener('load', () => {
    //Function to display error and info
    const displayInfo = m => console.info(`[INFO] Lazy-attr : ${m}`);
    const displayError = m => console.error(`[ERROR] Lazy-attr : ${m}`);

    //Verify animation stoped
    const isAnimationStoped = (e) => {
        let animationStoped = e.style.animationPlayState || e.style.webkitAnimationPlayState;
        if(animationStoped === "running") return false;
        return true;
    }

    //Main function
    let callback = (entries, observer) => {
        //For each elements in the observer
        entries.forEach(entry => {
            const target = entry.target; //Element target

            //Intersecting
            if(entry.isIntersecting){
                //Run or pause animation function
                const animationState = (e, m) => {
                    e.style.animationPlayState = m;
                    e.style.webkitAnimationPlayState = m;
                };

                //Set animation parameters
                const setAnimation = (e, animationClass) => {
                    //if(!isAnimationStoped(e)) return; //We wait the end of animation

                    //Animation duration
                    let animationTime = target.getAttribute('lazy-animation-time');
                    if(animationTime) {
                        e.style.animationDuration = `${animationTime}s`;
                        e.style.webkitAnimationDuration = `${animationTime}s`;
                    }

                    //Animation delay
                    let animationDelay = target.getAttribute('lazy-animation-delay');
                    if(animationDelay) {
                        e.style.animationDelay = `${animationDelay}s`;
                        e.style.webkitAnimationDelay = `${animationDelay}s`;
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
                }

                //Animation class
                const targetAnimation = [];
                let animationClass = target.getAttribute('lazy-animation');
                let pointer = target.getAttribute('lazy-animation-pointer');
                if(pointer && animationClass){
                    let t = document.querySelectorAll(pointer);
                    t.forEach(e => {
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

                //Start animation function after load element if it is lazy or not
                //document.querySelector('img').style.animationPlayState .webkitAnimationPlayState
                const startAnimation = () => {
                    targetAnimation.forEach(e => {
                        animationState(e, "running");
                    });

                    if(target.getAttribute('lazy-reset') === null){ //Used to don't reload animation on scroll
                        target.removeAttribute('lazy-animation');
                    }
                }

                let loadedImg = target.complete && target.naturalHeight !== 0;
                let loadedVideo = target.readyState >=0; //>=3
                let loaded = loadedImg || loadedVideo;
                if(loaded || !target.getAttribute("lazy-src")) startAnimation(); else {
                    target.addEventListener('error', () => {
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
                    if(poster) poster = `url('${poster}')`; else poster = "#000";
                    target.setAttribute("srcdoc", `<style>body{background: ${poster}; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style>
                    <a href='${code}'><span>▶</span></a>`);
                }
                
                //Lazy src
                let srcUrl = target.getAttribute('lazy-src');
                if(srcUrl) target.src = srcUrl;

                //Remove useless attributes
                target.removeAttribute('lazy-embed');
                target.removeAttribute('lazy-poster');
                target.removeAttribute('lazy-video');
                target.removeAttribute('lazy-animation-time');
                target.removeAttribute('lazy-src');

                if(target.getAttribute('lazy-reset') === null){ //Used to reload animation on scroll
                    observer.unobserve(target); //Stop observation
                };
            } else if(target.getAttribute('lazy-reset') != null){ //Reload animation
                //Reset function
                const resetAnimation = (e, animationClass=false) => {
                    //remove animation
                    if(animationClass) e.classList.remove(animationClass);
                }

                //Reset class animation for pointer or target
                let animationClass = target.getAttribute('lazy-animation');
                let pointer = target.getAttribute('lazy-animation-pointer');
                if(pointer && animationClass){
                    let t = document.querySelectorAll(pointer);
                    t.forEach(e => {
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

        //Set observer on dom elements
        //window.lazy().parameters.join(',')
        const getLazyObject = () => {
            document.body.querySelectorAll(window.lazy().parameters.join(',')).forEach(e => {
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