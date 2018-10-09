//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        toView: 'red',
        scrollTop: 100,
        status: 2,
        userToken: '',
        address: '',
        wx: '',
        phone: '',
        shop_name: '',
        shop_img: '',
        img_url: '',
        defaultImg: '/image/jiaju01.jpg',
        user_info: {},
        imageText: {},
        music_url: app.globalData.music_url,
        pop:0,
    },
    onShow: function(options) {
      console.log(options)
      var that = this;
      wx.getStorage({
          key: 'userInfo',
          success: function(res) {
              var userToken = res.data.token
              var user_info = res.data;
              var store_type = res.data.user_info.type
              // 重新渲染路径
              switch (store_type) {
                  case 1:
                    that.setData({
                      level: 1
                    });
                    return false;
                    break;
                  case 2:
                    that.setData({
                      level: 2
                    });
                    break;
                  case 3:
                      // 普通用户 显示去创建
                      that.setData({
                        level:3
                      });
                      return false;
                      break;
              }
              var img_url = app.globalData.apiUrl
              that.setData({
                  userToken,
                  user_info,
                  img_url
              });
              // 地址、微信、电话
              wx.request({
                  url: app.globalData.apiUrl + 'api/v1/shop/info',
                  header: {
                      'content-type': 'application/json',
                      'userToken': userToken
                  },
                  method: 'Get',
                  success: function(res) {
                      if (res.statusCode == 200) {
                          var address = '';
                          var wx = '';
                          var shop_wx = res.data.shop_wx;
                          var wx_code = res.data.wx_code;
                          if (res.data.province == res.data.city) {
                              address = res.data.province + res.data.district + res.data.town + res.data.address;
                          } else {
                              address = res.data.province + res.data.city + res.data.district + res.data.town + res.data.address;
                          }
                          if (shop_wx != '') {
                              wx = shop_wx;
                          }
                          var shop_name = res.data.shop_name;
                          var pop = res.data.pop_value;
                          var shop_img = app.globalData.apiUrl + res.data.shop_img;
                          that.setData({
                            address,
                            wx,
                            shop_name,
                            shop_img,
                            pop
                          })
                      }
                  }
              })
              // 图文列表
              wx.request({
                  url: app.globalData.apiUrl + 'api/v1/homeContent/getHomeContent',
                  header: {
                      'content-type': 'application/json',
                      'userToken': userToken
                  },
                  method: 'GET',
                  success: function(res) {
                      if (res.data.state == 1) {
                          console.log(res.data.data);
                          if (app.globalData._music != '') {
                              app.globalData._music.destroy();
                          }
                          app.globalData._music = wx.createInnerAudioContext();
                          app.globalData._music.autoplay = true;
                          app.globalData._music.loop = true;
                          app.globalData._music.src = that.data.music_url+res.data.data.music;
                          app.globalData._music.onPlay(() => {
                              console.log('开始播放');
                          })
                          app.globalData._music.onError((res) => {
                              console.log(res.errMsg)
                              console.log(res.errCode)
                          })

                          var items = res.data.data.items;
                          if (items.length > 0) {
                              for (var i = 0; i < items.length; i++) {
                                  WxParse.wxParse('format_text', 'html', items[i]['text'], that, 5);
                                  items[i]['format_text'] = that.data.format_text;
                              }
                              res.data.data.items = items;
                          }
                          var imageText = res.data.data
                          that.setData({
                              imageText
                          })
                      }
                  }
              })
          }
      })
    },
    entityStore: function(e) {
        this.setData({

        })
    },
    imgError: function(e) {
        var that = this;
        that.setData({
            shop_img: that.data.defaultImg
        })
    },
    showStoreContact: function(e) {
        var that = this;
        var show_type = e.currentTarget.dataset.type
        if (show_type == 1) {
            var title = "微信"
            var content = that.data.wx
            
          } else {
            var title = "联系方式"
            var phone = that.data.user_info.user_info.phone
            var content = "拨打" + phone + "?"
            
        }
        wx.showModal({
          title: title,
          content: content,
          success: function (res) {
            if (res.confirm) {
              if (show_type == 2){
                wx.makePhoneCall({
                  phoneNumber: content,
                  success: function () {

                  },
                  fail: function () {

                  }
                })
              }
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        
    },
    playVoice: function (event) {
        if (event.currentTarget.dataset.voiceResource != '') {
            if (app.globalData._music != '') {
                app.globalData._music.destroy();
            }
            app.globalData._music = wx.createInnerAudioContext();
            app.globalData._music.autoplay = true;
            app.globalData._music.loop = true;
            app.globalData._music.src = event.currentTarget.dataset.voiceResource
            app.globalData._music.onPlay(() => {
                console.log('开始播放');
            })
            app.globalData._music.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
            })
        }
    }
});