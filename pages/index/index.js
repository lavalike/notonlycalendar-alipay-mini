var util = require('../../utils/util')
Page({
  data : {
    header_image_url : '../../assets/images/ic_header.png',
    header_content : '',
    header_note : '',
    current_day : util.formatTime('dd', new Date()),
    lunar_calendar : '',
    lunar_des : '',
    lunar_detail : '',
    taboo_text_avoid : '',
    taboo_text_suit : '',
  },

  onLoad(query) {
    this.init()
    this.requestHeaderInfo()
    this.requestLunarInfo()
  },
  /**
   * 初始化本地缓存
   */
  init(){
    // 每日一句
    var header_url = my.getStorageSync({key: 'header_image_url'}).data
    if(header_url){
      this.setData({
        header_image_url : header_url
      })
    }
    var content = my.getStorageSync({key:'header_content'}).data
    if(content){
      this.setData({
        header_content : content
      })
    }
    var note = my.getStorageSync({key: 'header_note'}).data
    if(note){
      this.setData({
        header_note : note
      })
    }
    // 农历
    var lunarCalendar =my.getStorageSync({key: 'lunarCalendar'}).data
    if(lunarCalendar){
      this.setData({
        lunar_calendar : lunarCalendar
      })
    }
    var lunarDes =my.getStorageSync({key: 'lunarDes'}).data
    if(lunarDes){
      this.setData({
        lunar_des : lunarDes
      })
    }
    var lunarDetail =my.getStorageSync({key: 'lunarDetail'}).data
    if(lunarDetail){
      this.setData({
        lunar_detail : lunarDetail
      })
    }
    var avoid =my.getStorageSync({key: 'avoid'}).data
    if(avoid){
      this.setData({
        taboo_text_avoid : avoid
      })
    }
    var suit =my.getStorageSync({key: 'suit'}).data
    if(suit){
      this.setData({
        taboo_text_suit : suit
      })
    }
  },
  /**
   * 请求每日一句
   */
  requestHeaderInfo(){
    const that = this
    my.request({
      url: 'https://open.iciba.com/dsapi/',
      method : 'GET',
      success (res) {
        var picture = res.data.picture2;
        var content = res.data.content
        var note = res.data.note;
        that.saveHeaderInfo(picture,content,note)
        that.setData({
          header_image_url : picture,
          header_content : content,
          header_note : note
        })
      },fail (res) {
        console.log('error : '+ JSON.stringify(res))
      },
    })
  },
  /**
   * 缓存每日一句
   * @param {*} picture 
   * @param {*} content 
   * @param {*} note 
   */
  saveHeaderInfo : function(picture,content,note){
    my.setStorageSync({
      key: 'header_image_url',
      data: picture
    });
    my.setStorageSync({
      key: 'header_content',
      data: content
    })
    my.setStorageSync({
      key: 'header_note',
      data: note
    })
  },
  /**
   * 请求农历详情
   */
  requestLunarInfo(){
    const that = this
    var param = util.formatTime('yyyyMMdd', new Date())
    my.request({
      url: 'https://www.mxnzp.com/api/holiday/single/' + param,
      method : 'GET',
      headers : {
        'app_id' : 'moehknojlpi9llvn',
        'app_secret' : 'aVBrU2pBSTJFY3c3aUZVMjZMbW1Wdz09',
      },
      success (res) {
        that.saveLunarInfo(res.data.data)
        that.init()
      },
      fail (res) {
        console.log(JSON.stringify(res))
      },
    })
  },
  /**
   * 缓存农历详情
   * @param {*} data 
   */
  saveLunarInfo(data){
    var weekdaycn = util.weekdaycn(data.weekDay)
    var chineseZodiac = data.chineseZodiac
    var yearTips = data.yearTips
    var lunarCalendar = data.lunarCalendar
    var lunarDes = util.formatTime('yyyy年MM月dd日',new Date()) + ' ' + data.typeDes
    var solarTerms = data.solarTerms
    var avoid = data.avoid
    var suit = data.suit
    var dayOfYear = data.dayOfYear
    var weekOfYear = data.weekOfYear
    var lunarDetail = weekdaycn +' ' + yearTips + '[' + chineseZodiac + ']年' + ' ' + solarTerms + '\n ' + util.formatTime('yyyy', new Date()) + '年第' +dayOfYear + '天、第'+ weekOfYear +'周'
    //缓存本地
    my.setStorageSync({
      key: 'lunarCalendar', 
      data: lunarCalendar
    })
    my.setStorageSync({
      key: 'lunarDes', 
      data: lunarDes
    })
    my.setStorageSync({
      key: 'lunarDetail', 
      data: lunarDetail
    })
    my.setStorageSync({
      key :'avoid', 
      data: avoid
    })
    my.setStorageSync({
      key: 'suit', 
      data: suit
    })
  },
  /**
   * 打开历史上的今天
   */
  openHistoryToday(){
    my.navigateTo({
      url: '../history/history',
    })
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '大黄历',
      desc: '支付宝小程序'
    }
  },
});
