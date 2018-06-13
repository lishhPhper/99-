//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  editTabBar: function () {
      var tabbar = this.globalData.tabbar,
          currentPages = getCurrentPages(),
          _this = currentPages[currentPages.length - 1],
          pagePath = _this.__route__;
      (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
      for (var i in tabbar.list) {
          tabbar.list[i].selected = false;
          (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
      }
      _this.setData({
          tabbar: tabbar
      });
  },
  globalData: {
      userInfo: null,
      tabbar: {
          color: "#000000",
          selectedColor: "#0f87ff",
          backgroundColor: "#ffffff",
          borderStyle: "black",
          list: [
              {
                  pagePath: "/pages/tabbar/tabbar",
                  text: "项目",
                  iconPath: "/images/item.png",
                  selectedIconPath: "/images/item_HL.png",
                  selected: true
              },
              {
                  pagePath: "/pages/address/address",
                  text: "通讯录",
                  iconPath: "/images/ts.png",
                  selectedIconPath: "/images/ts1.png",
                  selected: false
              },
              {
                  pagePath: "/pages/personal/personal",
                  text: "文件",
                  iconPath: "/images/wjj.png",
                  selectedIconPath: "/images/wjj1.png",
                  selected: false
              }
          ],
          position: "bottom"
      }
  }
})