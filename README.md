# 📖 Lazy-attr v1.1.7

Create lazy image, iframe, video... Make custom animation on lazy and not lazy element on all browser. You can also use our animations included in the lib ([Demo](https://yoannchb-pro.github.io/Lazy-attr/index.html#toanimate)). All of that just with html attributes.

## Example
---

```html
<img lazy-src="https://picsum.photos/300/300?random=1" lazy-srcset="https://picsum.photos/300/300?random=2 900w" lazy-animation="corner-top-left-animation" lazy-reset>
```

## 🎉 Update
---

- BUGS correction from last update

## 🐱 Github and NPM
---

- [GITHUB](https://github.com/yoannchb-pro/Lazy-attr)
- [NPM](https://www.npmjs.com/package/lazy-attr)

## 📚 Documentation & Demo
---

- [Website](https://yoannchb-pro.github.io/Lazy-attr/index.html)

## 💻 Import
---

- You just need to import the css file and the js file
- In browser put it in the \<head>
- In vue.js you can put it in the public.html file
- formats : `lazy-attr.min.js`, `lazy-attr.esm.min.js` and `lazy-attr.cjs.min.js`
### CDN
```html
<script src="https://unpkg.com/lazy-attr@1.1.7/dist/lazy-attr.min.js" type="text/javascript"></script>
<link href="https://unpkg.com/lazy-attr@1.1.7/dist/lazy-attr-animation.min.css" rel="stylesheet"/>
```

### From download
```html
<script src="./dist/lazy-attr.min.js" type="text/javascript" async></script>
<link href="./dist/lazy-attr-animation.min.css" rel="stylesheet"/>
```

## Class
---

- You can set a class `lazyattr` wich be transform in `lazyloaded` after the element is loaded (work on the pointer and parent)

## Attributes
---

### Image, iframe and video
- Reset the animation each time the element match the screen
```json
lazy-reset
```
- source set
```json
lazy-srcset="same as srcset attribute"
lazy-src="img src | video src | iframe src"
```
- define size (you set a default size with the class `lazyattr` wich will be transform into `lazyloaded`)
```json
lazy-size-width="min width size"
lazy-size-height="min height size"
```
- callback function
```json
lazy-callback="function after the lazy is loaded"
```
- animations
```json
lazy-animation="animation name"
lazy-animation-time="animation duration / time in ms"
lazy-animation-delay="animation delay / time in ms"
lazy-animation-pointer="animation pointer / class | id | ..."
lazy-animation-function="animation timing function / exp: linear"
lazy-animation-count="animation repeatition / exp: infinite"
```

### Video
- Put a poster on a video
```json
lazy-video="put a poster while the user dont click on the video / link of the poster image"
```

### Iframe / Embed
- Load iframe and put poster
```json
lazy-embed="link of the iframe"
lazy-poster="put a poster while the user dont click on the video / link of the poster image"
```

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