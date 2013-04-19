$('#url').val(localStorage['doubanpacURL']);
$('#username').val(localStorage['doubanpacUSERNAME']);
$('#password').val(localStorage['doubanpacPASSWORD']);

$('#save').click(function() {
  localStorage['doubanpacURL'] = $('#url').val()
  localStorage['doubanpacUSERNAME'] = $('#username').val()
  localStorage['doubanpacPASSWORD'] = $('#password').val()
});