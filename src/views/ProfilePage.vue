<template>
  <div class="profile-page">
    <h1>Личный кабинет</h1>
    
    <div class="user-info-container">
      <div class="user-info">
        <p><strong>Имя:</strong> {{ customer.name }}</p>
      </div>
      <div class="user-info">
        <p><strong>Email:</strong> {{ customer.email }}</p>
      </div>
      <div class="user-info">
        <p><strong>Телефон:</strong> {{ customer.phoneNumber }}</p>
      </div>
      <div class="user-info">
        <p><strong>Адрес:</strong> {{ customer.address }}</p>
      </div>
    </div>

    <button class="edit-button" @click="editUser">✏️ Редактировать</button>

    <orders-list :customerOrders="customer.orders"></orders-list>

    <button class="cart-button" @click="goToCart">🛒 Перейти в корзину</button>

    <button class="logout-button" @click="logout">Выйти</button>
  </div>
</template>

<script>
import apiClient from '@/service/apiService.ts'
import VueJwtDecode from 'vue-jwt-decode';
import OrdersList from '@/components/OrdersList.vue';

export default {
  components: {
    OrdersList, 
  },
  data () {
    return {
      customer: {
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        orders: []
      },
      customerId: null
    }
  },
  mounted () {
    const token = localStorage.getItem('jwtToken')
    console.log('Токен из localStorage:', token)

    if (token) {
      const decodedToken = VueJwtDecode.decode(token)
      console.log('Декодированный токен:', decodedToken)

      this.customerId = decodedToken.Id || decodedToken.id
      console.log('Идентификатор пользователя:', this.customerId)

      this.fetchUserData()
    } else {
      console.log('Токен не найден в localStorage')
    }
  },
  methods: {
    async fetchUserData () {
      try {
        const response = await apiClient.get(`/Customer/GetCustomerById/${this.customerId}`)
        this.customer = response.data
        console.log('Информация о пользователе:', this.customer)

        const ordersResponse = await apiClient.get(`Order/GetOrdersByCustomer/${this.customerId}`);
        this.customer.orders = ordersResponse.data;
        console.log('Список заказов пользователя:', this.customer.orders);
      } catch (error) {
        console.error('Ошибка при загрузке данных о пользователе:', error)
      }
    },
    goToCart () {
      this.$router.push('/cart')
    },
    logout () {
      // Сброс данных пользователя перед выходом
      this.customer = {
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        orders: []
      }
      // Удаление JWT токена из localStorage
      localStorage.removeItem('jwtToken')
      // Перенаправление на страницу входа
      this.$store.commit('logout');
      this.$router.push('/')      
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  font-size: 1.5em;
}

.user-info-container {
  display: flex;
  flex-direction: column; /* Основная информация в столбик */
  margin-bottom: 30px;
}

.user-info {
  padding: 20px;
  border: 2px solid #ddd;
  margin-bottom: 20px;
}

.edit-button {
  background: none;
  border: none;
  font-size: 1em;
  color: #007bff;
  cursor: pointer;
}

.cart-button {
  margin-top: 20px;
  background-color: #28a745;
  color: white;
}

.logout-button {
  margin-top: 20px;
  background-color: red;
  color: white;
}
</style>
