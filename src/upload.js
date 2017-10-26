function upLoad(opts) {
    var dataImg = new FormData(),res = {};
    dataImg.append("file", opts.fileData);
    $.ajax({
        type: "post",
        data: dataImg,
        dataType: 'json',
        url: opts.url,
        processData: false,
        contentType: false,
        async: false,
        beforeSend: function(XMLHttpRequest) {

        },
        success: function(result) {
            res = result;
        },
        complete: function(XMLHttpRequest, textStatus) {

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    return res;
}