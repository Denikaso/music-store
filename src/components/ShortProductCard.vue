<template>
  <div class="short-product-card">
    <img :src="product.picture" alt="Product Image" class="product-image">
    <h4>{{ product.title }}</h4>
    <p>{{ product.price }} ₽</p>
    <button @click="showFullProductInfo">Подробнее</button>
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

<style>
.short-product-card {
  width: 250px;
  margin: 10px;
  padding: 15px;
  border: 1px solid #ccc;
  text-align: center; /* Центрируем содержимое */
}

.product-image {
  max-width: 100%; /* Максимальная ширина для изображения */
  height: auto; /* Автоматическое масштабирование по высоте */
}

</style>
