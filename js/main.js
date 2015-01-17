var gui = require('nw.gui');
var win = gui.Window;

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

          tIndex++;

          console.log('testing ', account, type.next().text());
        }

        if (href.indexOf('http://pay.tianxiafu.cn//Step2Action') !== -1) {
          //
          $(doc).on('ajaxComplete', function(e, xhr, opt) {
            if (opt.url === 'SubmitAction') {
              var res = JSON.parse(xhr.responseText);
              if (0 === res.resultTag) {
                testNext();
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