# 📖 Lazy-attr v1.1.8

[![npm](https://img.shields.io/badge/npm-download-green)](https://www.npmjs.com/package/lazy-attr) [![Download](https://img.shields.io/badge/github-download-gree)](https://github.com/yoannchb-pro/Lazy-attr)

Create lazy image, iframe, video... Make custom animation on lazy and not lazy element on all browser. You can also use our animations included in the lib ([Demo](https://yoannchb-pro.github.io/Lazy-attr/index.html#toanimate)). All of that just with html attributes.

## Example
---

```html
<img lazy-src="https://picsum.photos/300/300?random=1" lazy-srcset="https://picsum.photos/300/300?random=2 900w" lazy-animation="corner-top-left-animation" lazy-reset>
```

## 🎉 Update
---

- BUGS correction
- Skeleton class added `lazy-skeleton`, `lazy-skeleton-corner` and `lazy-skeleton-top`
- `lazy-background` added to make lazy background

## 📚 Documentation & Demo
---

- [Github website documentation and demo](https://yoannchb-pro.github.io/Lazy-attr/index.html)

## 💻 Import
---

- You just need to import the css file and the js file
- In browser put it in the \<head>
- In vue.js you can put it in the public.html file
- formats : `lazy-attr.min.js`, `lazy-attr.esm.min.js` and `lazy-attr.cjs.min.js`
### CDN
```html
<script src="https://unpkg.com/lazy-attr@1.1.8/dist/lazy-attr.min.js" type="text/javascript"></script>
<link href="https://unpkg.com/lazy-attr@1.1.8/dist/lazy-attr-animation.min.css" rel="stylesheet"/>
```

### From download
```html
<script src="./dist/lazy-attr.min.js" type="text/javascript" async></script>
<link href="./dist/lazy-attr-animation.min.css" rel="stylesheet"/>
```

## Class
---

- You can set a class `lazyattr` wich be transform in `lazyloaded` after the element is loaded (work on the pointer and parent)
- You can make a beatiful skeleton loader with `lazy-skeleton`, `lazy-skeleton-corner` and `lazy-skeleton-top` class

## Attributes
---

## Image, iframe and video
|        Parameters        |                                             Usage                                            |
|:-----------------------:|:--------------------------------------------------------------------------------------------:|
| lazy-reset              | Reset the animation on scroll                                                                |
| lazy-srcset             | Same as srcset attribute                                                                     |
| lazy-src                | Image soucre \| iframe source \| video source                                                |
| lazy-background         | Image source to make a lazy background image                                                 |
| lazy-size-width         | Minimum width size                                                                           |
| lazy-size-height        | Minimum height size                                                                          |
| lazy-callback           | Function name lauched after full load of element                                             |
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
| animations               | Get all animation prefix                 |
| getLastVersion(callback) | Get lastversion of lazy-attr             |

## Animations
---

### How
- To make an animation you need to use lazy-animation
- form: prefix-animation
- [Demo](https://yoannchb-pro.github.io/Lazy-attr/index.html#toanimate)

### Example
```html
<img lazy-src="..." lazy-srcset="..." lazy-animation="corner-top-left-animation">
```

### Prefix animations list
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