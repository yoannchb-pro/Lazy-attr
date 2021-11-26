/**
 * All lazy-attr attributes to observe
 */
const lazyParameters = {
    reset: "lazy-reset", 
    animation: "lazy-animation",  
    time: "lazy-animation-time", 
    delay: "lazy-animation-delay",
    src: "lazy-src",
    video: "lazy-video",
    embed: "lazy-embed",
    pointer: "lazy-animation-pointer",
    function: "lazy-animation-function",
    count: "lazy-animation-count",
    srcset: "lazy-srcset",
    poster: "lazy-poster",
    width: "lazy-size-width",
    height: "lazy-size-height",
    background: "lazy-background",
    observe: "lazy-observe" //Do not do anything (just to observe an element to make lazy request for example)
};

export default lazyParameters;