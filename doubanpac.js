var book_isbn = /ISBN: (\d+)/.exec($("#info").text())[1];
console.log("Book ISBN is "+ book_isbn);

var find_xml = new JKL.ParseXML( "http://webpac.zju.edu.cn/X?op=find&base=zju01&code=wrd&request=" + book_isbn );
var find_data = find_xml.parse();

if (find_data.find.no_records > 0) {
  var book_xml = new JKL.ParseXML( "http://webpac.zju.edu.cn/X?op=present&set_no="+find_data.find.set_number+"&set-entry=1" );
  var book_data = book_xml.parse();

  var pac_xml = new JKL.ParseXML( "http://webpac.zju.edu.cn/X?op=item-data&base=zju01&doc_number="+book_data.present.record.doc_number )
  var pac_data = pac_xml.parse();
  console.log("doc_number in webpac is " + book_data.present.record.doc_number);

  var webpac_info = $('<div class="gray_ad" id="webpac-info"><h2>浙大图书馆信息</h2><ul class="bs noline more-after"></ul></div>');
  $('.gray_ad').first().before(webpac_info);

  for (n in pac_data["item-data"].item) {
    var item = pac_data["item-data"].item[n];
    var status1 = "";
    var status2 = "在架上";
    if (item["item-status"] == "12") {
      status1 = "普通外借";
    } else {
      status1 = "图书借阅";
    }
    if (item["loan-due-date"]) {
      status1 = "已借出";
      status2 = item["loan-due-date"];
    }

    var status = status1 + " | " + status2;
    $('#webpac-info ul').append("<li style=\"border: none\">" + 
      item["sub-library"] + 
      " ( " +
      status +
      ") " +
      item["call-no-1"] +
      "</li>");
  }  
}
