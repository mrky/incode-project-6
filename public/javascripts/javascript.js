function getwords() {
    text = words.value;
    document.getElementById('para').innerHTML += '<p>' + text;
    document.getElementById('words').value = 'enter';
    document.getElementById('words').reset();
}

$(function () {
    $('.like, .dislike').on('click', function () {
        event.preventDefault();
        $('.like, .dislike').removeClass('active');
        $(this).addClass('active');
    });

    var howMany = 1;

    $('#more').click(function () {
        howMany += 1;
        $('#info').text(howMany);
    });
    $('#less').click(function () {
        howMany -= 1;
        $('#info').text(howMany);
    });
});
