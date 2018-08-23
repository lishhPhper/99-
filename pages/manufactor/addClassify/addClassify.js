const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    index:0,
    user_info:{},
    userToken:'',
    fatherArr:[],
    index: 0,
    objFatherArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user_info = wx.getStorageSync('userInfo')
    var userToken = user_info.token
    that.setData({
      user_info,
      userToken
    })

    wx.request({
      url: app.globalData.apiUrl + 'api/v1/classify/groupClassify',
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      data:{
        type:1
      },
      success:function(res) {
        if(res.data.state == 1){
          var fatherArr = res.data.data.array;
          var objFatherArr = res.data.data.objArray;
          that.setData({
            fatherArr,
            objFatherArr
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
    
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  formSubmit: function (e) {
    var that = this
    var params = e.detail.value
    var index = that.data.index;
    var userToken = that.data.userToken
    params.parent_id = that.data.objFatherArr[index]['id']
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/classify/addGroupClassify',
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      data:params,
      method:'POST',
      success: function (res) {
        if (res.data.state == 1) {
          wx.navigateTo({
            url: '../productClassify/index',
          })
        }
      }
    })
  }
})