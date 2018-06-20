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
    detailNodeType: 1,
    tabbar: {
        color: "#000000",
        selectedColor: "#ff6600",
        backgroundColor: "#ffffff",
        borderStyle: "black",
        list: [
            {
                pagePath: "/pages/manufactor/index/index",
                text: "加微信",
                iconPath: "../../../image/wx_tarbar.png",
                selectedIconPath: "../../../image/wx_tarbarHL.png",
                selected: true
            },
            {
                pagePath: "/pages/personal/personal",
                text: "请拨号",
                iconPath: "../../../image/phone.png",
                selectedIconPath: "../../../image/phoneHL.png",
                selected: false
            },
            {
                pagePath: "/pages/personal/personal",
                text: "",
                iconPath: "../../../image/add.png",
                selectedIconPath: "../../../image/addHL.png",
                selected: false
            }
            ,
            {
                pagePath: "/pages/personal/personal",
                text: "到我店",
                iconPath: "../../../image/map.png",
                selectedIconPath: "../../../image/mapHL.png",
                selected: false
            }
            ,
            {
                pagePath: "/pages/info/info",
                text: "我信息",
                iconPath: "../../../image/myinfo.png",
                selectedIconPath: "../../../image/myinfoHL.png",
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
  },
  detailNodeChange: function (event) {
      console.log(event.currentTarget.dataset.detailNodeType);
      this.setData({
          detailNodeType: event.currentTarget.dataset.detailNodeType
      });
  }
});


