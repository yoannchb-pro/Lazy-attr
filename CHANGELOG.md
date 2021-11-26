# Changelog

## 1.2.1
- Bugs corrections
- Improvement
- No more lazy-callback (now it will dispatch an event named `lazy-loaded` and `lazy-quit`)
- Added lazy-observe (Do not do anything just observe the element to do lazy request for example)

## 1.2.0
- No more .min.js or .min.css
- No more prefix `-animation` after the animation name
- Improvement for animations and lazy-attr
- Node module added

## 1.1.9
- BUGS correction
- Better animations
- `lazy-animation-pointer` can now delete the skeleton animation of an element

## 1.1.8
- BUGS correction
- Skeleton class added `lazy-skeleton`, `lazy-skeleton-corner` and `lazy-skeleton-top`
- `lazy-background` added to make lazy background

## 1.1.7
- BUGS correction from last version

## 1.1.6
- No more in beta
- Build with rollup and babel
- BUGS corrections
- IE correction
- added `lazy-size` to define a default size for a lazy element
- added a class to make a custom element (`lazyattr` and `lazyattr-loaded`)