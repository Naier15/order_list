<template>
    <td class="col-1" @click="$emit('showEdit', order)">{{ index }}</td> 
    <td class="col-6" @click="$emit('showEdit', order)">{{ name }}</td> 
    <td class="col-1" @click="$emit('showEdit', order)">{{ (category != null) ? category.name : "" }}</td> 
    <td class="col-1 datetime" @click="$emit('showEdit', order)">{{ this.datePrettier(date) }}</td>
    <td class="col-3" @click="$emit('showEdit', order)">
        <img class="file" v-if="image" :src="$store.state.static + image + '.jpg'" alt="img"/>
    </td>
</template>

<script>
export default {
    name: 'Row',
    props: {
        index: {
            type: Number,
            require: true
        },
        name: {
            type: String,
            require: true,
            validator(value) {
                return value.length !== 0
            }
        },
        category: {
            type: Object,
            require: false
        },
        date: {
            type: String,
            require: true
        }, 
        image: {
            type: String,
            require: false
        }, 
        showEdit: {
            type: Function
        },
        order: {
            type: Object
        }
    },
    methods: {
        datePrettier(date) {
            return new Date(date).toLocaleDateString('ru', { 
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
            }) 
        },
    }
}
</script>

<style scoped>
.datetime {
    font-size: smaller;
    vertical-align: middle;
}
.file{
    max-height: 70px;
}
.button {
    padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
}
td {
    vertical-align: middle;
}
</style>