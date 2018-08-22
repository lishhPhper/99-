const app = getApp();
var _music = '';
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        add_status: 2,
        upload_url: app.globalData.apiUrl + 'api/v1/image/temporary',
        img_url: app.globalData.apiUrl,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var obj = this;
        wx.getStorage({
            key: 'userInfo',
            success: function (res) {
                var userToken = res.data.token;
                var user_info = res.data.user_info;
                if (options.type == 2) {
                    wx.request({
                        url: app.globalData.apiUrl + 'api/v1/homeContent/getCache',
                        method: 'GET',
                        header: {
                            'userToken': userToken
                        },
                        success: function (getCacheRes) {
                            var items = getCacheRes.data.data.items;
                            if (getCacheRes.data.state == 1) {
                                for (var i = 0; i < items.length; i++) {
                                    WxParse.wxParse('format_text', 'html', items[i]['text'], obj, 5);
                                    items[i]['format_text'] = obj.data.format_text;
                                }
                                getCacheRes.data.data.items = items;
                                obj.setData({
                                    userInfo: user_info,
                                    token: userToken,
                                    home_content: getCacheRes.data.data,
                                });
                            } else {
                                console.log(getCacheRes);
                            }
                        }
                    });
                }else{
                    wx.request({
                        url: app.globalData.apiUrl + 'api/v1/homeContent/getHomeContent',
                        method: 'GET',
                        header: {
                            'userToken': userToken
                        },
                        success: function (homeContentRes) {
                            if (homeContentRes.data.state == 1) {
                                var items = homeContentRes.data.data.items;
                                for (var i = 0; i < items.length; i++) {
                                    WxParse.wxParse('format_text', 'html', items[i]['text'], obj, 5);
                                    items[i]['format_text'] = obj.data.format_text;
                                }
                                homeContentRes.data.data.items = items;
                                obj.setData({
                                    userInfo: res.data.user_info,
                                    token: res.data.token,
                                    home_content: homeContentRes.data.data,
                                });
                            } else {
                                console.log(homeContentRes);
                            }
                        }
                    });
                }
            },
        })
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
    /**
     * 添加图文item
     */
    addBox: function() {
        var home_content = this.data.home_content;
        var userToken = this.data.token;
        var length = home_content.items.length;
        var box = {
            'text': '',
            'img': '',
        };
        home_content.items[length] = box;
        this.setData({
            home_content: home_content
        });
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/homeContent/setCache',
            method: 'GET',
            header: {
                'userToken': userToken
            },
            data:{
                type:2
            },
            success: function (setCacheRes) {
                console.log(setCacheRes);
            }
        });
    },
    /**
     * 删除图文item
     */
    delBox: function (event) {
        var home_content = this.data.home_content;
        var itemKey = event.currentTarget.dataset.itemKey;
        home_content.items.splice(itemKey, 1);
        this.setData({
            home_content: home_content
        });
    },
    /**
     * 播放音乐
     */
    playVoice: function (event) {
        if (_music != '') {
            _music.destroy();
        }
        _music = wx.createInnerAudioContext();
        _music.autoplay = true;
        _music.loop = true;
        _music.src = event.currentTarget.dataset.voiceResource
        _music.onPlay(() => {
            console.log('开始播放');
        })
        _music.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    /**
     * 上传图片
     */
    uploadImg: function (event) {
        var obj = this;
        var home_content = this.data.home_content;
        var itemKey = event.currentTarget.dataset.itemKey;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                console.log(res);
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                wx.uploadFile({
                    url: obj.data.upload_url,
                    filePath: res.tempFilePaths[0],
                    name: 'img',
                    header: {
                        'content-type': 'multipart/form-data',
                        'userToken': obj.data.token
                    }, // 设置请求的 header
                    success: function (uploadRes) {
                        var img_data = JSON.parse(uploadRes.data);
                        if (img_data.state == '1') {
                            wx.request({
                                url: app.globalData.apiUrl + 'api/v1/homeContent/setCache',
                                method: 'GET',
                                header: {
                                    'userToken': obj.data.token
                                },
                                data: {
                                    itemKey: itemKey,
                                    text: home_content.items[itemKey]['text'],
                                    img: img_data.data.img
                                },
                                success: function (setCacheRes) {
                                    if (setCacheRes.data.state == 1) {
                                        home_content.items[itemKey]['img'] = img_data.data.img;
                                        obj.setData({
                                            home_content: home_content
                                        });
                                    }else{
                                        console.log(setCacheRes);
                                    }
                                }
                            });
                        }else{
                            console.log(uploadRes);
                        }
                    }
                })
            }
        })
    },
    /**
     * 保存图文
     */
    saveContent: function (event) {
        var obj = this;
        var home_content = obj.data.home_content;
        var itemKey = event.currentTarget.dataset.itemKey;
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/homeContent/saveHomeContent',
            method: 'POST',
            header: {
                'userToken': obj.data.token
            },
            data: { 
                music: home_content.music, 
                record: home_content.record,
                music_name: home_content.music_name,
                items: JSON.stringify(home_content.items),
            },
            success: function (saveHomeContentRes) {
                if (saveHomeContentRes.data.state == 1) {
                    wx.redirectTo({
                        url: "../index/index"
                    })
                } else {
                    console.log(saveHomeContentRes);
                }
            }
        });
    }
})