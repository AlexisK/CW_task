
// wrapper
function def(val) { return typeof(val) != 'undefined' && val !== null; }

function cr(tag, cls, parent) {
    if ( !tag ) { return null; }
    var newNode = document.createElement(tag);
    
    if ( def(cls) ) { newNode.className = cls; }
    if ( def(parent) ) { parent.appendChild(newNode); }
    
    return newNode;
}
Node.prototype.cr = function(tag, cls) { return cr(tag, cls, this); }


function loadJson(path, todo) {
    var newNode = cr('script');// loading json with 'script' tag in order to work directly from fs
    newNode.onload = todo;
    newNode.src = path;
    document.body.appendChild(newNode);
}

Array.prototype.add = function(val) {
    var ind = this.indexOf(val);
    
    if ( ind == -1 ) {
        this.push(val);
        return this.length;
    }
    return false;
}

Array.prototype.remove = function(val) {
    var ind = this.indexOf(val);
    
    if( ind != -1 ) {
        this.splice(ind, 1);
        return this.length;
    }
    
    return false;
}


// iterators
window.iter = {
    num:0,
    lit:-1
}
function iterToStr(n) {
    var result = [String.fromCharCode(65+n%26)];
    n = Math.floor(n/26);
    for ( ;n > 0; ) {
        result.splice(0,0,String.fromCharCode(64+n%26));
        n = Math.floor(n/26);
    }
    return result.join('');
}
function getIterNum() { return iter.num += 1; }
function getIterLit() { return iterToStr(iter.lit += 1); }

