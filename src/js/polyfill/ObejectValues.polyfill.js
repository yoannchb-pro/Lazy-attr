/**
 * Object.values polyfill
 */
export default function setObjectValues(){
    if(!Object.values){
        Object.values = (obj) => Object.keys(obj).map(e => obj[e]);
    }
}