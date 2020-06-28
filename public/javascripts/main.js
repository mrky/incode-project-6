function callDisplayLocations() {
    aListLocations = [
        '/locations/display',
        document.getElementById('search').value == ''
            ? 'all'
            : document.getElementById('search').value,
    ];
    urlListLocations =
        'window.location.href=href=' + "'" + aListLocations.join('/') + "'";
    document
        .getElementById('btnFilter')
        .setAttribute('onclick', urlListLocations); //"window.location.href=href='/locations/Australia';"
}

function validateLocation(id) {
    aValidate = ['validate', id, $('#' + id).attr('name')];
    urlValidate = aValidate.join('/');

    $.ajax({
        url: urlValidate,
        type: 'POST',
        success: (data) => {
            validate = data == 'true';

            $('#' + id).attr('name', !validate);
            if (validate) {
                document.getElementById(id).innerHTML = 'Invalidate';
            } else {
                document.getElementById(id).innerHTML = 'Validate';
            }
            alert(
                'Nova location foi atribuida ' +
                    document.getElementById(name).innerHTML
            );
        },
    });
}

$(document).ready(() => {
    $('.recommend-location').each(function () {
        let recommendation = $(this).attr('id');
        $(`#${recommendation}`).click(function () {
            let locationId = $(this).attr('data-id');
            $.ajax({
                url: '/locations/recommend/id-' + locationId,
                type: 'POST',
                data: {
                    recommendation,
                },
                success: (data) => {
                    console.log('success', data);
                    let x = JSON.stringify(data);
                    if (data.error !== undefined) {
                        $('#recommendation').text(data.error);
                    } else {
                        $('#recommendation').text(x);
                    }

                    if (data.success !== undefined) {
                        $('#recommendation').text(data.success);
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
        });
    });
});
