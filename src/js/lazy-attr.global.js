import lazyParameters from "./lazy-attr.parameters";
import lazyAnimations from "./lazy-attr.animations";

import intersecting from "./lazy-attr.intersecting";
import changeAnimation from "./lazy-attr.change.animation";

export default function lazyGlobal(){
    return {
        //datas
        _data: window.lazyDatas,

        //methods
        changeAnimation: changeAnimation,
        isIntersecting: intersecting.isIntersecting,
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
        version: "1.2.0",
    }
}