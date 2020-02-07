<template>
    <div>
        {{msg}}
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            msg: '学习'
        }
    }
})
</script>