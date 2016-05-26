

window.cell = {}
window.currentcell = null;

// classes
window.Cell = (function(){
    
    function createCell(scope) {
        scope.dependants = [];
        scope.links = [];
        scope.dom = cr('td');
        scope.input = scope.dom.cr('input','hidden');
        scope.view = scope.dom.cr('div');
        
        scope.view.addEventListener('mousedown', function(ev) {
            if ( def(window.currentcell) ) {
                ev.preventDefault();
            }
        });
        scope.view.addEventListener('click', function(ev) {
            if ( def(window.currentcell) ) {
                ev.preventDefault();
                window.currentcell.input.value += scope.address[1]+scope.address[0];
            } else {
                scope.input.classList.remove('hidden');
                scope.input.focus();
                window.currentcell = scope;
            }
        }, true);
        
        scope.input.onkeyup = function(ev) {
            if ( ev.keyCode == 13 ) { this.blur(); }
        }
        
        scope.input.onblur = function() {
            scope.input.classList.add('hidden');
            scope.valueToView(true);
            window.currentcell = null;
        }
    }
    
    function valueToView() {
        var scope = this;
        
        // console.log('unlinking', scope.links.toString());
        for ( var i = 0; i < scope.links.length; i++ ) {
            var a = scope.links[i];
            cell[a[0]][a[1]].dependants.remove(scope.address);
        }
        
        scope.links = [];
        
        var val = scope.input.value || '';
        if(val[0] == '=') {
            val = val.slice(1);
            
            val = val.replace(/([a-zA-Z]+\d+)/g, function(t, key) {
                var ind = key.indexOf(/\d/);
                var cellAddress = [key.slice(ind),key.slice(0,ind).toUpperCase()];
                scope.links.add(cellAddress);
                var nval = cell[cellAddress[0]][cellAddress[1]].view.textContent;
                return nval;
            });
            
            for ( var i = 0; i < scope.links.length; i++ ) {
                var a = scope.links[i];
                cell[a[0]][a[1]].dependants.push(scope.address);
            }
            // console.log('new deps', scope.links.toString());
                
            try {
                val = math.eval(val);
            } catch(err) {
                val = '!EXPR';
            }
        }
        
        this.view.textContent = val;
        
        for ( var i = 0; i < scope.dependants.length; i++ ) {
            var a = scope.dependants[i];
            cell[a[0]][a[1]].autofetch();
        }
        
    }
    
    function autofetch() {
        var val = this.input.value || '';
        if(val[0] == '=') {
            val = val.slice(1);
            
            val = val.replace(/([a-zA-Z]+\d+)/g, function(t, key) {
                var ind = key.indexOf(/\d/);
                var cellAddress = [key.slice(ind),key.slice(0,ind).toUpperCase()];
                var nval = cell[cellAddress[0]][cellAddress[1]].view.textContent;
                return nval;
            });
            try {
                val = math.eval(val);
            } catch(err) {
                val = '!EXPR';
            }
        }
        this.view.textContent = val;
        
        for ( var i = 0; i < this.dependants.length; i++ ) {
            var a = this.dependants[i];
            cell[a[0]][a[1]].autofetch();
        }
        
    }
    
    return function() {
        createCell(this);
        this.valueToView = valueToView;
        this.autofetch = autofetch;
    }
})();


window.Table = (function(){
    
    function createRow(scope, parent, index) {
        var tr = parent.cr('tr');
        tr.cols = [];
        window.cell[index] = {};
        
        var heading = tr.cr('td','heading');
        tr.heading = heading;
        
        for( var i = 0; i < config.table.cols; i++) {
            var c = new Cell();
            tr.appendChild(c.dom);
            tr.cols.push(c.dom);
            c.address = [index,scope.liters[i]];
            window.cell[index][scope.liters[i]] = c;
        }
        
        return tr;
    }
    
    function createTable(scope) {
        scope.table = cr('table');
        scope.thead = scope.table.cr('thead');
        scope.tbody = scope.table.cr('tbody');
        scope.liters = [];
        
        var hrow = createRow(scope, scope.thead);
        for( var i = 0; i < config.table.cols; i++) {
            var lit = getIterLit();
            scope.liters.push(lit);
            hrow.cols[i].textContent = lit;
        }
        
        for( var i = 0; i < config.table.rows; i++) {
            var ind = getIterNum();
            var tr = createRow(scope, scope.tbody, ind);
            tr.heading.textContent = ind;
        }
    }
    
    return function() {
        createTable(this);
    }
})();


