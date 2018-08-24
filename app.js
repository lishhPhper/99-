//app.js
App({
    onLaunch: function() {

    },
    globalData: {
        apiUrl: 'https://www.7qiaoban.cn/',
        // apiUrl: 'http://99.icode99.top/',
        _music: '',
        music_url: 'https://www.7qiaoban.cn',
        img_url: 'https://www.7qiaoban.cn',
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