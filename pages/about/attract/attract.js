
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type
    if(type == 2){
      // 修改头部
      wx.setNavigationBarTitle({
        title: '关于99家具'
      })
    }
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    var userToken = userInfo.token
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/store/attract?type=' + type,
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      success: function (res) {
       if(res.data.state == 1){
         that.setData({
           content:res.data.data
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