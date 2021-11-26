/**
 * Object.entries polyfill
 */
export default function setObjectEntries(){
    if(!Object.entries){
        Object.entries = (obj) => Object.keys(obj).map(key => {
            return [key, obj[key]];
        });
    }
}