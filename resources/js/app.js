
// main
function main() {
    console.log('Loaded...');
    
    var table = new Table();
    document.body.appendChild(table.table);
}

document.body.onload = function() {
    loadJson('config.json', main);
}

