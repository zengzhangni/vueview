<template>
    <el-container style="height: 100%; border: 1px solid #ffffff">
        <el-aside width="200px" style="background-color: rgb(255,255,255)">
            <div class="indexDiv" @click="$router.push('/index')"><i class="el-icon-star-off"></i>&nbsp;&nbsp;&nbsp;首页
            </div>
            <el-menu unique-opened style="background-color: #ffffff">
                <el-submenu :index="String(index)" :key="index" v-for="(item,index) of menus">
                    <template slot="title"><i class="el-icon-message"></i>{{item.name}}</template>
                    <el-menu-item :index="String(i)" @click="$router.push(child.url)" :key="i"
                                  v-for="(child,i) of item.childs">{{child.name}}
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <HomePage/>
    </el-container>
</template>

<script>
    import HomePage from "../views/HomePage";

    export default {
        name: "meun",
        data() {
            return {
                menus: []
            };
        },
        mounted() {
            this.$http.get("/menu/getTree").then(res => {
                this.menus = res.data;
            })
        },
        components: {
            HomePage
        }

    }
</script>

<style scoped>
    .indexDiv {
        cursor: pointer;
        padding-top: 40px;
        margin-left: 20px;
        margin-bottom: 30px;
        color: blue;
    }
</style>
