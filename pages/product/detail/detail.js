//获取应用实例
const app = getApp()

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        toView: 'red',
        scrollTop: 100,
        detailNodeType: 1,
    },
    detailNodeChange: function (event) {
        this.setData({
            detailNodeType: event.currentTarget.dataset.detailNodeType
        });
    }
});


