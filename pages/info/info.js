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
  }
});


