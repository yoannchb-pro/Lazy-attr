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

            //If not requestAnimationFrame
            setInterval(listener, 200);
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
    
    this.initObs = initObs;
    this.observe = observe;
    this.unobserve = unobserve;
    
    this.initObs();
}