# 📖 Lazy-attr v1.1.6

Create lazy image, iframe, video... Make custom animation on lazy and not lazy element on all browser. You can also use our animations included in the lib ([Demo](https://yoannchb-pro.github.io/Lazy-attr/index.html#toanimate)). All of that just with html attributes.

## 🎉 Update
---

- No more in beta
- Changelog added
- BUGS corrections
- Build with rollup and babel
- IE correction
- added `lazy-size` to define a default size for a lazy element
- added a class to make a custom element (`lazyattr` and `lazyattr-loaded`)

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
<script src="https://unpkg.com/lazy-attr@1.1.6/dist/lazy-attr.min.js" type="text/javascript" async></script>
<link href="https://unpkg.com/lazy-attr@1.1.6/dist/lazy-attr-animation.min.css" rel="stylesheet"/>
```

### From download
```html
<script src="./dist/lazy-attr.min.js" type="text/javascript" async></script>
<link href="./dist/lazy-attr-animation.min.css" rel="stylesheet"/>
```

## Attributes
---
- You can set a class lazyattr wich be transform in lazyloaded after the element is loaded (work on the pointer and parent)
### Image, iframe and video

```json
//Reset the animation each time the element match the screen
lazy-reset

//Src
lazy-srcset=""
lazy-src="img src | video src | iframe src"

//Size
lazy-size-width="default width size"
lazy-size-height="default height size"

//Callback function
lazy-callback="function after the lazy is loaded"

//Animations
lazy-animation="animation name"
lazy-animation-time="animation duration / time in ms"
lazy-animation-delay="animation delay / time in ms"
lazy-animation-pointer="animation pointer / class | id | ..."
lazy-animation-function="animation timing function / exp: linear"
lazy-animation-count="animation repeatition / exp: infinite"
```

### Video
```json
lazy-video="put a poster while the user dont click on the video / link of the poster image"
```

### Iframe / Embed
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