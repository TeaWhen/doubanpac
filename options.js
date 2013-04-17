$('#url').attr({value: localStorage['doubanpacURL']});
$('#username').attr({value: localStorage['doubanpacUSERNAME']});
$('#password').attr({value: localStorage['doubanpacPASSWORD']});

$('#save').click(function() {
  localStorage['doubanpacURL'] = $('#url').val()
  localStorage['doubanpacUSERNAME'] = $('#username').val()
  localStorage['doubanpacPASSWORD'] = $('#password').val()
});