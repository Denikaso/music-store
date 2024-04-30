<template>
  <div class="product-card" v-if="localProduct.id">
    <div class="product-image">
      <img :src="localProduct.picture" :alt="localProduct.title">
    </div>
    <div class="product-details">
      <h2>{{ localProduct.title }}</h2>
      <p>{{ localProduct.description }}</p>
      <hr>
      <p>{{ localProduct.price }} ₽</p>
      <div class="rating center-content">
        <span>{{ roundToTenth(localProduct.rating) }}</span>
        <span v-for="n in 5" :key="n">
          <span v-if="n <= Math.floor(roundToTenth(localProduct.rating))">★</span>
          <span v-else-if="n - 0.5 === roundToTenth(localProduct.rating)">★</span>
          <span v-else>☆</span>
        </span>
      </div>
      <hr>
      <div class="quantity-selector center-content">
        <input type="number" v-model="quantity" min="1">
        <button @click="addToCart">Добавить в корзину</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Продукт не найден</p>
  </div>
</template>

<script>
import apiClient from '@/service/apiService.js'

export default {
  props: ['productId'],
  data () {
    return {
      localProduct: {
        id: 0,
        subcategoryId: 0,
        subcategory: {},
        title: '',
        description: '',
        price: 0,
        unitsInCart: 0,
        unitsInStock: 0,
        rating: 0,
        picture: ''
      },
      quantity: 1
    }
  },
  mounted () {
    this.fetchProductInfo(this.productId)
  },
  methods: {
    async fetchProductInfo (productId) {
      try {
        const response = await apiClient.get(`/Product/GetProductById/${productId}`)
        this.localProduct = response.data
        console.log('Информация о продукте успешно загружена:', this.localProduct)
      } catch (error) {
        console.error('Ошибка при загрузке информации о продукте:', error)
      }
    },
    roundToTenth (rating) {
      return Math.round(rating * 10) / 10
    },
    addToCart () {
      // Логика добавления товара в корзину
      console.log('Товар добавлен в корзину:', this.product, 'Количество:', this.quantity)
    }
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  align-items: flex-start;
  border: 1px solid #ccc;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.product-image {
  width: 40%;
  margin-right: 5px;
  border-radius: 80px; /* Добавляем скругленные углы для изображения */
  overflow: hidden; /* Добавляем, чтобы изображение не выходило за пределы рамки */
}

.product-image img {
  width: 100%;
  height: auto;
}

.product-details {
  width: 65%;
  text-align: center;
}

.product-details h2 {
  font-size: 3.1em;
  margin-bottom: 30px;
  font-family: 'Open Sans', serif;
}

.product-details p {
  font-size: 1.6em;
  margin-bottom: 15px;
  font-family: 'Open Sans', sans-serif;
}

.product-details hr {
  border: none;
  border-top: 3px solid #eee;
  margin: 15px 0;
}

.product-details p:nth-child(3) {
  font-size: 1.6em;
  font-weight: bold;
  color: #007bff;
}

.rating {
  margin-bottom: 10px;
  color: #f8e71c;
  background-color: #f5f5f5;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 1.1em;
}

.rating span:first-child {
  margin-right: 10px;
  color: #333;
  font-size: 1.1em;
}

.half-star {
  color: #f8e71c;
  position: relative;
}

.half-star::after {
  content: '★';
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  overflow: hidden;
}

.center-content {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.quantity-selector {
  display: flex;
  align-items: center;
}

.quantity-selector input {
  width: 80px;
  height: 35px;
  font-size: 1.3em;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.product-details button {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  font-size: 1.4em;
}
</style>
