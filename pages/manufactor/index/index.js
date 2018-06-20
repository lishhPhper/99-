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
        type: 2,
        nodeType: 1,
        productNodeType:1,
        aboutNodeType: 1,
        array: [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
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
    titleChange: function (event) {
        this.setData({
            type: event.currentTarget.dataset.type
        });
    },
    productNodeChange: function (event) {
        this.setData({
            productNodeType: event.currentTarget.dataset.productNodeType
        });
    },
    aboutNodeChange: function (event) {
        console.log(event.currentTarget.dataset.aboutNodeType);
        this.setData({
            aboutNodeType: event.currentTarget.dataset.aboutNodeType
        });
    }
});


