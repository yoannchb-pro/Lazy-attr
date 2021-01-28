export default function IntersectionObserverPolyfill(callback, options){
    this.callback = callback;
    this.elements = [];
    this.options = options;
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