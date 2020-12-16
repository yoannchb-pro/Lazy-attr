# Lazy-attr
Create lazy image, embed, video and element with animation just with attributes.
You can make animation on element wich are not lazy.
## Important
--------
The project is in beta so don't worry for bugs
## Documentation
--------
```html
<script src="./lazy-attr.js"></script>
<link src="./lazy-attr-animation.css"/>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/lazy-attr@1.0.1/lazy-attr.js"></script>
<link src="https://cdn.jsdelivr.net/npm/lazy-attr@1.0.1/lazy-attr-animation.css"/>
```
- All the documentation:
- https://yoannchb-pro.github.io/Lazy-attr/index.html

## Github and NPM
--------
- Here is the github
- https://github.com/yoannchb-pro/Lazy-attr
- Here is the npm:
- https://www.npmjs.com/package/lazy-attr
## Very short example
--------
```html
<iframe width="560" height="315" lazy-embed="https://www.youtube.com/embed/Y8Wp3dafaMQ?autoplay=1" lazy-poster="https://img.youtube.com/vi/Y8Wp3dafaMQ/hqdefault.jpg"></iframe>

<img lazy-animation-delay="1.2" class="scale05" alt="Random image" lazy-src="https://picsum.photos/300/300?random=8" lazy-animation="zoomin-animation" lazy-reset/>
```