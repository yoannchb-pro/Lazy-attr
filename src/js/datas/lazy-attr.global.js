import lazyParameters from "../datas/lazy-attr.parameters";
import lazyAnimations from "./lazy-attr.animations";

import intersecting from "../utils/lazy-attr.intersecting";
import changeAnimation from "../animations/lazy-attr.change.animation";

/**
 * Global lazy-attr methods and datas
 * @returns data Object
 */
export default function lazyGlobal(){
    return {
        //datas
        _data: window.lazyDatas,

        //methods
        changeAnimation: changeAnimation,
        isIntersectingObserver: intersecting.isIntersectingObserver,
        isIntersectingWithoutTransform: intersecting.isIntersectingWithoutTransform,

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

        //skeletons animations
        skeletons: ["lazy-skeleton", "lazy-skeleton-corner", "lazy-skeleton-top"],

        //version
        version: "1.2.1",
    }
}