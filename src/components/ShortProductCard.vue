<template>
  <div class="short-product-card">
    <div class="short-product-image-wrapper">
      <img :src="product.picture" alt="Product Image" class="short-product-image">
    </div>
    <h4 class="product-title">{{ product.title }}</h4>
    <p class="product-price">{{ product.price }} ₽</p>
    <button @click="showFullProductInfo" class="product-button">Подробнее</button>
  </div>
</template>

<script>
export default {
  props: ['product'],
  methods: {
    showFullProductInfo () {
      this.$emit('showFullProductInfo', this.product)
    }
  }
}
</script>

<style scoped>

.short-product-card {
  width: 300px;
  margin: 10px;
  padding: 15px;
  border: 0.5px solid #7d7d7d;
  text-align: center; /* Центрируем содержимое */
}

.short-product-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 37px; /* Задаем скругленные углы */
}

.short-product-image {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 300;
}

.product-button {
  background-color: #007bff;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.4em;
  margin-top: 10px;
}

.product-title {
  font-size: 1.8em; /* Увеличиваем размер шрифта названия */
  margin-bottom: 10px; /* Добавляем отступ после названия */
}

.product-price {
  font-size: 1.7em; /* Увеличиваем размер шрифта цены */
  color: #007bff; /* Цвет цены */
}
</style>
