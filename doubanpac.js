var find_xml = new JKL.ParseXML( "http://webpac.zju.edu.cn/X?op=find&base=zju01&code=wrd&request=9787111362463" );
var find_data = find_xml.parse();
if (find_data.find.no_records > 0) {
  console.log(find_data.find.set_number)
  var book_xml = new JKL.ParseXML( "http://webpac.zju.edu.cn/X?op=present&set_no="+find_data.find.set_number+"&set-entry=1" );
  var book_data = book_xml.parse();
  var pac_xml = new JKL.ParseXML( "http://webpac.zju.edu.cn/X?op=item-data&base=zju01&doc_number="+book_data.present.record.doc_number )
  var pac_data = pac_xml.parse();
  for (n in pac_data["item-data"].item) {
    $('#borrowinfo ul').append("<li style=\"border: none\">"+pac_data["item-data"].item[n]["sub-library"]+"</li>");
  }
}
