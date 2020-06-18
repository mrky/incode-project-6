function callDisplayLocations() {        
    aListLocations = ['/locations/display', (document.getElementById('search').value == '' ? 'all' : document.getElementById('search').value)]       
    urlListLocations = "window.location.href=href=" + "'"+aListLocations.join('/')+"'"
    document.getElementById("btnFilter").setAttribute('onclick', urlListLocations) //"window.location.href=href='/locations/Australia';"
}