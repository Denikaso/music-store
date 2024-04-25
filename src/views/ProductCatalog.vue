<template>
    <div>
      <ul class="category-list">
        <li v-for="subcategory in subcategories" :key="subcategory.id" class="subcategory">
          <h3>{{ subcategory.title }}</h3>
          <div class="product-list" v-if="products[subcategory.id] && products[subcategory.id].length">
            <ShortProductCard
              v-for="product in products[subcategory.id]"
              :key="product.id"
              :product="product"
              @showFullProductInfo="showFullProductInfo"
            />
          </div>
          <div v-else>
            <p>Извините, подобных товаров в данный момент нет</p>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
import apiClient from '@/service/apiService.js'
import { ref } from 'vue' // Убираем ненужные импорты
import ShortProductCard from '@/components/ShortProductCard.vue'

export default {
  components: {
    ShortProductCard
  },
  data () {
    return {
      subcategories: [],
      products: {},
      selectedCategory: null,
      selectedProduct: null
    }
  },
  async mounted () {
    this.selectedCategory = this.$route.params.categoryId
    await this.fetchData()
  },
  watch: {
    '$route.params.categoryId': {
      immediate: true,
      handler (value) {
        this.selectedCategory = value
        this.fetchData()
      }
    }
  },
  methods: {
    async fetchData () {
      try {
        const response = await apiClient.get(`/Subcategory/GetSubcategoriesByCategory/${this.selectedCategory}`)
        this.subcategories = response.data
        for (const subcategory of this.subcategories) {
          const productsResponse = await apiClient.get(`/Product/GetProductsBySubcategory/${subcategory.id}`)
          this.products[subcategory.id] = productsResponse.data
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error)
      }
    },
    showFullProductInfo (product) {
      this.selectedProduct = product
      console.log('Выбранный продукт:', product)
      // Добавьте здесь логику для отображения подробной информации о продукте
    }
  }
}
</script>

<style>
.category-list {
  list-style-type: none;
}

.subcategory {
  margin-bottom: 20px;
  position: relative;
}

.subcategory-title {
  font-size: 1.2em;
}

.category-underline {
  border-bottom: 1px solid black; /* Добавляем подчеркивание */
  margin-bottom: 10px; /* Отступ подчеркивания от текста */
}

.product-list {
  display: flex;
  flex-wrap: wrap;
}

.no-products {
  margin-top: 10px;
}

</style>
