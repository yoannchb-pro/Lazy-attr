import styles from "../css/lazy-attr-animation.css"

import IntersectionObserverPolyfill from "./polyfill/IntersectionOberver.polyfill"
import lazyGlobal from "./datas/lazy-attr.global"
import lazyMain from "./main/lazy-attr.main"
import CustomEventSetup from "./polyfill/CustomEvent.polyfill"
import setUpForEach from "./polyfill/ForEach.polyfill"
import setObjectValues from "./polyfill/ObejectValues.polyfill"
import setObjectEntries from "./polyfill/ObjectEntries.polyfill"

//CustomEvent polyfill for IE
CustomEventSetup();

//Foreach creation for IE
setUpForEach();

//Object.values polyfill for IE
setObjectValues();

//Object.entries polyfill for IE
setObjectEntries();

//Datas
window.lazyDatas = {
    isIE: !!document.documentMode,
    originalObserver: true
};

//Locked methods
//Global methods of lazy attr
window.lazy = lazyGlobal;

//Create IntersectionObserver for old version of navigator
if(!window.IntersectionObserver){
    //Create a prototype of the IntersectionObserver polyfill
    window.IntersectionObserver = IntersectionObserverPolyfill;
}

//DOM loaded
document.addEventListener('DOMContentLoaded', lazyMain);