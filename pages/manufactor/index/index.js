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
<<<<<<< HEAD
        type: 2,
        nodeType: 3,
        imageHL: 4,
=======
        type: 1,
        nodeType: 1,
        productNodeType:1,
        aboutNodeType: 1,
        tabbar: {
            color: "#000000",
            selectedColor: "#ff6600",
            backgroundColor: "#ffffff",
            borderStyle: "black",
            list: [
                {
                    pagePath: "/pages/manufactor/index/index",
                    text: "首页",
                    // text: "加微信",
                    iconPath: "../../../image/wx_tarbar.png",
                    selectedIconPath: "../../../image/wx_tarbarHL.png",
                    selected: true
                },
                {
                    pagePath: "/pages/community/index/index",
                    text: "爱我家",
                    // text: "请拨号",
                    iconPath: "../../../image/heart.png",
                    selectedIconPath: "../../../image/heartHL.png",
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
>>>>>>> 03d9118928292db179c788e3e67006f78d66618b
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


