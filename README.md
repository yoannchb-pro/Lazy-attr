# 📖 Lazy-attr v1.2.1

[![npm](https://img.shields.io/badge/npm-download-green)](https://www.npmjs.com/package/lazy-attr) [![Download](https://img.shields.io/badge/github-download-gree)](https://github.com/yoannchb-pro/Lazy-attr)

Create lazy loading request or element like image, iframe, video... Make custom animation on lazy and not lazy element on all browser. You can also use our animations included in the lib ([Demo](https://yoannchb-pro.github.io/Lazy-attr/index.html#toanimate)). All of that just with html attributes.

## All browser supported

<img src="./assets/browser.png" alt="supported browser"></img>

## Example
---

```html
<img lazy-src="https://picsum.photos/300/300?random=1" lazy-srcset="https://picsum.photos/300/300?random=2 900w" lazy-animation="corner-top-left" lazy-reset>
```

## 🎉 Update
---

- Working in vuejs and other

## 📚 Documentation & Demo
---

- [Github website documentation and demo](https://yoannchb-pro.github.io/Lazy-attr/index.html)

## 💻 Import
---

### Node
```js
import lazyattr from "lazy-attr";
import "lazy-attr/dist/lazy-attr-animation.css";

//Vue.use(lazyattr)
```

### CDN
```html
<script src="https://unpkg.com/lazy-attr@1.2.1/dist/lazy-attr.js" type="text/javascript"></script>
<link href="https://unpkg.com/lazy-attr@1.2.1/dist/lazy-attr-animation.css" rel="stylesheet"/>
```

### From download
```html
<script src="./dist/lazy-attr.js" type="text/javascript"></script>
<link href="./dist/lazy-attr-animation.css" rel="stylesheet"/>
```

## Events
---
- `lazy-loaded` When the element is matched
- `lazy-quit` When the element is not matched

## Lazy request
---
- You can add lazy-reset if you want to dispatch the event not just once time
```html
<div id="cars" lazy-observe></div>
```
```js
document.querySelector('#cars').addEventListener('lazy-loaded', function(event){
    const target = event.target;
    target.textContent = "Hey I'm lazy";
});
```

## Class
---

- You can set a class `lazyattr` wich be transform in `lazyloaded` after the element is loaded (work on the pointer and parent)
- You can make a beatiful skeleton loader with `lazy-skeleton`, `lazy-skeleton-corner` and `lazy-skeleton-top` class

## Skeletons
---

- To set a skeleton loader on an image pls set it on his parent. After you need to put `lazy-animation-pointer="#parent"` on the image to remove it after load.
- Set a skeleton loader on a div with `lazy-background` will automatically remove it after load.

## Attributes
---

## Image, iframe and video
|        Parameters        |                                             Usage                                            |
|:-----------------------:|:--------------------------------------------------------------------------------------------:|
| lazy-observe            | Just observe the element to do lazy request for example                                      |
| lazy-reset              | Reset the animation on scroll                                                                |
| lazy-srcset             | Same as srcset attribute                                                                     |
| lazy-src                | Image soucre \| iframe source \| video source                                                |
| lazy-background         | Image source to make a lazy background image                                                 |
| lazy-size-width         | Minimum width size                                                                           |
| lazy-size-height        | Minimum height size                                                                          |
| lazy-animation          | Animation to lauch after full load of element                                                |
| lazy-animation-time     | Animation duration (time in ms)                                                              |
| lazy-animation-delay    | Animation delay (time in ms)                                                                 |
| lazy-animation-pointer  | Wich element will be animated after the  lazy element is load (expl: "#id", ".class", "tag") |
| lazy-animation-function | Animation timing function like css                                                           |
| lazy-animation-count    | Animation repeatition like css (expl: infinite)                                              |

## Video
|  Parameters |                      Usage                      |
|:----------:|:-----------------------------------------------:|
| lazy-video | Put a poster while user dont click on the video |

### Iframe / Embed
|  Parameters  |                      Usage                      |
|:-----------:|:-----------------------------------------------:|
| lazy-embed  | Iframe link                                     |
| lazy-poster | Put a poster while user dont click on the video |

## Methods
---
## window.lazy()
|         Parameters        |                   Usage                  |
|:------------------------:|:----------------------------------------:|
| version                  | Get actual version of lazy-attr          |
| parameters               | Get all possible attributes of lazy-attr |
| animations               | Get all animations                       |


## Animations
---

### How
- [Demo](https://yoannchb-pro.github.io/Lazy-attr/index.html#toanimate)

### Example
```html
<img lazy-src="..." lazy-srcset="..." lazy-animation="corner-top-left">
```

### Animations list
```json
zoomin
zoomout
opacity
slide-left
slide-right
slide-bottom 
slide-top
corner-top-left
corner-top-right
corner-bottom-left
corner-bottom-right
shake
rotate
blur
flip
flip-up
```

### Create your animation
```css
.my-name{
    opacity: 0;
    animation: animation-name 1s forwards;
}

@keyframes animation-name{
    100%{
        opacity: 1;
    }
}
```

### Modify velocity for prebuild animations
- Work on scale and slide animations
- By default it's:
```css
:root{
    --slide-start: 33%;
    --slide-velocity: 7px;

    --scale-velocity: 0.035;
    --scale-start: 0.4;
}
```