
$('#rm-item-btn').on('click', function (e) {
    const id = e.target.dataset.id;

    if (!id) {
        return;
    }

    $.ajax({
        method: 'DELETE',
        url: '/item/' + id
    })
    .done(function (data) {
        location.reload();
    });
});
