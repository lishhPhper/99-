const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:'',
    type:'',
    userToken:'',
    blackList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    var userToken = userInfo.token
    var type = userInfo.user_info.type
    that.setData({
      type,
      userToken
    })
    // 获取黑名单
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/relate/blackList',
      method: 'GET',
      header: {
        'userToken': userToken
      },
      success: function (res) {
        console.log(res.statusCode);
        if (res.statusCode == 200){
          that.setData({
            blackList: res.data.default
          })
        }
      }
    })
  },

  categoryChange:function(e){
    var category = e.currentTarget.dataset.category
    var that = this
    var userToken = that.data.userToken
    that.setData({
      category
    })
    // 切换数据
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/relate/blackList?category=' + category,
      method: 'GET',
      header: {
        'userToken': userToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var blackList = [];
          if (category == 'factory'){
            blackList = res.data.factory
          } else if (category == 'shop'){
            blackList = res.data.shop
          } else if (category == 'goods') {
            blackList = res.data.goods
          }
          that.setData({
            blackList
          })
        }
      }
    })
  }
})