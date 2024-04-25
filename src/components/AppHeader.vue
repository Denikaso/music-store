<script>
import apiClient from '@/service/apiService.js'
import { useRouter } from 'vue-router'

export default {
  data () {
    return {
      sections: [],
      categories: [],
      activeSection: null
    }
  },
  mounted () {
    this.fetchSections()
    this.fetchCategories()
  },
  methods: {
    async fetchSections () {
      try {
        const response = await apiClient.get('/Section/GetSections')
        this.sections = response.data
      } catch (error) {
        console.error('Ошибка при получении секций:', error)
      }
    },
    async fetchCategories () {
      try {
        const response = await apiClient.get('/Category/GetCategories')
        this.categories = response.data
      } catch (error) {
        console.error('Ошибка при получении категорий:', error)
      }
    },
    showCategories (sectionId) {
      this.activeSection = sectionId
    },
    navigateToCategory (categoryId) {
      this.$router.push(`/category/${categoryId}`)
    }
  }
}
</script>

<template>
  <header>
    <nav>
      <ul>
        <li v-for="section in sections" :key="section.id">
          <a href="#" @mouseover="showCategories(section.id)">{{ section.title }}</a>
          <ul v-if="activeSection === section.id">
            <li v-for="category in categories" :key="category.id">
              <a v-if="category.sectionId === section.id" href="#" @click.prevent="navigateToCategory(category.id)">{{ category.title }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss">
header nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

header nav ul li {
  position: relative;
}

header nav ul li a {
  display: block;
  padding: 10px;
  text-decoration: none;
}

header nav ul li ul {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

header nav ul li:hover ul {
  display: block;
}
</style>
