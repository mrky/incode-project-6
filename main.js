function callDisplayLocations() {        
    aListLocations = ['/locations/display', (document.getElementById('search').value == '' ? 'all' : document.getElementById('search').value)]       
    urlListLocations = "window.location.href=href=" + "'"+aListLocations.join('/')+"'"
    document.getElementById("btnFilter").setAttribute('onclick', urlListLocations) //"window.location.href=href='/locations/Australia';"
}


function validateLocation(id) {   
    aValidate = ['validate', 
              id,
              $("#"+id).attr('name')]
    urlValidate = aValidate.join('/') 
              
    $.ajax({
        url: urlValidate,
        type: 'POST',
        success: (data) => {  
            validate = (data == 'true') 
            
            $("#"+id).attr('name', !(validate))
            if (validate) {
                document.getElementById(id).innerHTML='Invalidate'
            } else {
                document.getElementById(id).innerHTML='Validate'
            }
            alert('Nova location foi atribuida '+document.getElementById(name).innerHTML)
        }     
    })   
}
