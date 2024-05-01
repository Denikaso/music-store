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
import apiClient from '@/service/apiService.ts'
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
      const productId = product.id
      console.log('Выбран продукт для перехода:', product)
      console.log('Идентификатор продукта для маршрутизации:', productId)
      this.$router.push({ name: 'Product', params: { productId: product.id } })
    }

  }
}
</script>

<style scoped>
.category-list {
  list-style-type: none;
}

.subcategory {
  margin-bottom: 20px;
  position: relative;
}

.category-list .subcategory {
  display: block; /* Располагаем каждую подкатегорию на отдельной строке */
  margin-bottom: 10px; /* Добавляем отступ между подкатегориями */
}

.product-list {
  display: flex;
  flex-wrap: wrap;
}

.no-products {
  margin-top: 10px;
}

.subcategory h3 {
  font-size: 2.1em; /* Устанавливаем нужный размер шрифта (например, 1.5em) */
  border-bottom: 4px solid #13385d; /* Добавляем подчеркивание */
  margin-bottom: 10px; /* Отступ подчеркивания от текста */
}

p {
  font-size: 2em; /* Устанавливаем нужный размер шрифта (например, 1.5em) */
  color: #13385d;
}

</style>
