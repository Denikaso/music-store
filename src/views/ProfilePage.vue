<template>
  <div class="profile-page">
    <div class="title-box">
      <h1 class="page-title">Личный кабинет</h1>
    </div>

    <div class="profile-content">
      <div class="user-info-section">
        <h2 class="section-title">Персональные данные</h2>
        <div class="user-info-block">
          <div class="user-info">
            <p><strong>Имя:</strong> {{ customer.name }}</p>
            <p><strong>Email:</strong> {{ customer.email }}</p>
            <p><strong>Телефон:</strong> {{ customer.phoneNumber }}</p>
            <p><strong>Адрес:</strong> {{ customer.address }}</p>
          </div>
          <div class="buttons-container">
            <button class="edit-button" @click="editUser">✏️ Редактировать</button>
            <button class="logout-button" @click="logout">Выйти</button>
          </div>
        </div>
      </div>

      <div class="orders-section">
        <h2 class="section-title">Список заказов</h2>
        <orders-list :customerOrders="customer.orders"></orders-list>
        <button class="cart-button" @click="goToCart">🛒 Перейти в корзину</button>
      </div>
    </div>
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
  background-image: linear-gradient(to bottom right, #9fd9fe, #ffd5c5); /* Градиентный фон */
  border-radius: 10px; /* Закругленные углы */
}

.page-title { 
  font-size: 1.5em;
  margin-bottom: 20px;
}

.profile-content {
  display: flex;
}

.title-box {
  background-color: #f9f9f9; /* Цвет прямоугольника вокруг заголовка */
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.user-info-section {
  flex: 1;
  margin-right: 20px;
  margin-bottom: 20px;
}

.orders-section {
  margin-bottom: 20px; 
}

.user-info-block {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.user-info {
  font-size: 1.1em;
}

.buttons-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.edit-button, .cart-button, .logout-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.edit-button:hover, .cart-button:hover, .logout-button:hover {
  opacity: 0.8;
}

.cart-button {
  background-color: #28a745;
}

.logout-button {
  background-color: #dc3545;
  margin-left: 10px;
}

.section-title {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #333;
  text-decoration: underline;
}
</style>
