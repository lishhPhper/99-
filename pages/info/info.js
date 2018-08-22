//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');


Page({
  data: {
    userInfo:{}
  },
  onLoad:function(){
      var obj = this;
      wx.getStorage({
          key: 'userInfo',
          success: function(res) {
              obj.setData({
                  userInfo: res.data.user_info,
                  token: res.data.token,
              })
          },
      })
      var article = '<font color="#92d050">这是一段测试文字</font><font color="#ff0000">没空看扩扩扩扩扩扩扩扩</font>';
      WxParse.wxParse('article', 'html', article, obj, 5);
  }
});


