<template>
    <div class="mc-user-info">
    	{{name}}

    	<el-table-column  label="录入人" width="120">
            <template slot-scope="scope">
                <user-info :userId="scope.row.id"></user-info>
            </template>
		</el-table-column>

    </div>
</template>
<script>
    import {AjaxByAll} from '../../api/api'
    export default {
        data() {
            return {
                name: null,
                id:this.userId
            }
        },
        methods: {
            getUserName() {
               // alert(this.userId);
                //通过用户id查找用户名称
                AjaxByAll('get', '/rest/common/getData/sysOrgUserApiService?userId='+this.id, null).then(data => {
                    if (data.code === 200) {
                       this.name=data.data
                    }
                });
            }
        },
        watch: {

        },
        mounted: function () {
            this.getUserName();

        },
        props: {
            userId: String,
            required: true
        }
    }
</script>

<style>

</style>
