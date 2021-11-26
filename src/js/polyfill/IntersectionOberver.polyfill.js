/**
 * A polyfill for the IntersectionObserver object
 * @param {Function} callback 
 * @param {Object} options 
 */
export default function IntersectionObserverPolyfill(callback, options){
    this.callback = callback;
    this.elements = [];
    this.options = options; //useless

    window.lazyDatas.originalObserver = false;

    function initObs(){
        const obj = this;

        function listener(){
            const entries = [];

            obj.elements.forEach(function(element){
                const intersect = window.lazy().isIntersectingObserver(element);

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

            //Request animation frame
            (function loopDomChangement(){
                listener();
                requestAnimationFrameSetup(loopDomChangement);
            })();

        } else {

            //If not requestAnimationFrame
            setInterval(listener, 150);
        }
    }

    function observe(element){
        if(element) {
            this.elements.push(element);
        }
    }

    function unobserve(element){
        if(element) {
            const index = this.elements.indexOf(element);
            if(index != -1) {
                this.elements.splice(index, 1);
            }
        }
    }
    
    this.initObs = initObs;
    this.observe = observe;
    this.unobserve = unobserve;
    
    this.initObs();
}