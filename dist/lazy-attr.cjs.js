'use strict';

/**
 * A polyfill for the IntersectionObserver object
 * @param {Function} callback 
 * @param {Object} options 
 */
function IntersectionObserverPolyfill(callback, options) {
  this.callback = callback;
  this.elements = [];
  this.options = options; //useless

  window.lazyDatas.originalObserver = false;

  function initObs() {
    var obj = this;

    function listener() {
      var entries = [];
      obj.elements.forEach(function (element) {
        var intersect = window.lazy().isIntersectingObserver(element);
        entries.push({
          target: element,
          isIntersecting: intersect
        });
      });
      callback(entries, obj);
    }
    this.listener = listener;
    var requestAnimationFrameSetup = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

    if (requestAnimationFrameSetup) {
      //Request animation frame
      (function loopDomChangement() {
        listener();
        requestAnimationFrameSetup(loopDomChangement);
      })();
    } else {
      //If not requestAnimationFrame
      setInterval(listener, 150);
    }
  }

  function observe(element) {
    if (element) {
      this.elements.push(element);
    }
  }

  function unobserve(element) {
    if (element) {
      var index = this.elements.indexOf(element);

      if (index != -1) {
        this.elements.splice(index, 1);
      }
    }
  }

  this.initObs = initObs;
  this.observe = observe;
  this.unobserve = unobserve;
  this.initObs();
}

/**
 * All lazy-attr attributes to observe
 */
var lazyParameters = {
  reset: "lazy-reset",
  animation: "lazy-animation",
  time: "lazy-animation-time",
  delay: "lazy-animation-delay",
  src: "lazy-src",
  video: "lazy-video",
  embed: "lazy-embed",
  pointer: "lazy-animation-pointer",
  "function": "lazy-animation-function",
  count: "lazy-animation-count",
  srcset: "lazy-srcset",
  poster: "lazy-poster",
  width: "lazy-size-width",
  height: "lazy-size-height",
  background: "lazy-background",
  observe: "lazy-observe" //Do not do anything (just to observe an element to make lazy request for example)

};

/**
 * All animations list
 */
var lazyAnimations = ["zoomin", "zoomout", "opacity", "slide-left", "slide-right", "slide-bottom", "slide-top", "corner-top-left", "corner-top-right", "corner-bottom-left", "corner-bottom-right", "shake", "rotate", "blur", "flip", "flip-up"];

/**
* See object intersecting for polyfill
* @param {HTMLElement} element 
*/
function isIntersectingObserver(element) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var pos = element.getBoundingClientRect();
  var hIntersect = false;
  var vIntersect = false;
  var topCondition = pos.top >= 0 && pos.top <= height;
  var bottomCondition = pos.bottom >= 0 && pos.bottom <= height;
  var leftCondition = pos.left >= 0 && pos.left <= width;
  var rightCondition = pos.right >= 0 && pos.right <= width;
  if (topCondition || bottomCondition) vIntersect = true;
  if (leftCondition || rightCondition) hIntersect = true;
  if (hIntersect && vIntersect) return true;
  return false;
}
/**
* Return if an element is intersecting without tranform animation
* @param {HTMLElement} el
*/


function isIntersectingWithoutTransform(el) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  function isElementIntersecting(element) {
    try {
      var parentRect = element.offsetParent.getBoundingClientRect();
      var left = parentRect.left + element.offsetLeft;
      var top = parentRect.top + element.offsetTop;
      var bottom = top + element.offsetHeight;
      var right = left + element.offsetWidth;
      var hIntersect = false;
      var vIntersect = false;
      var topCondition = top >= 0 && top <= height;
      var bottomCondition = bottom >= 0 && bottom <= height;
      var leftCondition = left >= 0 && left <= width;
      var rightCondition = right >= 0 && right <= width;
      if (topCondition || bottomCondition) vIntersect = true;
      if (leftCondition || rightCondition) hIntersect = true;
      if (hIntersect && vIntersect) return true;
    } catch (e) {
      return false;
    }
  }

  var pointer = el.getAttribute('lazy-animation-pointer');
  return isElementIntersecting(el) || (pointer != null ? isElementIntersecting(document.querySelector(pointer)) : false);
}

