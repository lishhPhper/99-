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
      var userInfo = wx.getStorageSync('userInfo')
      obj.setData({
        userInfo: userInfo.user_info,
        token: userInfo.token,
      })
  }
});


