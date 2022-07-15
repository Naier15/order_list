<template>
<Details v-model:show="createVisible">
    <Order :create="true" :order='selectedOrder'/>
</Details>
<Details v-model:show="editVisible" >
    <Order :edit="true" :order='selectedOrder'/>
</Details>
<div>
    <div v-if="!$store.state.loading" class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Загрузка...</span>
    </div>
    <div v-else-if="$store.state.orders.length > 0" class="container">
        <table class="table table-hover">
            <thead class="header-container"> 
                <tr class="header">
                  <th class="col-1">№</th> 
                  <th class="col-6">Заказ</th> 
                  <th class="col-1">Категория</th> 
                  <th class="col-1">Дата</th>
                  <th class="col-3">Фото</th>
                </tr> 
            </thead> 
            <tbody>
                <tr v-for="(order, index) in $store.state.orders" :key="order.id"> 
                    <Row 
                        @showEdit="showEdit"
                        :index='++index' 
                        :name='order.name'
                        :category="order.category"
                        :date='order.createdAt'
                        :image='order.image'
                        :order='order'
                    />
                </tr>
            </tbody>
        </table>
    </div>
    <h2 v-else>Список пока пуст</h2> 
</div>
<button v-if="$store.state.loading" @click="showDetails" class="btn btn-outline-primary fixed-btn">Создать заказ</button>
</template>

<script>
import Details from '@/components/Details.vue'
import Order from '@/components/Order.vue'
import Row from '@/components/Row.vue'
import store from '@/store'


export default {
  name: 'Table',
  components: {
    Details, Row, Order
  },
  data() {
    return {
        createVisible: false,
        editVisible: false,
        selectedOrder: null
    }
  },
  methods: {
    showDetails() {
      this.createVisible = true
    },
    showEdit(order){
      this.selectedOrder = order
      this.editVisible = true
    },
  },
  created() {
    store.dispatch('getOrderList')
  }
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0px;
  background-color: rgba(122, 214, 247, 0.755);
}
.my-btn {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.fixed-btn {
  bottom: 20px;
  left: 25%;
  right: 25%;
  margin: 0 auto;
  max-width: 300px;
  position: fixed;
}
.icon {
  border: 2px dotted black;
  border-radius: 50px;
  padding: 2px;
  max-width: 65px;
  min-width: 25px;
  width: 50%;
}
h2 {
    width: 50%;
    margin: 0 auto;
}
</style>
