//index.js
//获取应用实例
const app = getApp()

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
    data: {
      array: ['美国', '中国', '巴西', '日本'],
      index: 0,
      imageIndex:[1],
      user_info:{},
      userToken:'',
      goods_color:[],
      apiUrl: app.globalData.apiUrl,
      show_goods_img:[],
      priceArr:[1]
    },
    onLoad:function(options){
      var that = this
      var user_info = wx.getStorageSync('userInfo')
      var userToken = user_info.token
      that.setData({
        user_info,
        userToken
      })
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    addUpload:function(){
      var that = this
      var imageIndex = that.data.imageIndex
      imageIndex.push(1)
      that.setData({
        imageIndex
      })
    },
    delUpload:function(e){
      var that = this
      var imageIndex = that.data.imageIndex
      var index = e.currentTarget.dataset.index
      var imageIndex = that.data.imageIndex
      imageIndex.splice(index,1)
      that.setData({
        imageIndex
      })
      // 删除图片
      var goods_color = that.data.goods_color
      var show_goods_img = that.data.show_goods_img
      if (typeof (goods_color) != "undefined" && typeof (show_goods_img) != "undefined" && goods_color.length > 0 && show_goods_img.length > 0){
        goods_color.splice(index,1)
        show_goods_img.splice(index, 1)
        that.setData({
          goods_color,
          show_goods_img
        })
      }
    },
    gotoShow: function (e) {
      var that = this
      var goods_color = that.data.goods_color
      var show_goods_img = that.data.show_goods_img
      var index = e.currentTarget.dataset.index
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          // success
          var tempFilePaths = res.tempFilePaths
          //上传
          var userToken = that.data.userToken
          wx.uploadFile({
            url: app.globalData.apiUrl + 'api/v1/image/temporary',
            filePath: res.tempFilePaths[0],
            name: 'img',
            header: {
              'content-type': 'multipart/form-data',
              'userToken': userToken
            }, // 设置请求的 header
            success: function (res) {
              var img_data = JSON.parse(res.data);
              console.log(img_data)
              goods_color[index] = []
              
              if (img_data.state == '1') {
                show_goods_img[index] = app.globalData.apiUrl + img_data.data.img
                goods_color[index]['img'] = img_data.data.img
                that.setData({
                  goods_color,
                  show_goods_img
                })
              }
            }
          })
        },
        fail: function () {
          wx.hideToast();
          wx.showModal({
            title: '错误提示',
            content: '上传图片失败',
            showCancel: false,
            success: function (res) { }
          })
        },
        complete: function () {
        
        }
      })
    },
    listenerButtonPreviewImage:function(e){
      var index = e.target.dataset.index;
      var that = this;
      wx.previewImage({
        current: that.data.show_goods_img[index],
        urls: that.data.show_goods_img,//图片预览list列表
        success: function (res) {
          //console.log(res);
        },
        fail: function () {
          //console.log('fail')
        }
      })
    }
})