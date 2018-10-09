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
    defaultImg: '/image/jiaju01.jpg',
    user_info: {},
    imageText: {},
    music_url: app.globalData.music_url,
    addrees:'',
    pop:0,
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    var userToken = userInfo.token
    var store_type = options.store_type
    var id = options.id
    var img_url = app.globalData.apiUrl

    // 地址、微信、电话
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/store/info?id=' + id + '&store_type=' + store_type,
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      method: 'Get',
      success: function (res) {
        console.log(res.data);
        if (res.data.state == 1) {
          var shop = res.data.data.shop
          var factory = res.data.data.factory
          var address = that.data.address
          if (shop.province == shop.city) {
            address = shop.province + shop.district + shop.town + shop.address;
          } else {
            address = shop.province + shop.city + shop.district + shop.town + shop.address;
          }
          var pop = shop.pop_value
          that.setData({
            shop,
            factory,
            img_url,
            address,
            pop
          })
        }
      }
    })

    // 图文列表
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/homeContent/getStoreHomeContent?id=' + id + '&store_type=' + store_type,
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      method: 'GET',
      success: function (res) {
        if (res.data.state == 1) {
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
  },
  entityStore: function (e) {
    this.setData({

    })
  },
  imgError: function (e) {
    var that = this;
    that.setData({
      shop_img: that.data.defaultImg
    })
  },
  showStoreContact: function (e) {
    var that = this;
    var show_type = e.currentTarget.dataset.type
    if (show_type == 1) {
      var title = "微信"
      var content = that.data.shop.shop_wx
    } else {
      var title = "联系方式"
      var content = that.data.shop.shop_phone
    }
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          if (show_type == 2) {
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