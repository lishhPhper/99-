
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        state: '',
        store_type: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
        var that = this;
        var userInfo = wx.getStorageSync('userInfo')
        var store_type = userInfo.user_info.type
        var group_id = userInfo.user_info.group_id
        if (group_id == '') {
            that.setData({
                state: 1
            })
        } else if (store_type == 1) {
            that.setData({
                state: 2
            })
        } else if (store_type == 2) {
            that.setData({
                state: 3
            })
        }
        that.setData({
            store_type,
        })
        console.log(store_type);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    jump: function(e) {
        var add_type = e.currentTarget.dataset.type
        if (add_type == 1) {
            wx.navigateTo({
                url: '../createStore/createStore',
            })
        }
        if (add_type == 2) {
            // 发布动态页面
            wx.navigateTo({
                url: '../../community/editor/editor',
            })
        }
        var store_type = this.data.store_type
        if (add_type == 3) {
            wx.navigateTo({
                url: '../../manufactor/productControl/index',
                // url:'../../manufactor/productClassify/index'
            })
        }
        if (add_type == 4) {
            wx.navigateTo({
                url: '../../manufactor/editor/editor',
                // url:'../../manufactor/productClassify/index'
            })
        }
    }
})