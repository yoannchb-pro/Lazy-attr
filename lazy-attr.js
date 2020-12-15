//DOM loaded
window.addEventListener('load', () => {
    //Parameters to get lazy elements from DOM
    let parameters = ["[lazy-reset]", 
                    "[lazy-animation]", 
                    "[lazy-animation-style]", 
                    "[lazy-animation-time]", 
                    "[lazy-animation-delay]",
                    "[lazy-src]",
                    "[lazy-video]",
                    "[lazy-embed]"];

    let callback = (entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                //Lazy video
                let srcPoster = entry.target.getAttribute('lazy-video');
                if(srcPoster) entry.target.setAttribute("poster", srcPoster);
                entry.target.preload = "none";

                //Lazy iframe
                let code = entry.target.getAttribute('lazy-embed');
                if(code){
                    let poster = entry.target.getAttribute('lazy-poster'); //Permet de mettre un poster à la vidéo
                    if(poster) poster = `url('${poster}')`; else poster = "#000";
                    entry.target.setAttribute("srcdoc", `<style>body{background: ${poster}; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style>
                    <a href='${code}'><span>▶</span></a>`);
                }

                //Lazy src
                let srcUrl = entry.target.getAttribute('lazy-src');
                if(srcUrl) entry.target.src = srcUrl;

                //Animation duration
                let animationTime = entry.target.getAttribute('lazy-animation-time');
                if(animationTime) entry.target.style.transition = `${animationTime}s ease`;

                //Animation delay
                let animationDelay = entry.target.getAttribute('lazy-animation-delay');
                if(animationDelay) entry.target.style.transitionDelay = `${animationDelay}s`;

                //Animation class
                let animationClass = entry.target.getAttribute('lazy-animation');
                if(animationClass) entry.target.classList.add(animationClass);

                //Animation style
                let animationStyle = entry.target.getAttribute('lazy-animation-style');
                let s = entry.target.style.cssText;
                if(s[s.length-1] != ";") s += ";";
                if(animationStyle) entry.target.style = s + animationStyle;

                //Remove useless attributes
                entry.target.removeAttribute('lazy-embed');
                entry.target.removeAttribute('lazy-poster');
                entry.target.removeAttribute('lazy-video');
                entry.target.removeAttribute('lazy-animation-time');
                entry.target.removeAttribute('lazy-src');

                if(entry.target.getAttribute('lazy-reset') === null){ //Used to reload animation on scroll
                    entry.target.removeAttribute('lazy-animation-style');
                    entry.target.removeAttribute('lazy-animation');
                    observer.unobserve(entry.target); //Stop observation
                };
            } else if(entry.target.getAttribute('lazy-reset') != null){ //Reload animation
                //Reset class animation
                let animationClass = entry.target.getAttribute('lazy-animation');
                entry.target.classList.remove(animationClass);

                //Reset style animation
                let s = entry.target.getAttribute('lazy-animation-style');
                let cs = entry.target.style.cssText;
                if(cs && cs != null){
                    entry.target.style = cs.replace(s, "");
                }

                //Reset animation delay
                let d = entry.target.getAttribute('lazy-animation-delay');
                if(d) entry.target.style.transitionDelay = "";
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
    document.body.querySelectorAll(parameters.join(',')).forEach(e => {
        observer.observe(e);
    });

    console.log('[INFO] Lazy configuration have been lauch');
});