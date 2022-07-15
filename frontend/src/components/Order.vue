<template>
<h2 v-if="create">Новый заказ</h2>
<h2 v-if="edit">Редактирование заказа</h2>
<form @submit.prevent enctype="multipart/form-data" >
    <div class="order-form">
        <div class="order-info">
            <input class="input" 
                v-model="title" 
                placeholder="Название заказа" 
                type="text"/>
            <select class="input form-select" 
                placeholder="Категория" 
                v-model="selected">
                <option aria-disabled="Категория заказа" disabled>Категория заказа</option>
                <option value="Основная">Основная</option>
                <option value="Сезонная">Сезонная</option>
                <option value="Целевая">Целевая</option>
                <option value="Сервисная">Сервисная</option>
            </select>
            <label 
                v-if="edit"
                class="col-form-label label">
                {{this.datePrettier(order.createdAt)}}
            </label>
        </div>
        <div class="order-info">
            <input class="input-file"
                @change="fileSelected"
                id="input-file"
                name="photo" 
                type="file"
                accept="image/*" />
            <img class="file" :src="url" alt="img"/>
            <label for="input-file"
                class="btn btn-outline-secondary input-file-button">
                Выберите файл
            </label>
        </div>
    </div>
    <div class="my-btn">
        <button class="btn btn-outline-primary"
            v-if="create"  
            @click="createOrder" 
            type="submit" 
            value="Создать"
            >Создать</button>
        <button class="btn btn-outline-primary"
            v-if="edit" 
            @click="editOrder" 
            type="submit" 
            value="Изменить"
            >Изменить</button>
        <button class="btn btn-outline-danger"
            v-if="edit" 
            @click="orderDone" 
            type="submit" 
            value="Удалить"
            >Удалить</button>
    </div>
</form>
</template>

<script>
import store from '@/store'
import axios from 'axios'
const defaultImg = require('@/../public/assets/none.jpg')

export default {
    name: 'Order',
    props: {
        create: {
            type: Boolean,
            default: false
        },
        edit: {
            type: Boolean,
            default: false
        },
        order: {
            type: Object
        }
    },
    data() {
        return {
            title: '',
            selected: '',
            image: null,
            url: defaultImg,
            changed: false
        }
    },
    methods: {
        async createOrder() {
            try {
                const task = new Promise( async (res, rej) => {
                    const url = this.url.split('/')
                    const newOrder = {
                        name: this.title, 
                        image: (this.changed) ? url[url.length-1] : '',
                        category: this.selected
                    }
                    console.log(newOrder)
                    await axios.post(`${store.state.host}/order`, newOrder)
                
                    if (this.changed){
                        const fd = new FormData()
                        fd.append('image', this.image, this.url)
                        await axios.post(`${store.state.host}/upload`, fd)
                    }
                    res()
                })
                    .then( () => {store.dispatch('getOrderList')})
                    .catch(err => rej(err))
                
                this.$parent.$emit('update:show', false)

                // const response = await axios.get(`${store.state.host}/last-order`)
                // store.commit('addOrder', response.data)
                
            } catch (err){
                console.log(err)
            }
        },

        async editOrder() {
            const id = this.order.id

            const url = this.url.split('/')
            const newOrder = {
                    name: this.title, 
                    image: (this.changed) ? url[url.length-1] : '',
                    category: this.selected
                }
            console.log(newOrder)
            await axios.put(`${store.state.host}/order/${id}`, newOrder)

            if (this.changed){
                const fd = new FormData()
                fd.append('image', this.image, this.url)
                await axios.post(`${store.state.host}/upload`, fd)
            }
            store.dispatch('getOrderList')

            this.$parent.$emit('update:show', false)
        },

        async orderDone(){
            const id = this.order.id
            await axios.put(`${store.state.host}/order/${id}/done`)
            store.dispatch('getOrderList')
            this.$parent.$emit('update:show', false)
        },

        fileSelected(event) {
            this.changed = true;
            this.image = event.target.files[0]
            this.url = URL.createObjectURL(this.image);
        },
        updated(){
            this.title = this.order.name
            this.selected = (this.order.category) ? this.order.category.name : ''
            this.changed = false
            if (this.order.image){
                this.url = store.state.static + this.order.image + '.jpg'
            } else {
                this.url = defaultImg
            }
        },
        datePrettier(date) {
            return new Date(date).toLocaleDateString('ru', { 
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
            }) 
        }
        
    },
    mounted(){
        if (this.edit){
            this.updated()
        }
    }
}

</script>

<style scoped>
.order-form {
    display: flex;
    flex-direction: row;
    margin: 15px;
    max-width: 100%;
}
.order-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.input {
    margin: 10px;
    max-width: max-content;
}
.my-btn {
    display: flex;
    justify-content: space-around;
    margin: 10px 20%;
}
.input-file {
  opacity: 0;
  visibility: hidden;
  position: absolute;
}
 
.input-file-button {
  align-self: flex-end;
  padding: 1px 3px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 auto;
}
.file {
    justify-self: center;
    height: 100px;
    margin-bottom: 10px;
}
h2 {
    margin: 0px auto;
    padding: 10px;
    background-color: rgb(184, 220, 232);
    border-radius: 30px 30px 0 0;
}
</style>