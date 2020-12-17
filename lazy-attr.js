/**
 * https://github.com/yoannchb-pro/Lazy-attr
 * VERSION: 1.0.5
 */

window.lazy = () => {
    return {
        //search attributes parameters for observer
        parameters: ["[lazy-reset]", 
                    "[lazy-animation]",  
                    "[lazy-animation-time]", 
                    "[lazy-animation-delay]",
                    "[lazy-src]",
                    "[lazy-video]",
                    "[lazy-embed]",
                    "[lazy-animation-pointer]"],
        //animation list
        animations: ["zoomin",
                     "zoomout", 
                    "opacity", 
                    "from-left",
                    "from-right",
                     "from-bottom", 
                     "from-top", 
                     "shake", 
                     "rotate",
                     "blur",
                     "rotate3d",
                     "rotate3d-up"],
        //options
        options: {
            root: null,
            rootMargin: "0px",
            threshold: 0
        },
        //version
        version: "1.0.5"
    }
}

//DOM loaded
window.addEventListener('load', () => {
    //Function to display error and info
    const displayInfo = m => console.log(`[INFO] Lazy-attr : ${m}`);
    const displayError = m => console.error(`[ERROR] Lazy-attr : ${m}`);

    let callback = (entries, observer) => {
        entries.forEach(entry => {
            const target = entry.target; //Element target

            if(entry.isIntersecting){
                //Animation duration
                let animationTime = target.getAttribute('lazy-animation-time');
                if(animationTime) target.style.animationDuration = `${animationTime}s`;

                //Animation delay
                let animationDelay = target.getAttribute('lazy-animation-delay');
                if(animationDelay) target.style.animationDelay = `${animationDelay}s`;


                //Run or pause animation function
                const animationState = (e, m) => {
                    e.style.animationPlayState = m;
                    e.webkitAnimationPlayState = m;
                };

                //Animation class
                let animationClass = target.getAttribute('lazy-animation');
                let pointer = target.getAttribute('lazy-animation-pointer');
                const targetAnimation = [];
                if(pointer && animationClass){
                    let t = document.querySelectorAll(pointer);
                    t.forEach(e => {
                        e.classList.add(animationClass);
                        animationState(e, "paused");
                        targetAnimation.push(e);
                    });
                } else {
                    if(animationClass){
                        target.classList.add(animationClass);
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
                //Reset class animation
                let animationClass = target.getAttribute('lazy-animation');
                let pointer = target.getAttribute('lazy-animation-pointer');
                if(pointer && animationClass){
                    let t = document.querySelectorAll(pointer);
                    t.forEach(e => {
                        e.classList.remove(animationClass);
                    });
                } else {
                    if(animationClass) target.classList.remove(animationClass);
                }

                //Reset animation delay
                let d = target.getAttribute('lazy-animation-delay');
                if(d) target.style.animationDelay = "";
            }
        });
    }

    //Get available
    if(window.IntersectionObserver && window.lazy()){
        //Observer
        let observer = new IntersectionObserver(callback, window.lazy().options);

        //Set observer on dom elements
        const getLazyObject = () => {
            document.body.querySelectorAll(window.lazy().parameters.join(',')).forEach(e => {
                observer.observe(e);
            });
        }
        document.addEventListener("DOMNodeInserted", getLazyObject);
        getLazyObject();

        //Info
        displayInfo('version ' + window.lazy().version);
    } else {
        //Error
        displayError('incompatible or verify window.lazy integration');
    }
});