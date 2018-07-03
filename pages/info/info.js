//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:{}
  },
  onLoad:function(){
      wx.getStorage({
          key: 'userInfo',
          success: function(res) {
              var jsObject = JSON.parse(res); //转换为json对象
              this.setData({
                  userInfo: jsObject,
              })
          },
      })
  }
});


