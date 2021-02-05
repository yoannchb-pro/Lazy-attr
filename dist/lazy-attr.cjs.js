'use strict';

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
        var intersect = window.lazy().isIntersecting(element);
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
      (function loopDomChangement() {
        listener();
        requestAnimationFrameSetup(loopDomChangement);
      })();
    } else {
      //If not requestAnimationFrame
      setInterval(listener, 100);
    }
  }

  function observe(e) {
    if (e) {
      this.elements.push(e);
    }
  }

  function unobserve(e) {
    if (e) {
      var index = this.elements.indexOf(e);

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

function getUpdateLazyAttr(callback) {
  var req = new XMLHttpRequest(); //Ok

  req.onload = function () {
    var res = req.responseText;
    var p = '[#version]';
    var nv = res.substring(res.indexOf(p) + p.length);
    nv = nv.substring(nv.indexOf(p) + p.length);
    nv = nv.substring(0, nv.indexOf(p));
    callback({
      error: false,
      version: nv
    });
  }; //Error


  req.onerror = function () {
    callback({
      error: true,
      content: "Error while fetching"
    });
  };

  req.open('GET', window.lazyDatas["updateURL"]);
  req.send();
}

var lazyParameters = ["[lazy-reset]", "[lazy-animation]", "[lazy-animation-time]", "[lazy-animation-delay]", "[lazy-src]", "[lazy-video]", "[lazy-embed]", "[lazy-animation-pointer]", "[lazy-animation-function]", "[lazy-animation-count]", "[lazy-callback]", "[lazy-srcset]", "[lazy-poster]", "[lazy-size-width]", "[lazy-size-height]"];

var lazyAnimations = ["zoomin", "zoomout", "opacity", "slide-left", "slide-right", "slide-bottom", "slide-top", "corner-top-left", "corner-top-right", "corner-bottom-left", "corner-bottom-right", "shake", "rotate", "blur", "flip", "flip-up"];

function lazyGlobal() {
  /**
   * Get lhe lastest version
   * @param {Function} callback 
   */
  function getLastVersion(callback) {
    getUpdateLazyAttr(callback);
  }
  /**
   * See object intersecting for polyfill
   * @param {HTMLElement} element 
   */


  function isIntersecting(element) {
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
   * Return if an element is intersecting without tranform of animation
   * @param {HTMLElement} el
   */


  function isIntersectingWithoutTransform(el) {
    var width = window.innerWidth;
    var height = window.innerHeight;

    function isElementIntersecting(element) {
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
    }

    var pointer = el.getAttribute('lazy-animation-pointer');
    return isElementIntersecting(el) || (pointer != null ? isElementIntersecting(document.querySelector(pointer)) : false);
  }
  /**
   * Change animation of lazy block (e for element, a for animation name and r to reload or no the animation)
   * @param {HTMLElement} e 
   * @param {String} a 
   * @param {Boolean} r 
   */


  function changeAnimation(e, a, r) {
    var reset = e.getAttribute('lazy-reset');
    reset = reset != null && reset != undefined ? true : false;

    if (reset) {
      var backAnimation = e.getAttribute('lazy-animation');

      if (backAnimation && a) {
        var pointer = e.getAttribute('lazy-animation-pointer');

        if (pointer) {
          //with pointer
          document.querySelectorAll(pointer).forEach(function (p) {
            p.classList.remove(backAnimation);
          });
        } else {
          //no pointer
          e.classList.remove(backAnimation);
        }

        e.removeAttribute('lazy-animation');
      }

      e.setAttribute('lazy-animation', a); //Reload animation

      if (r) {
        window.lazy()._data["observer"].unobserve(e);

        window.lazy()._data["observer"].observe(e);
      }
    } else {
      console.warn('Lazy-attr : Cannot change animation of not lazy-reset element !');
    }
  }
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
    version: "1.1.7",
    //version matcher
    versionMatcher: "[#version]1.1.7[#version]"
  };
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
      //Intersecting

      if (entry.isIntersecting) {
        /**
         * Run or pause animation function
         * @param {HTMLElement} element
         * @param {String} state
         */
        var animationState = function animationState(element, state) {
          element.style.animationPlayState = state;
          element.style.webkitAnimationPlayState = state;
        };

        /**
         * used to remove useless attributes on not lazy-reset elements t=target and e=pointer
         * @param {HTMLElement} parent
         * @param {HTMLElement} pointer
         */
        var removeUselessAttributes = function removeUselessAttributes(parent, pointer) {
          var nullAttribute = null; //remove animation

          if (window.lazy()._data['originalObserver']) {
            var animationName = parent.getAttribute('lazy-animation');
            if (animationName) pointer.classList.remove(animationName);
          } //remove size


          parent.style.minWidth = nullAttribute;
          parent.style.minHeight = nullAttribute; //animation running

          animationState(pointer, nullAttribute); //animation duration

          parent.style.animationDuration = nullAttribute;
          parent.style.webkitAnimationDuration = nullAttribute; //animation delay

          parent.style.animationDelay = nullAttribute;
          parent.style.webkitAnimationDelay = nullAttribute; //animation count

          parent.style.animationIterationCount = nullAttribute;
          parent.style.webkitAnimationIterationCount = nullAttribute; //animation function

          parent.style.animationTimingFunction = nullAttribute;
          parent.style.webkitAnimationTimingFunction = nullAttribute;
        };
        /**
         * Set animation parameters
         * @param {HTMLElement} element
         * @param {String} animationClass 
         */


        var setAnimation = function setAnimation(element, animationClass) {
          //if(!isAnimationStoped(e)) return; //We wait the end of animation
          //Animation duration
          var animationTime = target.getAttribute('lazy-animation-time');

          if (animationTime) {
            element.style.animationDuration = animationTime + "s";
            element.style.webkitAnimationDuration = animationTime + "s";
          } //Animation delay


          var animationDelay = target.getAttribute('lazy-animation-delay');

          if (animationDelay) {
            element.style.animationDelay = animationDelay + "s";
            element.style.webkitAnimationDelay = animationDelay + "s";
          } //Animation count


          var animationCount = target.getAttribute('lazy-animation-count');

          if (animationCount) {
            element.style.animationIterationCount = animationCount;
            element.style.webkitAnimationIterationCount = animationCount;
          } //Animation function


          var animationFunction = target.getAttribute('lazy-animation-function');

          if (animationFunction) {
            element.style.animationTimingFunction = animationFunction;
            element.style.webkitAnimationTimingFunction = animationFunction;
          } //Set animation class


          element.classList.add(animationClass);

          if (target.getAttribute('lazy-reset') === null) {
            //Delete useless attribute
            element.addEventListener('animationend', function () {
              //remove all useless attributes
              removeUselessAttributes(target, element); //Delete lazy-attr attributes

              window.lazy().parameters.forEach(function (param) {
                param = param.replace(/(\[||\])/gi, "");
                target.removeAttribute(param);
              });
            });
          } else {
            //Delete useless attributes on lazy-reset elements
            element.addEventListener('animationend', function () {
              //remove all useless attributes
              removeUselessAttributes(target, element);
            });
          }
        }; //Animation class
        var targetAnimation = [];
        var animationClass = target.getAttribute('lazy-animation');
        var pointer = target.getAttribute('lazy-animation-pointer');

        if (pointer && animationClass) {
          var pointers = document.querySelectorAll(pointer);
          pointers.forEach(function (pointer) {
            setAnimation(pointer, animationClass); //set animation

            animationState(pointer, "paused");
            targetAnimation.push(pointer);
          });
        } else {
          if (animationClass) {
            setAnimation(target, animationClass); //set animation

            animationState(target, "paused");
            targetAnimation.push(target);
          }
        } //See loaded elements


        var loadedImg = target.complete && target.naturalHeight !== 0;
        var loadedVideo = target.readyState >= 0; //>=3

        var loaded = loadedImg || loadedVideo; //Call callback function

        var loadedFunction = function loadedFunction() {
          var callbackFunction = target.getAttribute('lazy-callback');
          if (callbackFunction) window[callbackFunction]();
        }; //Set class on lazy element


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
          targetAnimation.forEach(function (el) {
            setClassLazy(el);
            animationState(el, "running");
          });
        };

        if (loaded || !target.getAttribute("lazy-src")) {
          loadedFunction();
          startAnimation();
        } else {
          target.addEventListener('error', function () {
            startAnimation();
            displayError("cannot load url " + target.src);
          }); //callback function

          target.addEventListener('load', function () {
            loadedFunction(); //start animation after load

            startAnimation();
          }); //callback function video

          target.addEventListener('loadeddata', loadedFunction);
        } //Lazy video


        var srcPoster = target.getAttribute('lazy-video');
        if (srcPoster) target.setAttribute("poster", srcPoster);
        target.preload = "none"; //Lazy iframe

        var code = target.getAttribute('lazy-embed');

        if (code) {
          //If it's not IE
          if (!window.lazy()._data['isIE']) {
            var poster = target.getAttribute('lazy-poster'); //Permet de mettre un poster à la vidéo

            if (poster) poster = "url('" + poster + "')";else poster = "#000";
            target.setAttribute("srcdoc", "<style>body{background: " + poster + "; background-position: center; background-size: cover;}*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href='" + code + "'><span>▶</span></a>");
          } else {
            //IE do not support srcdoc
            target.setAttribute('src', code);
          }
        } //Lazy src


        var srcUrl = target.getAttribute('lazy-src');
        if (srcUrl) target.src = srcUrl; //Lazy srcset

        var srcSet = target.getAttribute('lazy-srcset');
        if (srcSet) target.setAttribute('srcset', srcSet); //Remove useless attributes after load

        target.removeAttribute('lazy-embed');
        target.removeAttribute('lazy-poster');
        target.removeAttribute('lazy-video');
        target.removeAttribute('lazy-src');

        if (target.getAttribute('lazy-reset') === null) {
          //Used to reload animation on scroll
          observer.unobserve(target); //Stop observation
        }
      } else if (target.getAttribute('lazy-reset') != null && !window.lazy().isIntersectingWithoutTransform(target)) {
        //Reload animation
        //Reset function
        var resetAnimation = function resetAnimation(element, animationClass) {
          //remove animation
          if (animationClass) element.classList.remove(animationClass);
        }; //Reset class animation for pointer or target


        var _animationClass = target.getAttribute('lazy-animation');

        var havePointer = target.getAttribute('lazy-animation-pointer');

        if (havePointer && _animationClass) {
          var _pointers = document.querySelectorAll(havePointer);

          _pointers.forEach(function (pointer) {
            resetAnimation(pointer, _animationClass);
          });
        } else {
          resetAnimation(target, _animationClass);
        }
      }
    });
  } //Get available


  if (window.IntersectionObserver && window.lazy() && window.lazyDatas) {
    /**
     * Set observer on dom elements
     */
    var getLazyObject = function getLazyObject() {
      document.body.querySelectorAll(window.lazy().parameters.join(',')).forEach(function (el) {
        //Get default width and height
        var sizeWidth = el.getAttribute('lazy-size-width');
        var sizeHeight = el.getAttribute('lazy-size-height'); //Set default width and height (removed after load)

        if (sizeWidth) el.style.minWidth = sizeWidth;
        if (sizeHeight) el.style.minHeight = sizeHeight; //Start observing

        observer.observe(el);
      });
    };

    //Observer
    var observer = new IntersectionObserver(callback, window.lazy().options);
    window.lazyDatas["observer"] = observer;
    document.addEventListener("DOMNodeInserted", getLazyObject); //document.addEventListener("change", getLazyObject);

    getLazyObject(); //Info

    displayInfo('version ' + window.lazy().version);
  } else {
    //Error
    displayError('incompatible or verify window.lazy and window.lazyDatas integration');
  }
}

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
} //Datas


window.lazyDatas = {
  isIE: !!document.documentMode,
  updateURL: "https://unpkg.com/lazy-attr@latest/dist/lazy-attr.min.js",
  originalObserver: true
}; //Locked methods
//Global methods of lazy

window.lazy = lazyGlobal; //Create IntersectionObserver for old version of navigator

if (!window.IntersectionObserver) {
  //Create a prototype of the IntersectionObserver polyfill
  window.IntersectionObserver = IntersectionObserverPolyfill;
} //DOM loaded


window.addEventListener('load', lazyMain);