var intersecting = {
  isIntersectingObserver: isIntersectingObserver,
  isIntersectingWithoutTransform: isIntersectingWithoutTransform
};

/**
 * Change animation of lazy-attr element
 * @param {HTMLElement} element
 * @param {String} animationName
 * @param {Boolean} reload
 */
function changeAnimation(element, animationName) {
  var reload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var reset = element.getAttribute('lazy-reset');
  reset = reset != null && reset != undefined ? true : false;

  if (reset) {
    var backAnimation = element.getAttribute('lazy-animation');

    if (backAnimation && animationName) {
      var pointer = element.getAttribute('lazy-animation-pointer');

      if (pointer) {
        //with pointer
        document.querySelectorAll(pointer).forEach(function (p) {
          p.classList.remove(backAnimation);
        });
      } else {
        //no pointer
        element.classList.remove(backAnimation);
      }

      element.removeAttribute('lazy-animation');
    }

    element.setAttribute('lazy-animation', animationName); //Reload animation

    if (reload) {
      window.lazy()._data["observer"].unobserve(element);

      window.lazy()._data["observer"].observe(element);
    }
  } else {
    console.warn('Lazy-attr : Cannot change animation of not lazy-reset element !');
  }
}

/**
 * Global lazy-attr methods and datas
 * @returns data Object
 */

