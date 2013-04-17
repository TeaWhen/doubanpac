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
    var status2 = "";
    if (item["item-status"] == "12") {
      status1 = "普通外借";
    } else {
      status1 = "图书借阅";
    }
    if (item["loan-due-date"]) {
      status1 = "已借出";
      status2 = " | " +item["loan-due-date"];
    }

    var status = status1 + status2;
    var book_info_str = item["sub-library"]+"｢"+status+"｣"+item["call-no-1"];
    var send_link = " : <a href=\"#\" class=\"doubanpac-send\" data-title=\"" +
      $('#wrapper h1 span').text() +
      "\" data-content=\"" +
      item["call-no-1"] + " " + item["sub-library"] +
      "\"> ➾</a>";
    $('#webpac-info ul').append("<li style=\"border: none\">" + 
      book_info_str + send_link +
      "</li>");
  }
}  

function make_base_auth(username, password) {  
  return "Basic " +Base64.encode(username + ':' + password);
}  

$('.doubanpac-send').click(function() {

  var post_data = $(this).data();

  
  chrome.extension.sendMessage({method: "getServerInfo"}, function(response) {
    if (response.url){
      var remarqueurl = response.url + "/api/note/";
      var remarqueusername = response.username;
      var remarquepassword = response.password;
      console.log(JSON.stringify(post_data));
      $.ajax({
        url: remarqueurl,
        data: JSON.stringify(post_data),
        type: 'POST',
        contentType: 'text/plain; charset=UTF-8',
        beforeSend : function(req) {  
          req.setRequestHeader('Authorization', make_base_auth(remarqueusername, remarquepassword));  
        }
      });
    } else {
      // notify no settings
    };
  });
  return false;
});

/* http://www.webtoolkit.info/javascript-base64.html */

var Base64 = {
 
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
  // public method for encoding
  encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
 
    input = Base64._utf8_encode(input);
 
    while (i < input.length) {
 
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
 
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
 
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
 
      output = output +
      this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
      this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
    }
 
    return output;
  },
 
  // public method for decoding
  decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
 
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
    while (i < input.length) {
 
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
 
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
 
      output = output + String.fromCharCode(chr1);
 
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
 
    }
 
    output = Base64._utf8_decode(output);
 
    return output;
 
  },
 
  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
 
    for (var n = 0; n < string.length; n++) {
 
      var c = string.charCodeAt(n);
 
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
 
    }
 
    return utftext;
  },
 
  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
 
    while ( i < utftext.length ) {
 
      c = utftext.charCodeAt(i);
 
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
 
    }
 
    return string;
  }
 
}