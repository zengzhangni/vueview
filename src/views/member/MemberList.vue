<template>

    <div>

        <div style="padding: 10px 20px">
            <el-input style="width: 300px"
                      placeholder="请输入昵称或手机号查询"
                      v-model="keyWord">
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="memberSearch">查询</el-button>
            <el-button type="primary" icon="el-icon-delete" round style="float: right" @click="memberDelete">删除
            </el-button>
            <el-button type="primary" icon="el-icon-edit" round style="float: right" @click="memberEdit">编辑</el-button>
            <el-button type="primary" icon="el-icon-success" round style="float: right" @click="memberAdd">新增
            </el-button>
            <el-button type="primary" icon="el-icon-download" round style="float: right" @click="exportMember">导出
            </el-button>
        </div>

        <el-table :data="memberListData"
                  ref="multipleTable"
                  :row-class-name="tableRowClassName"
                  stripe
                  max-height="650"
                  @row-click="rowClick"
                  @selection-change="selectionChange"
        >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>

            <el-table-column prop="registerPhone" :formatter="phoneFormat" label="手机号" align="center">
            </el-table-column>
            <el-table-column prop="memberUuid" label="会员uuid" align="center" width="200px">
            </el-table-column>
            <el-table-column prop="memberNickname" label="会员昵称" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="gender" :formatter="genderFormat" label="性别" align="center">
            </el-table-column>
            <el-table-column prop="memberImgUrl" label="会员头像" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.memberImgUrl" width="50" height="50"/>
                </template>
            </el-table-column>
            <el-table-column prop="personSignature" label="个人签名" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="birthday" label="出生年月" align="center">
            </el-table-column>
            <el-table-column prop="memberStatus" :formatter="memberStatusFormat" label="账号状态" align="center">
            </el-table-column>
        </el-table>
        <div class="block" style="float: right;padding: 30px">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <!--新增dialog-->
        <el-dialog :title="dialogTitle" :visible.sync="memberDialog" width="35%">
            <el-form :model="member" style="text-align: center">
                <el-form-item label="手机号" label-width="100px" required>
                    <el-input v-model="member.registerPhone" style="width: 229px"></el-input>
                </el-form-item>
                <el-form-item label="会员昵称" label-width="100px">
                    <el-input v-model="member.memberNickname" style="width: 229px"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="100px">
                    <el-select v-model="member.gender" placeholder="性别">
                        <el-option label="男" value="0"></el-option>
                        <el-option label="女" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="个人签名" label-width="100px">
                    <el-input v-model="member.personSignature" style="width: 229px"></el-input>
                </el-form-item>
                <el-form-item label="出生年月" label-width="100px">
                    <el-date-picker type="date" placeholder="选择日期" v-model="member.birthday"
                                    :editable="false"></el-date-picker>
                </el-form-item>
                <el-form-item label="会员头像" label-width="100px">
                    <el-upload
                            class="avatar-uploader"
                            action="/ss/upload/uploadFile"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="temporaryImg" :src="uploadImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="memberDialog = false">取 消</el-button>
                <el-button type="primary" @click="memberSubmit">确 定</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    export default {
        name: "MemberList",
        data() {
            return {
                pageNo: 1,
                pageSize: 10,
                total: 0,
                memberListData: [],
                keyWord: null,
                memberDialog: false,
                uploadImg: "",
                temporaryImg: "",
                indexList: [],
                dialogTitle: "",
                member: {
                    registerPhone: null,
                    memberNickname: null,
                    gender: null,
                    memberImgUrl: null,
                    personSignature: null,
                    birthday: null
                }
            }
        },
        mounted() {
            this.http(this.pageNo, this.pageSize, this.keyWord);
        },
        methods: {
            http(pageNo, pageSize, keyWord) {
                this.$http.post("/member/findByPage", {}, {
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        keyWord: keyWord
                    }
                })
                    .then(res => {
                        const {list, total} = res.data;
                        this.memberListData = list;
                        this.total = total;
                    })
            },
            //格式化
            genderFormat(row) {
                return row.gender === 0 ? '男' : '女';
            },
            memberStatusFormat(row) {
                return row.memberStatus === 0 ? '正常' : '禁用';
            },
            phoneFormat(row) {
                const reg = /^(\d{3})\d{4}(\d{4})$/;
                return String(row.registerPhone).replace(reg, "$1****$2");
            },
            //点击选中
            tableRowClassName({row, rowIndex}) {
                //把每一行的索引放进row
                row.index = rowIndex;
            },
            //选中行
            rowClick(row) {
                const index = row.index;
                this.$refs.multipleTable.toggleRowSelection(this.memberListData[index]);

            },
            //选中改变
            selectionChange(selection) {
                this.indexList = [];
                selection.forEach(k => {
                    this.indexList.push(k.id)
                })
                if (selection.length > 0) {
                    this.member = selection[selection.length - 1]
                    this.member.gender === 0 ? this.member.gender = "男" : this.member.gender = "女";
                    this.temporaryImg = this.member.memberImgUrl;
                } else {
                    this.emptyMember();
                }
            },
            //分页条
            handleSizeChange(size) {
                this.http(this.pageNo, size, this.keyWord);
            },
            //页码改变
            handleCurrentChange(currentPage) {
                this.http(currentPage, this.pageSize, this.keyWord);
            },
            //查询按钮
            memberSearch() {
                if (this.keyWord) {
                    this.http(this.pageNo, this.pageSize, this.keyWord);
                } else {
                    this.message("请输入查询条件!", "warning");
                }
            },
            //导出按钮
            exportMember() {
                window.location = '/ss/excel/getMemberList'
            },
            //打开新增
            memberAdd() {
                this.emptyMember();
                this.dialogTitle = "新增会员";
                this.memberDialog = true;
                this.$refs.multipleTable.clearSelection();
            },
            //表单确认
            memberSubmit() {
                if (this.dialogTitle === "新增会员") {
                    this.memberAddSubmit();
                } else {
                    this.memberEditSubmit();
                }

            },
            //新增提交
            memberAddSubmit() {
                this.member.memberImgUrl = this.temporaryImg;
                this.$http.post("/member/add", this.member
                )
                    .then(res => {
                        this.memberDialog = false;
                        this.message(res.message, "success")
                        if (res.code === 200) {
                            this.http(this.pageNo, this.pageSize, this.keyWord);
                        }

                    })
            },
            //打开编辑
            memberEdit() {
                if (this.member.registerPhone) {
                    this.uploadImg = this.member.memberImgUrl;
                    this.dialogTitle = "编辑会员";
                    this.memberDialog = true
                } else {
                    this.message("请选中需要编辑的数据!", "warning");
                }

            },
            //编辑提交
            memberEditSubmit() {
                if (this.temporaryImg) {
                    this.member.memberImgUrl = this.temporaryImg;
                }
                this.$http.put("/member/edit", this.member
                )
                    .then(res => {
                        this.memberDialog = false;
                        this.message(res.message, "success")
                        if (res.code === 200) {
                            this.http(this.pageNo, this.pageSize, this.keyWord);
                        }

                    })
            },
            //删除
            memberDelete() {
                if (this.indexList.length > 0) {
                    this.$confirm("您确定要删除选中的数据吗?","提示",{
                        type:"warning"
                    })
                        .then(() => {
                            this.$http.post("/member/delete", this.indexList
                            )
                                .then(res => {
                                    this.memberDialog = false;
                                    this.message(res.message, "success")
                                    if (res.code === 200) {
                                        this.http(this.pageNo, this.pageSize, this.keyWord);
                                    }

                                })
                        })
                        .catch(() => {
                        });

                } else {
                    this.message("请选中需要删除的数据!", "warning");
                }
            },
            //上传图片
            handleAvatarSuccess(res, file) {
                this.uploadImg = URL.createObjectURL(file.raw);
                this.temporaryImg = res;
            },
            //限制上传文件格式
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 6;
                return (isJPG || isPNG) && isLt2M;
            },
            //清空会员信息
            emptyMember() {
                this.member = {
                    registerPhone: null,
                    memberNickname: null,
                    gender: null,
                    memberImgUrl: null,
                    personSignature: null,
                    birthday: null
                }
                this.temporaryImg = this.member.memberImgUrl;
            },
            //信息提示
            message(message, type) {
                this.$message({
                    message: message,
                    center: true,
                    duration: 1000,
                    type: type
                });
            }
        }
    }

</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
</style>