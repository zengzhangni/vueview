import wx from 'weixin-js-sdk'
import http from './axios'

const wxJSDk = () => {
  const url = window.location.href
  http
    .post(
      'wxMpLogin/toObtainPosition/',
      {},
      {
        params: {
          url
        }
      }
    )
    .then((res) => {
      if (res.code === 200) {
        wx.config({
          debug: false, // 开启调试模式,
          appId: res.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，
          jsApiList: ['getLocation', 'onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })

        wx.ready(() => {
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(item) {
              sessionStorage.positionX = item.longitude
              sessionStorage.positionY = item.latitude
            }
          })

          // 分享给朋友
          wx.onMenuShareAppMessage({
            title: res.data.title,
            desc: res.data.desc,
            link: res.data.link,
            imgUrl: res.data.imgUrl,
            success() {
              // 设置成功
            }
          })

          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: res.data.title,
            link: res.data.link,
            imgUrl: res.data.imgUrl,
            success() {
              console.log('success Zoom')
            }
          })
        })

        wx.error((err) => {
          console.log(err)
        })
      }
    })
}

export default wxJSDk
