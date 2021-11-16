import styles from "../css/lazy-attr-animation.css"

import IntersectionObserverPolyfill from "./IntersectionOberver.polyfill"
import lazyGlobal from "./lazy-attr.global"
import lazyMain from "./lazy-attr.main"

//Foreach creation for IE
if(window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if(window.HTMLCollection && !HTMLCollection.prototype.forEach) {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

//Datas
window.lazyDatas = {
    isIE: !!document.documentMode,
    originalObserver: true
};

//Locked methods
//Global methods of lazy
window.lazy = lazyGlobal;

//Create IntersectionObserver for old version of navigator
if(!window.IntersectionObserver){
    //Create a prototype of the IntersectionObserver polyfill
    window.IntersectionObserver = IntersectionObserverPolyfill;
}

//DOM loaded
window.addEventListener('load', lazyMain);