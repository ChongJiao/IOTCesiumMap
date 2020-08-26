<template>
  <div class="homepage-video-module" >
    <LoginWidget></LoginWidget>
    <div class="video-container">
      <!--    <Login></Login>-->
      <div :style="fixStyle" class="filter"></div>
<!--      <video :style="fixStyle" autoplay loop muted class="fillWidth" v-on:canplay="canplay"-->
<!--      poster="../assets/oceans.png">-->
<!--        <source src="../assets/New-jumbo.mp4" type="video/mp4" >-->
<!--      </video>-->

<!--        <video :style="fixStyle" autoplay loop muted class="fillWidth" v-on:canplay="canplay">-->
<!--            <source-->
<!--              src="//vjs.zencdn.net/v/oceans.mp4"-->
<!--              type="video/mp4"-->
<!--            >-->
<!--          <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>-->
<!--          <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>-->
<!--&lt;!&ndash;              src="http://babylife.qiniudn.com/FtRVyPQHHocjVYjeJSrcwDkApTLQ"&ndash;&gt;-->

<!--          </video>-->
    </div>
  </div>
</template>
<script>
import LoginWidget from './LoginWidget'
export default {
  name: 'Login',
  data () {
    return {
      vedioCanPlay: false,
      fixStyle: ''
    }
  },
  components: {LoginWidget},
  methods: {
    canplay () {
      this.vedioCanPlay = true
    }
  },
  mounted: function () {
    window.onresize = () => {
      const windowWidth = document.body.clientWidth
      const windowHeight = document.body.clientHeight
      const windowAspectRatio = windowHeight / windowWidth
      let videoWidth
      let videoHeight
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth
        videoHeight = videoWidth * 0.5625
        this.fixStyle = {
          height: windowWidth * 0.5625 + 'px',
          width: windowWidth + 'px',
          'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
          'margin-left': 'initial'
        }
      } else {
        videoHeight = windowHeight
        videoWidth = videoHeight / 0.5625
        this.fixStyle = {
          height: windowHeight + 'px',
          width: windowHeight / 0.5625 + 'px',
          'margin-left': (windowWidth - videoWidth) / 2 + 'px',
          'margin-bottom': 'initial'
        }
      }
    }
    window.onresize()
  }
}
</script>

<style scoped>
  .homepage-video-module,
  .video-container{
    position:relative;
    height:100%;
    overflow:hidden;
    background-color: #000066;
  }
  .video-container .filter{
    z-index:1;
    position:absolute;
    background: rgba(0,0,0,0.4);
    width:100%;
  }
  /*.video-container .poster img{*/
  /*  z-index: 0;*/
  /*  position: absolute;*/
  /*}*/
  .fillWidth {
    width: 100%;
  }
</style>
<!--<template>-->
<!--  <div class="test_two_box">-->
<!--    <video-->
<!--      id="myVideo"-->
<!--      class="video-js"-->
<!--    >-->
<!--      <source-->
<!--        src="//vjs.zencdn.net/v/oceans.mp4"-->
<!--        type="video/mp4"-->
<!--      >-->
<!--    </video>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  /* eslint-disable */-->
<!--  export default {-->
<!--    name: "TestTwo",-->
<!--    data() {-->
<!--      return {};-->
<!--    },-->
<!--    mounted() {-->
<!--      this.initVideo();-->
<!--    },-->
<!--    methods: {-->
<!--      initVideo() {-->
<!--        //初始化视频方法-->
<!--        let myPlayer = this.$video(myVideo, {-->
<!--          //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。-->
<!--          controls: true,-->
<!--          //自动播放属性,muted:静音播放-->
<!--          autoplay: "muted",-->
<!--          //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。-->
<!--          preload: "auto",-->
<!--          //设置视频播放器的显示宽度（以像素为单位）-->
<!--          width: "800px",-->
<!--          //设置视频播放器的显示高度（以像素为单位）-->
<!--          height: "400px"-->
<!--        });-->
<!--      }-->
<!--    }-->
<!--  };-->
<!--</script>-->

<!--<style scoped>-->
<!--</style>-->
