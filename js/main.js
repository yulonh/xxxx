var gui = require('nw.gui');
var win = gui.Window;
var tesseract = require('./Tesseract-OCR/tesseract.js');

~ function(win) {
  var accounts = null;
  var aIndex = 0,
    tIndex = 0;

  var iPay = {
    init: function() {
      $('#start').on('click', $.proxy(function(e) {
        e.preventDefault();
        iPay.start();
      }, this));
    },
    openIndexWindow: function() {
      var indexWin = win.open('http://pay.tianxiafu.cn/435_km_0.html?modelIds2=1&come=zhaoka_ydyy', {
        position: 'center',
        width: 630,
        height: 550,
        focus: true
      });

      indexWin.on('loaded', $.proxy(function() {
        var W = indexWin.window;
        var href = W.location.href;
        var doc = W.document;
        var $ = W.$;
        //
        var phoneNode, nextBtn, types,
          account = accounts[aIndex],
          aLength = accounts.length,
          tLength = 0;
        var img = doc.getElementById('imgCode');

        function testNext() {
          if (aIndex === aLength) {
            console.log('all test complete');
            return;
          }

          if (tIndex >= tLength) {
            tIndex = 0;
            aIndex++;
            account = accounts[aIndex];
          }

          var type = types.eq(tIndex);
          type.trigger('click');
          phoneNode.val(account);
          W.setTimeout(function() {
            nextBtn.trigger('click');
          }, 100);

          console.log('testing ', aIndex, '/', aLength, account, type.next().text());
          tIndex++;
        }

        function image2base64(img) {
          var canvas = doc.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL();
        }

        function getRandCode() {
          var base64 = image2base64(img);
          tesseract.getTextFromBase64(base64, function() {
            Zepto.get('./out.txt', function(res) {
              res = res.replace(/[^\d]/g, '');
              if (res.length !== 4) {
                img.src = '/ImageCodeNew?date=' + new Date().getTime();
                return;
              }
              $('#rand').val(res);
              $('#btnProdOk').trigger('click');
            });
          });
        }

        if (href.indexOf('http://pay.tianxiafu.cn/435_km_0.html') !== -1) {
          img.onload = getRandCode;
          getRandCode();

          $(doc).on('ajaxComplete', function(e, xhr, opt) {
            if (opt.url.indexOf('RandValidateAction') !== -1) {
              var res = JSON.parse(xhr.responseText);
              if (res == 0) {
                img.src = '/ImageCodeNew?date=' + new Date().getTime();
              }
            }
          });
        }

        if (href.indexOf('http://pay.tianxiafu.cn//Step2Action') !== -1) {
          //
          $(doc).on('ajaxComplete', function(e, xhr, opt) {
            if (opt.url === 'SubmitAction') {
              var res = JSON.parse(xhr.responseText);
              if (0 === res.resultTag) {
                testNext();
              } else {
                tIndex = 0;
              }
            }
          });
          //
          setTimeout(function() {
            phoneNode = $('#con3phone1');
            nextBtn = $('#ydsjbtnCon3FormSubmit');
            types = $('#ydsj_yzm_cashTab :radio');
            tLength = types.length;
            testNext();
          }, 1000);
        }

        if (href.indexOf('/Step3Action') !== -1) {
          console.log('Step3Action', aIndex, aLength);
          aIndex++;
          if (aIndex < aLength) {
            this.openIndexWindow();
          } else {
            console.log('all test complete');
          }
        }
      }, this));
    },
    start: function() {
      accounts = $('#accounts').val().trim();
      if (accounts) {
        accounts = accounts.trim().split(/[^\d]+/);
        console.log('accounts :', accounts);
      } else {
        alert('必须先输入账号!');
        return;
      }
      this.openIndexWindow();
    }
  };

  iPay.init();
}(win);