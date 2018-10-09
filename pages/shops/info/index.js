const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    var userToken = userInfo.token
    var store_type = userInfo.user_info.type
    var id = userInfo.user_info.group_id
    var img_url = app.globalData.apiUrl
    that.setData({
      userInfo,
      userToken
    })
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})