function lazyGlobal() {
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
    version: "1.2.3"
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
* Run or pause animation function
* @param {HTMLElement} element
* @param {String} state
*/
function animationState(element, state) {
  element.style.animationPlayState = state;
}

/**
* Used to remove useless attributes on not lazy-reset elements like the pointer
* @param {HTMLElement} parent
* @param {HTMLElement} pointer
*/

function removeUselessAttributesPointer(parent, pointer) {
  var nullAttribute = null; //remove animation

  if (window.lazy()._data['originalObserver']) {
    var animationName = parent.getAttribute('lazy-animation');
    if (animationName) pointer.classList.remove(animationName);
  } //remove size


  parent.style.minWidth = nullAttribute;
  parent.style.minHeight = nullAttribute; //animation running

  animationState(pointer, nullAttribute); //animation duration

  parent.style.animationDuration = nullAttribute; //animation delay

  parent.style.animationDelay = nullAttribute; //animation count

  parent.style.animationIterationCount = nullAttribute; //animation function

  parent.style.animationTimingFunction = nullAttribute;
}

/**
 * Set animation parameters
 * @param {Object} config 
 */

function setAnimation(config) {
  var elementToAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var target = config.target;
  var animationClass = config.animation || '';
  elementToAnimate = elementToAnimate ? elementToAnimate : config.target; // if(elementToAnimate.style.animationPlayState == "running") return; //We wait the end of animation
  //Animation duration

  var animationTime = target.getAttribute('lazy-animation-time');

  if (animationTime) {
    elementToAnimate.style.animationDuration = animationTime + "s";
  } //Animation delay


  var animationDelay = target.getAttribute('lazy-animation-delay');

  if (animationDelay) {
    elementToAnimate.style.animationDelay = animationDelay + "s";
  } //Animation count


  var animationCount = target.getAttribute('lazy-animation-count');

  if (animationCount) {
    elementToAnimate.style.animationIterationCount = animationCount;
  } //Animation function


  var animationFunction = target.getAttribute('lazy-animation-function');

  if (animationFunction) {
    elementToAnimate.style.animationTimingFunction = animationFunction;
  } //Set animation class


  elementToAnimate.classList.add(animationClass);

  if (config.reset === null) {
    //Delete useless attribute
    elementToAnimate.addEventListener('animationend', function () {
      //remove all useless attributes for the element to animate (can be the pointer)
      if (target != elementToAnimate) removeUselessAttributesPointer(target, elementToAnimate); //Delete lazy-attr attributes

      Object.values(window.lazy().parameters).forEach(function (param) {
        target.removeAttribute(param);
      });
    });
  } else {
    //Delete useless attributes on lazy-reset elements
    elementToAnimate.addEventListener('animationend', function () {
      //remove all useless attributes
      removeUselessAttributesPointer(target, elementToAnimate);
    });
  }
}

function lazyMain() {
  //Function to display error and info
  function displayInfo(msg) {
    console.info("[INFO] Lazy-attr : " + msg);
  }

  function displayError(msg) {
    console.error("[ERROR] Lazy-attr : " + msg);
  }
  /**
   * Main function
   * @param {*} entries 
   * @param {*} observer 
   */

  function callback(entries, observer) {
    //For each elements in the observer
    entries.forEach(function (entry) {
      var target = entry.target; //Element target
      //Set configuration

      var config = {
        target: target
      };

      for (var _i = 0, _Object$entries = Object.entries(window.lazy().parameters); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        config[key] = target.getAttribute(value);
      }
      if (config.pointer != null) config.pointer = document.querySelectorAll(config.pointer); //Intersecting

      if (entry.isIntersecting) {
        if (config.pointer) {
          config.pointer.forEach(function (pointer) {
            if (config.animation) {
              setAnimation(config, pointer); //set animation

              animationState(pointer, "paused");
            }
          });
        } else {
          if (config.animation) {
            setAnimation(config); //set animation

            animationState(target, "paused");
          }
        } //See loaded elements


        var loadedImg = target.complete && target.naturalHeight !== 0;
        var loadedVideo = target.readyState >= 0; //>=3

        var loaded = loadedImg || loadedVideo; //Set class on lazy element

        var setClassLazy = function setClassLazy(el) {
          var haveClass = el.classList.toString().indexOf('lazyattr') != -1;

          if (haveClass) {
            el.classList.remove('lazyattr');
            el.classList.add('lazyloaded');
          }
        };
        /**
        * Start animation function after load element if it is lazy or not
        */


        var startAnimation = function startAnimation() {
          //minimum size
          target.style.minWidth = null;
          target.style.minHeight = null;
          if (config.pointer) config.pointer.forEach(function (el) {
            setClassLazy(el);
            animationState(el, "running"); //remove skeleton animation

            window.lazy().skeletons.forEach(function (className) {
              return el.classList.remove(className);
            });
          });else {
            setClassLazy(config.target);
            animationState(config.target, "running");
            window.lazy().skeletons.forEach(function (className) {
              return config.target.classList.remove(className);
            });
          }
        };

        if (loaded || !config.src && !config.srcset && !config.background) {
          startAnimation(); //Event handler

          var event = new CustomEvent('lazy-loaded', config);
          target.dispatchEvent(event);
          if (config.pointer) config.pointer.forEach(function (e) {
            return e.dispatchEvent(event);
          });
        } else if (config.background) {
          //Lazy-background
          var srcBackground = config.background;

          if (srcBackground) {
            var cacheImg = new Image();
            cacheImg.src = srcBackground;
            cacheImg.addEventListener('error', function () {
              startAnimation();
              displayError("cannot load url " + target.src);
            });
            cacheImg.addEventListener('load', function () {
              target.style.backgroundImage = "url('" + cacheImg.src + "')";
              startAnimation();
            });
          }
        } else {
          target.addEventListener('error', function () {
            startAnimation();
            displayError("cannot load url " + target.src);
          }); //callback function

          target.addEventListener('load', function () {
            //start animation after load
            startAnimation();
          });
        } //Lazy video


        var srcPoster = config.video;
        if (srcPoster) target.setAttribute("poster", srcPoster);
        target.preload = "none"; //Lazy iframe

        var code = config.embed;

        if (code) {
          //If it's not IE
          if (!window.lazy()._data['isIE']) {
            var poster = config.poster; //Permet de mettre un poster à la vidéo

            if (poster) poster = "url('" + poster + "')";else poster = "#000";
            target.setAttribute("srcdoc", "<style>body{background: " + poster + "; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href='" + code + "'><span>&#9654;</span></a>");
          } else {
            //IE do not support srcdoc
            target.setAttribute('src', code);
          }
        } //Lazy src


        var srcUrl = config.src;
        if (srcUrl) target.src = srcUrl; //Lazy srcset

        var srcSet = config.srcset;
        if (srcSet) target.setAttribute('srcset', srcSet); //Remove useless attributes after load

        target.removeAttribute('lazy-embed');
        target.removeAttribute('lazy-poster');
        target.removeAttribute('lazy-video');
        target.removeAttribute('lazy-src');
        target.removeAttribute('lazy-srcset');
        target.removeAttribute('lazy-background');

        if (config.reset === null) {
          //Used to reload animation on scroll
          target.removeAttribute('lazy-observe');
          observer.unobserve(target); //Stop observation
        }
      } else if (config.reset != null && !window.lazy().isIntersectingWithoutTransform(target)) {
        //Reload animation
        //Reset function
        var resetAnimation = function resetAnimation(element, animationClass) {
          //remove animation
          if (animationClass) element.classList.remove(animationClass);
        }; //Reset class animation for pointer or target


        if (config.pointer && config.animation) {
          config.pointer.forEach(function (pointer) {
            resetAnimation(pointer, config.animation); // pointer.style.animationDirection = 'reverse';
          });
        } else {
          resetAnimation(target, config.animation);
        } //Dispatch event on quit


        var _event = new CustomEvent('lazy-quit', config);

        target.dispatchEvent(_event);
        if (config.pointer) config.pointer.forEach(function (e) {
          return e.dispatchEvent(_event);
        });
      }
    });
  } //Get available


  if (window.IntersectionObserver && window.lazy() && window.lazyDatas) {
    //Set observer on dom elements
    var getLazyObject = function getLazyObject() {
      var tags = Object.values(window.lazy().parameters).map(function (e) {
        return "[".concat(e, "]");
      });
      document.body.querySelectorAll(tags.join(',')).forEach(function (el) {
        //Get default width and height
        var sizeWidth = el.getAttribute('lazy-size-width');
        var sizeHeight = el.getAttribute('lazy-size-height'); //Set default width and height (removed after load)

        if (sizeWidth) el.style.minWidth = sizeWidth;
        if (sizeHeight) el.style.minHeight = sizeHeight; //Start observing

        observer.observe(el);
      });
    }; //Recording change from the dom


    var getMutationObserver = function getMutationObserver() {
      return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    };

    //Observer
    var observer = new IntersectionObserver(callback, window.lazy().options);
    window.lazyDatas["observer"] = observer;
    var MutationObserver = getMutationObserver();
    var observerDOM = new MutationObserver(function (mutations) {
      if (!mutations) return;
      mutations.forEach(function (mutation) {
        var addedNodes = Array.prototype.slice.call(mutation.addedNodes);
        var removedNodes = Array.prototype.slice.call(mutation.removedNodes);
        if (addedNodes && addedNodes.length > 0) getLazyObject();
        removedNodes.forEach(function (node) {
          try {
            observer.unobserve(node);
          } catch (e) {}
        });
      });
    });
    observerDOM.observe(window.document.documentElement, {
      childList: true,
      subtree: true,
      removedNodes: true
    }); //document.addEventListener("change", getLazyObject);

    getLazyObject(); //Info

    displayInfo('version ' + window.lazy().version);
  } else {
    //Error
    displayError('Incompatible or verify window.lazy and window.lazyDatas integration');
  }
}

/**
 * CustomEvent() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
function CustomEventSetup() {
  if (typeof window.CustomEvent === 'function') return false;

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}

/**
 * ForEach polyfill
 */
function setUpForEach() {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }
}

/**
 * Object.values polyfill
 */
function setObjectValues() {
  if (!Object.values) {
    Object.values = function (obj) {
      return Object.keys(obj).map(function (e) {
        return obj[e];
      });
    };
  }
}

/**
 * Object.entries polyfill
 */
function setObjectEntries() {
  if (!Object.entries) {
    Object.entries = function (obj) {
      return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
      });
    };
  }
}

CustomEventSetup(); //Foreach creation for IE

setUpForEach(); //Object.values polyfill for IE

setObjectValues(); //Object.entries polyfill for IE

setObjectEntries(); //Datas

window.lazyDatas = {
  isIE: !!document.documentMode,
  originalObserver: true
}; //Locked methods
//Global methods of lazy attr

window.lazy = lazyGlobal; //Create IntersectionObserver for old version of navigator

if (!window.IntersectionObserver) {
  //Create a prototype of the IntersectionObserver polyfill
  window.IntersectionObserver = IntersectionObserverPolyfill;
} //DOM loaded


document.addEventListener('DOMContentLoaded', lazyMain);
