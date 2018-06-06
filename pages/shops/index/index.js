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
    status:1,
    arry: [

      { text: "沙发" },

      { text: "沙发" },

      { text: "沙发" },

      { text: "沙发" },

      { text: "沙发" },

      { text: "沙发" },

      { text: "沙发" },

      { text: "沙发" },
      { text: "沙发" },
      { text: "沙发" },
    ]
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
  entityStore:function (e) {
    this.setData({

    })
  }
});


