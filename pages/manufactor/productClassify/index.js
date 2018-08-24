// pages/manufactor/productClassify/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:{},
    userToken:'',
    classifyList:[],
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
      url: app.globalData.apiUrl + 'api/v1/group_classify/list',
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      data: {
        type: 2
      },
      success: function (res) {
        if (res.data.state == 1) {
          var classifyList = res.data.data;
          that.setData({
            classifyList,
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
  jumpCreate: function (e) {
    var jump_type = e.currentTarget.dataset.type
    if (jump_type == 1) {
      wx.navigateTo({
        url: '../addClassify/addClassify',
      })
    }
    if (jump_type == 2) {
      wx.navigateTo({
        url: '../../product/edit/edit',
      })
    }
  },
  sortClassify:function(e){
    var that = this
    var sort_type = e.currentTarget.dataset.type
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var parent = e.currentTarget.dataset.parent
    console.log(sort_type, id, index, parent)
    var sort_classify = []
    var classifyList = that.data.classifyList
    // 上升
    if(sort_type == 'up'){
      // 一级分类
      if (typeof(parent) == "undefined"){
          // 排序不为0才能上升
          if(index != 0){
            var index_1_classify = classifyList[index - 1]
            var index_classify = classifyList[index]
            classifyList[index] = index_1_classify
            classifyList[index - 1] = index_classify
          }else{
            return;
          }
      }
      // 二级分类
      if (typeof (parent) != "undefined"){
        // 排序不为0才能上升
        if (index != 0) {
          var son_index_1_classify = classifyList[parent]['son'][index - 1]
          var son_index_classify = classifyList[parent]['son'][index]
          classifyList[parent]['son'][index] = son_index_1_classify
          classifyList[parent]['son'][index - 1] = son_index_classify
        } else {
          return;
        }
      }
    }

    // 下降
    if (sort_type == 'down'){
      // 一级分类
      if (typeof (parent) == "undefined") {
        var classify_length = classifyList.length
        // 排序小于 length-1 才能下降
        if (index < classify_length - 1){
          var index_1_classify = classifyList[index + 1]
          var index_classify = classifyList[index]
          classifyList[index] = index_1_classify
          classifyList[index + 1] = index_classify
        } else {
          return;
        }
      }
      // 二级分类
      if (typeof (parent) != "undefined") {
        var son_classify_length = classifyList[parent]['son'].length
        // 排序小于 length-1 才能下降
        if (index < son_classify_length - 1) {
          var son_index_1_classify = classifyList[parent]['son'][index + 1]
          var son_index_classify = classifyList[parent]['son'][index]
          classifyList[parent]['son'][index] = son_index_1_classify
          classifyList[parent]['son'][index + 1] = son_index_classify
        } else {
          return;
        }
      }
    }
    that.setData({
      classifyList
    })

    var userToken = that.data.userToken
    wx.request({
      url: app.globalData.apiUrl + 'api/v1/group_classify/sort',
      header: {
        'content-type': 'application/json',
        'userToken': userToken
      },
      method:'POST',
      data: {
        classifyList: classifyList
      },
      success: function (res) {
        console.log(res)
      }
    })
  },

  delClassify:function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var parent = e.currentTarget.dataset.parent
    var index = e.currentTarget.dataset.index
    var userToken = that.data.userToken
    var classifyList = that.data.classifyList
    // console.log(parent)
    if (typeof (parent) == "undefined"){
      wx.showModal({
        title: '提示',
        content: '删除顶级分类后，下属二级分类都将删除，是否删除？',
        success: function (sm) {
          if (sm.confirm) {
            wx.request({
              url: app.globalData.apiUrl + 'api/v1/group_classify/del',
              header: {
                'content-type': 'application/json',
                'userToken': userToken
              },
              method: 'POST',
              data: {
                id: id,
                parent:true
              },
              success: function (res) {
                console.log(res)
                //删除分类数据
                classifyList.splice(index,1);
                that.setData({
                  classifyList
                })
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
            return
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否删除分类？',
        success: function (sm) {
          if (sm.confirm) {
            wx.request({
              url: app.globalData.apiUrl + 'api/v1/group_classify/del',
              header: {
                'content-type': 'application/json',
                'userToken': userToken
              },
              method: 'POST',
              data: {
                id: id,
                parent: false
              },
              success: function (res) {
                console.log(res)
                //删除分类数据
                classifyList[parent]['son'].splice(index, 1);
                that.setData({
                  classifyList
                })
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
            return
          }
        }
      })
    }
  }
})