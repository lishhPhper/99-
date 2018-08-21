const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    big_index:'',
    first_category:'',
    first_category_id:'',
    category_child_id:'',
    categoryList:[],
    userToken:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userToken = res.data.token
        that.setData({
          userToken
        });

        wx.request({
          url: app.globalData.apiUrl + 'api/v1/category/storeList',
          header: {
            'content-type': 'application/json',
            'userToken': userToken
          },
          method: 'Get',
          success: function (res) {
            console.log(res.data.data.category);
            var categoryList = res.data.data.category;
            that.setData({
              categoryList
            });
          }
        })
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

  // 选择第一分类
  chooseOs: function (event) {
    for (var i = 0; i < this.data.categoryList.length; i++) {
      if (event.currentTarget.id == this.data.categoryList[i].id) {
        if (this.data.categoryList[i].checked == true) {
          this.data.categoryList[i].checked = false;
          var categoryList = this.data.categoryList;
          this.setData({
            categoryList,//重定义CartList，使购物车的样式实现局部刷新
          })
        } else {
          var index = this.data.big_index
          if(index !== ''){
            this.data.categoryList[index].checked = false;
          }
          this.data.categoryList[i].checked = true;
          var big_index = i;
          var first_category_id = this.data.categoryList[i].id;
          var first_category = this.data.categoryList[i].name;
          var categoryList = this.data.categoryList;
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          this.setData({
            categoryList,//重定义CartList，使购物车的样式实现局部刷新
            big_index,
            first_category,
            first_category_id
          })
          prevPage.setData({
            category_id: first_category_id,
            category_name: first_category
          })
        }
      }
    }
  },

  // 第二分类
  checkboxChange:function (event){
    var category_child = event.detail.value;
    var category_child_id = category_child.join(",");
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      category_child_id
    })
  },
  back:function (){
    wx.navigateBack({
      delta:1
    })
  }
})