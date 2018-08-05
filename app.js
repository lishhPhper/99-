//app.js
App({
    onLaunch: function () {

    },
    globalData: {
        lat: '',
        lng: '',
        province: '',
        city: '',
        district: '',
        address: '',
        apiUrl: 'https://www.7qiaoban.cn/',
        // apiUrl: 'http://furniture.com/',
        // apiUrl: 'http://99.icode99.top/',
        successReturn: {
            error_code: 0,
            message: '成功',
            data: {}
        },
        failReturn: {
            error_code: 1,
            message: '失败',
            data: {}
        },

    }
})