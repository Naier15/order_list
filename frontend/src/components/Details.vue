<template>
    <div class="edit" v-if="show" @click="$emit('update:show', false)">
        <div @click="e => e.stopImmediatePropagation()" class="edit-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Details',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
    }
}
</script>

<style scoped>
.edit {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
}
.edit-content {
    margin: auto;
    background-color: aliceblue;
    border-radius: 30px;
}
</style>