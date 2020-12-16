//DOM loaded
//V 1.0.1
window.addEventListener('load', () => {
    //Parameters to get lazy elements from DOM
    let parameters = ["[lazy-reset]", 
                    "[lazy-animation]",  
                    "[lazy-animation-time]", 
                    "[lazy-animation-delay]",
                    "[lazy-src]",
                    "[lazy-video]",
                    "[lazy-embed]"];

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

                const startAnimation = () => {
                    //Animation class
                    let animationClass = target.getAttribute('lazy-animation');
                    if(animationClass) target.classList.add(animationClass);
                    
                    //Animation style
                    let animationStyle = target.getAttribute('lazy-animation-style');
                    let s = target.style.cssText;
                    if(s[s.length-1] != ";") s += ";";
                    if(animationStyle) target.style = s + animationStyle;

                    if(target.getAttribute('lazy-reset') === null){ //Used to reload animation on scroll
                        target.removeAttribute('lazy-animation');
                    }
                }
                if(target.complete || !target.getAttribute("lazy-src")) startAnimation(); else target.addEventListener('load', startAnimation);

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
                target.classList.remove(animationClass);

                //Reset animation delay
                let d = target.getAttribute('lazy-animation-delay');
                if(d) target.style.animationDelay = "";
            }
        });
    }

    //Observer options
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0
    }

    //Observer
    let observer = new IntersectionObserver(callback, options);

    //Set observer on dom elements
    const getLazyObject = () => {
        document.body.querySelectorAll(parameters.join(',')).forEach(e => {
            observer.observe(e);
        });
    }
    document.addEventListener("DOMNodeInserted", getLazyObject);
    getLazyObject();

    console.log('[INFO] Lazy configuration have been lauch');
});