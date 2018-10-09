const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        add_status: 2,
        upload_url: app.globalData.apiUrl + 'api/v1/image/temporary',
        loadingHidden: true,
        recordingHidden: true,
        music_url: app.globalData.music_url,
        img_url: app.globalData.img_url,
        articleId: '',
        contentArr:{
            title: '',
            classify_id: '',
            music: '',
            musicName: '',
            items:[]
        }
    },
    onShow: function () {
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var obj = this;
        if (options.articleId == undefined) {
            options.articleId = '';
        }
        obj.setData({
            articleId: options.articleId,
        });
        wx.getStorage({
            key: 'userInfo',
            success: function(res) {
                var userToken = res.data.token;
                var user_info = res.data.user_info;
                // 获取动态类别
                wx.request({
                    url: app.globalData.apiUrl + 'api/v1/article/classify',
                    method: 'GET',
                    header: {
                        'userToken': userToken
                    },
                    success: function (classifyRes) {
                        if (classifyRes.data.state == 1) {
                            var items = classifyRes.data.data;
                            if(items.length > 0){
                                var classifyNameArr = [];
                                for (var i = 0; i < items.length; i++) {
                                    classifyNameArr[classifyNameArr.length] = items[i]['classify_name'];
                                }
                            }
                            obj.setData({
                                userInfo: res.data.user_info,
                                token: res.data.token,
                                classifyArr: classifyRes.data.data,
                                classifyNameArr: classifyNameArr,
                            });
                            // 从富文本编辑文字之后回到编辑动态页面 获取临时缓存 或者添加新动态
                            if (options.type == 2 || options.articleId == '') {
                                wx.request({
                                    url: app.globalData.apiUrl + 'api/v1/article/getCache',
                                    method: 'GET',
                                    header: {
                                        'userToken': userToken
                                    },
                                    data: {
                                        articleId: options.articleId,
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
                                                contentArr: getCacheRes.data.data,
                                            });
                                            var classifyArr = obj.data.classifyArr;
                                            for (var j = 0; j < classifyArr.length; j++) {
                                                if (classifyArr[j]['id'] == getCacheRes.data.data.classify_id) {
                                                    obj.setData({
                                                        pickerIndex: j,
                                                    });
                                                    break;
                                                }
                                            }
                                        } else {
                                            console.log(getCacheRes);
                                        }
                                    }
                                });
                            } else {
                                wx.request({
                                    url: app.globalData.apiUrl + 'api/v1/article/getArticleContent',
                                    method: 'GET',
                                    header: {
                                        'userToken': userToken
                                    },
                                    data: {
                                        id: options.articleId,
                                    },
                                    success: function (getArticleContentRes) {
                                        console.log(getArticleContentRes);
                                        if (getArticleContentRes.data.state == 1) {
                                            var items = getArticleContentRes.data.data.items;
                                            for (var i = 0; i < items.length; i++) {
                                                WxParse.wxParse('format_text', 'html', items[i]['text'], obj, 5);
                                                items[i]['format_text'] = obj.data.format_text;
                                            }
                                            getArticleContentRes.data.data.items = items;
                                            obj.setData({
                                                userInfo: res.data.user_info,
                                                token: res.data.token,
                                                contentArr: getArticleContentRes.data.data,
                                            });
                                        }
                                    }
                                });
                            }
                        } else {
                            console.log(classifyRes);
                        }
                    }
                });
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
        var contentArr = this.data.contentArr;
        var userToken = this.data.token;
        var length = contentArr.items.length;
        var box = {
            'id': 0,
            'text': '',
            'img': '',
        };
        contentArr.items[length] = box;
        this.setData({
            contentArr: contentArr
        });
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/Article/setCache',
            method: 'GET',
            header: {
                'userToken': userToken
            },
            data: {
                type: 2
            },
            success: function(setCacheRes) {
                console.log(setCacheRes);
            }
        });
    },
    /**
     * 删除图文item
     */
    delBox: function(event) {
        var obj = this;
        var contentArr = this.data.contentArr;
        var itemKey = event.currentTarget.dataset.itemKey;
        console.log(contentArr);
        console.log(itemKey);
        contentArr.items.splice(itemKey, 1);
        this.setData({
            contentArr: contentArr
        });
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/Article/setCache',
            method: 'GET',
            header: {
                'userToken': obj.data.token,
            },
            data: {
                itemKey: itemKey,
                type: 3,
            },
            success: function(setCacheRes) {
                if (setCacheRes.data.state == 1) {
                    console.log(setCacheRes);
                } else {
                    console.log(setCacheRes);
                }
            }
        });
    },
    /**
     * 播放音乐
     */
    playVoice: function(event) {
        var obj = this;
        this.setData({
            loadingHidden: false
        });
        if (app.globalData._music != '') {
            app.globalData._music.destroy();
        }
        app.globalData._music = wx.createInnerAudioContext();
        app.globalData._music.autoplay = true;
        app.globalData._music.loop = true;
        app.globalData._music.src = event.currentTarget.dataset.voiceResource;
        app.globalData._music.onPlay(() => {
            console.log('开始播放');
            obj.setData({
                loadingHidden: true
            });
            obj.update();
        })
        app.globalData._music.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    /**
     * 上传图片
     */
    uploadImg: function(event) {
        var obj = this;
        var contentArr = this.data.contentArr;
        var itemKey = event.currentTarget.dataset.itemKey;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
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
                    success: function(uploadRes) {
                        var img_data = JSON.parse(uploadRes.data);
                        if (img_data.state == '1') {
                            wx.request({
                                url: app.globalData.apiUrl + 'api/v1/article/setCache',
                                method: 'GET',
                                header: {
                                    'userToken': obj.data.token
                                },
                                data: {
                                    itemKey: itemKey,
                                    img: img_data.data.img,
                                    articleId: obj.data.articleId
                                },
                                success: function(setCacheRes) {
                                    if (setCacheRes.data.state == 1) {
                                        contentArr.items[itemKey]['img'] = img_data.data.img;
                                        obj.setData({
                                            contentArr: contentArr
                                        });
                                    } else {
                                        console.log(setCacheRes);
                                    }
                                }
                            });
                        } else {
                            console.log(uploadRes);
                        }
                    }
                })
            }
        })
    },
    /**
     * 保存动态
     */
    saveArticle: function(event) {
        var obj = this;
        var contentArr = obj.data.contentArr;
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/article/saveArticleContent',
            method: 'POST',
            header: {
                'userToken': obj.data.token
            },
            data: {
                article_id: obj.data.articleId,
                classify_id: contentArr.classify_id,
                title: contentArr.title,
                music: contentArr.music,
                music_name: contentArr.music_name,
                items: JSON.stringify(contentArr.items),
            },
            success: function (saveArticleContentRes) {
                if (saveArticleContentRes.data.state == 1) {
                    wx.switchTab({
                        url: "../index/index?type=1"
                    })
                } else {
                    console.log(saveArticleContentRes);
                }
            }
        });
    },
    /**
     * 录制语音
     */
    recorded: function(event) {
        const recorderManager = wx.getRecorderManager();
        var obj = this;
        this.setData({
            recordingHidden: false
        });

        recorderManager.onStart(() => {
            console.log('recorder start')
        })
        recorderManager.onPause(() => {
            console.log('recorder pause')
        })
        recorderManager.onStop((res) => {
            console.log('recorder stop', res);
            const {
                tempFilePath
            } = res;
            obj.setData({
                recordingHidden: true
            });
            obj.update();
        })
        recorderManager.onFrameRecorded((res) => {
            const {
                frameBuffer
            } = res
            console.log('frameBuffer.byteLength', frameBuffer.byteLength)
        })

        const options = {
            duration: 10000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 192000,
            format: 'aac',
            frameSize: 50
        }

        recorderManager.start(options)
    },
    bindPickerChange: function (e) {
        var obj = this;
        var contentArr = obj.data.contentArr;
        var classifyArr  = obj.data.classifyArr;
        var pickerIndex = e.detail.value;
        obj.setData({
            pickerIndex: pickerIndex,
        });
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/article/setCache',
            method: 'GET',
            header: {
                'userToken': obj.data.token
            },
            data: {
                classifyId: classifyArr[pickerIndex]['id'],
                articleId: obj.data.articleId
            },
            success: function (setCacheRes) {
                if (setCacheRes.data.state == 1) {
                    contentArr.classify_id = classifyArr[pickerIndex]['id'];
                    obj.setData({
                        contentArr: contentArr
                    });
                } else {
                    console.log(setCacheRes);
                }
            }
        });
    },
    inputTyping: function (e) {
        var title = e.detail.value;
        var contentArr = this.data.contentArr;
        contentArr.title = title;
        var userToken = this.data.token;
        this.setData({
            contentArr: contentArr
        });
        wx.request({
            url: app.globalData.apiUrl + 'api/v1/article/setCache',
            method: 'GET',
            header: {
                'userToken': userToken
            },
            data: {
                title: title
            },
            success: function (setCacheRes) {
                console.log(setCacheRes);
            }
        });
    },
})