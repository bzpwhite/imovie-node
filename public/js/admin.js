$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-'+id);
        $.ajax({
            type:'DELETE',
            url:'/admin/list?id='+id
        }).done(function (results) {
                if(results.success === 1){
                    if(tr.length > 0){
                        tr.remove();
                    }
                }
            })
    })
    $('#douban').blur(function () {
        var id = $(this).val();
        console.log('ddddd')
        if(id){
            $.ajax({
                url:'https://api.douban.com/v2/movie/subject/'+id,
                cache:true,
                type:'get',
                dataType:'jsonp'
            }).done(function (data) {
                $('#inputTitle').val(data.title);
                $('#inputDoctor').val(data.directors[0].name);
                $('#inputCountry').val(data.countries[0]);
                $('#inputPoster').val(data.images.small);
                $('#inputYear').val(data.year);
                $('#inputSummary').val(data.summary);
            })
        }
    })
})