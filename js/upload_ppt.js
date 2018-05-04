
$('#upload-input').on('change', function(){
  var files = $(this).get(0).files;
  if (files.length > 0){
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append('uploads[]', file, file.name);
    }

    console.log('ajax upload start');
    $.ajax({
      url: '/upload_ppt?token='+login_token,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          // console.log('upload successful!\n' + data);
          alert(data);
          $('#upload-input').val('');
      }
    });
  }
});