const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    user_info:{},
    userToken:'',
    fatherArr:[],
    objFatherArr:[],
    classify_name:'',
    disabled:false,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);return
    var id = options.id
    var parent = options.parent
    var that = this;
    var user_info = wx.getStorageSync('userInfo')
    var userToken = user_info.token
    that.setData({
      user_info,
      userToken
    })
    var data = {type:1}
    var index = 0;
    var disabled = false
    if (typeof (id) != "undefined") {
      data.id = id
      if (typeof (parent) != "undefined") {
        var index = parseInt(parent)
      }else{
        disabled = true
      }
    }
    

    wx.request({
      url: app.globalData.apiUrl + 'api/v1/group_classify/list',
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      data: data,
      success:function(res) {
        if(res.data.state == 1){
          console.log(res.data)
          var fatherArr = res.data.data.array;
          var objFatherArr = res.data.data.objArray;
          var classify_name = ''
          if (typeof (id) != "undefined"){
            var classify_name = res.data.data.edit_classify.classify_name
            if (typeof (parent) != "undefined") {
              fatherArr.splice(0, 1)
              objFatherArr.splice(0, 1)
            }
          } else {
            id = ''
          }
          console.log(index);
          that.setData({
            fatherArr,
            objFatherArr,
            classify_name,
            index,
            disabled,
            id
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
    var id = that.data.id
    if (id != ""){
      params.id = id
    }
    params.parent_id = that.data.objFatherArr[index]['id']
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/group_classify/add',
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