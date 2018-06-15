//index.js
//获取应用实例
const app = getApp()

var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    toView: 'red',
    scrollTop: 100,
    tabbar: {
        color: "#000000",
        selectedColor: "#ff6600",
        backgroundColor: "#ffffff",
        borderStyle: "black",
        list: [
            {
                pagePath: "/pages/aaa",
                text: "评论",
                iconPath: "../../../image/comment.png",
                selectedIconPath: "../../../image/comment.png",
                selected: false
            },
            {
                pagePath: "/pages/aaa",
                text: "点赞",
                iconPath: "../../../image/thumbs-up.png",
                selectedIconPath: "../../../image/thumbs-up.png",
                selected: false
            }
            ,
            {
                pagePath: "/pages/aaa",
                text: "收藏",
                iconPath: "../../../image/collect02.png",
                selectedIconPath: "../../../image/collect02.png",
                selected: false
            }
            ,
            {
                pagePath: "/pages/aaa",
                text: "分享",
                iconPath: "../../../image/share.png",
                selectedIconPath: "../../../image/share.png",
                selected: false
            }
        ],
        position: "bottom"
    },
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
});


