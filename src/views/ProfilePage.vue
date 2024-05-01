<template>
    <div class="profile-page">
      <h1>Личный кабинет</h1>

      <div class="user-info">
        <p><strong>Имя:</strong> {{ customer.name }}</p>
        <p><strong>Email:</strong> {{ customer.email }}</p>
        <p><strong>Телефон:</strong> {{ customer.phone }}</p>
        <p><strong>Адрес:</strong> {{ customer.address }}</p>
      </div>

      <!-- Кнопка перехода к корзине -->
      <button @click="goToCart">Перейти в корзину</button>

      <button @click="logout">Выйти</button> <!-- Добавление кнопки "Выйти" -->

      <!-- Место для вставки списка заказов (OrdersList) -->
      <orders-list :customerOrders="customer.orders"></orders-list>
    </div>
  </template>

<script>
import apiClient from '@/service/apiService.ts'
import VueJwtDecode from 'vue-jwt-decode';

export default {
  data () {
    return {
      customer: {
        name: '',
        email: '',
        phone: '',
        address: '',
        orders: []
      },
      customerId: null
    }
  },
  mounted () {
    console.log('Начало выполнения метода mounted')

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

    console.log('Завершение выполнения метода mounted')
  },
  methods: {
    async fetchUserData () {
      try {
        const response = await apiClient.get(`/Customer/GetCustomerById/${this.customerId}`)
        this.customer = response.data
        console.log('Информация о пользователе:', this.customer)
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
        phone: '',
        address: '',
        orders: []
      }
      // Удаление JWT токена из localStorage
      localStorage.removeItem('jwtToken')
      // Перенаправление на страницу входа
      this.$router.push('/')
    }
  }
}
</script>

  <style scoped>
    /* Стили для оформления страницы личного кабинета */
    .profile-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .user-info {
      margin-bottom: 20px;
    }
  </style>
