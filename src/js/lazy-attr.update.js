export default function getUpdateLazyAttr(callback){

    let req = new XMLHttpRequest();

    //Ok
    req.onload = function(){
        const res = req.responseText;

        const p = '[#version]';
        let nv = res.substring(res.indexOf(p)+p.length);
        nv = nv.substring(nv.indexOf(p)+p.length);
        nv = nv.substring(0, nv.indexOf(p));
        callback({error: false, version: nv});
    }

    //Error
    req.onerror = function(){
        callback({error: true, content: "Error while fetching"});
    }

    req.open('GET', window.lazyDatas["updateURL"]);
    req.send();

}