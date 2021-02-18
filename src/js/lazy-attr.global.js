import getUpdateLazyAttr from "./lazy-attr.update";
import lazyParameters from "./lazy-attr.parameters";
import lazyAnimations from "./lazy-attr.animations";

export default function lazyGlobal(){

    /**
     * Get lhe lastest version
     * @param {Function} callback 
     */
    function getLastVersion(callback){
        getUpdateLazyAttr(callback);
    }

    /**
     * See object intersecting for polyfill
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
        parameters: lazyParameters,
        //animation list
        animations: lazyAnimations,
        //options
        options: {
            root: null,
            rootMargin: "0px",
            threshold: 0
        },
        //version
        version: "1.1.8",
        //version matcher
        versionMatcher: "[#version]1.1.8[#version]" 
    }
}