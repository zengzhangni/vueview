<template>
    <div style="width: 80%;height: 80%;padding: 10%">
        <el-carousel :interval="100" type="card" height="500px">
            <el-carousel-item v-for="item in imgList" :key="item">
                <img :src="item" style="width: 100%;height: 100%"/>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        name: "Index",
        data() {
            return {
                imgList: [
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/member.jpg",
                    "http://localhost/upload/1563422017873.png",
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/2019-071562206113538.JPEG",
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/2019-071562206113538.JPEG",
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/2019-071562206113538.JPEG",
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/2019-071562206113538.JPEG",
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/2019-071562206113538.JPEG",
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/2019-071562206113538.JPEG",
                    "https://beautybond-uat.oss-cn-shenzhen.aliyuncs.com/test/public-read/2019-071562206113538.JPEG"
                ]
            }
        },
        methods: {}
    }
</script>

<style scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 200px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>