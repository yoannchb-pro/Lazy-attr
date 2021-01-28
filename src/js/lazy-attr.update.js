export default function getUpdateLazyAttr(callback){
    window.addEventListener('load', function(){
        window.lazy().getLastVersion(function(v){
            if(v.error){
                callback({error: true, content: "Error while fetching"});
            } else {
                callback({error: false, content: v.version});
            }
        });
    });
}