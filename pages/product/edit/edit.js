//index.js
//获取应用实例
const app = getApp()

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
    data: {
      imageArr:[1],
      user_info:{},
      userToken:'',
      goods_color:[],
      apiUrl: app.globalData.apiUrl,
      show_goods_img:[],
      priceArr:[1],
      priceIndex:0,
      ratio:1.3,
      ratioArr:[],
      specArr:[1],
      specIndex:0,
      sizeArr:[1],
      sizeIndex:0,
      obj_group_classify:[],
      group_classify:[],
      group_index:0,
    },
    onLoad:function(options){
      var that = this
      var user_info = wx.getStorageSync('userInfo')
      var userToken = user_info.token
      that.setData({
        user_info,
        userToken
      })

      // 获取零售价比例
      wx.request({
        url: app.globalData.apiUrl + 'api/v1/goodsRetailPrice/index',
        header: {
          'content-type': 'application/json',
          'userToken': userToken
        },
        method: 'Get',
        success: function (res) {
          console.log(res.data.data)
          if (res.data.state == 1) {
            var ratio = res.data.data.ratio
            that.setData({
              ratio
            })
          }
        }
      })

      // 获取产品分类
      wx.request({
        url: app.globalData.apiUrl + 'api/v1/group_classify/second',
        header: {
          'content-type': 'application/json',
          'userToken': userToken
        },
        method: 'Get',
        success: function (res) {
          if(res.data.state == 1){
            var group_classify = res.data.data.arr;
            var obj_group_classify = res.data.data.obj
            that.setData({
              group_classify,
              obj_group_classify
            })
          }
        }
      })
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          group_index: e.detail.value
        })
    },
    addUpload:function(){
      var that = this
      var imageArr = that.data.imageArr
      imageArr.push(1)
      that.setData({
        imageArr
      })
    },
    delUpload:function(e){
      var that = this
      var imageArr = that.data.imageArr
      if (imageArr.length == 1) {
        return
      }
      var index = e.currentTarget.dataset.index
      imageArr.splice(index,1)
      that.setData({
        imageArr
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
    },

  addPrice:function(){
    var that = this
    var priceArr = that.data.priceArr
    var priceIndex = that.data.priceIndex + 1
    priceArr.push(1)
    that.setData({
      priceArr,
      priceIndex
    })
  },

  delPrice:function() {
    var that = this
    var priceArr = that.data.priceArr
    var priceIndex = that.data.priceIndex
    if (priceIndex == 0) {
      return
    }
    priceArr.splice(priceIndex, 1)
    priceIndex = priceIndex - 1
    that.setData({
      priceArr,
      priceIndex
    })
  },
  ratioPrice:function(e){
    var that = this
    var price = e.detail.value
    var index = e.currentTarget.dataset.index
    var ratioArr = that.data.ratioArr;
    var ratio = that.data.ratio
    var ratioPrice = ratio * price
    ratioPrice = that.formatFloat(ratioPrice,2)
    ratioArr[index] = ratioPrice
    that.setData({
      ratioArr
    })
  },
  // 格式化浮点计算精度丢失问题
  formatFloat: function (f, digit){
    var m = Math.pow(10, digit);
    return Math.round(f * m, 10) / m;
  },

  addSpec:function(){
    var that = this
    var specArr = that.data.specArr
    var specIndex = that.data.specIndex + 1
    specArr.push(1)
    that.setData({
      specArr,
      specIndex
    })
  },
  delSpec:function(){
    var that = this
    var specArr = that.data.specArr
    var specIndex = that.data.specIndex
    if (specIndex == 0) {
      return
    }
    specArr.splice(specIndex, 1)
    specIndex = specIndex - 1
    that.setData({
      specArr,
      specIndex
    })
  },

  addSize: function () {
    var that = this
    var sizeArr = that.data.sizeArr
    var sizeIndex = that.data.sizeIndex + 1
    sizeArr.push(1)
    that.setData({
      sizeArr,
      sizeIndex
    })
  },
  delSize: function () {
    var that = this
    var sizeArr = that.data.sizeArr
    var sizeIndex = that.data.sizeIndex
    if (sizeIndex == 0) {
      return
    }
    sizeArr.splice(sizeIndex, 1)
    sizeIndex = sizeIndex - 1
    that.setData({
      sizeArr,
      sizeIndex
    })
  }
})