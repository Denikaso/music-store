<script>
import apiClient from '@/service/apiService.ts'

export default {
  data () {
    return {
      sections: [],
      categories: [],
      activeSection: null,
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    }
  },
  mounted() {
    this.fetchSections();
    this.fetchCategories();
  },
  methods: {
    async fetchSections() {
      try {
        const response = await apiClient.get('/Section/GetSections');
        this.sections = response.data;
      } catch (error) {
        console.error('Ошибка при получении секций:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await apiClient.get('/Category/GetCategories');
        this.categories = response.data;
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    },
    showCategories(sectionId) {
      this.activeSection = sectionId;
    },
    navigateToCategory(categoryId) {
      this.$router.push(`/category/${categoryId}`);
    },
    navigateToLoginPage() {
      this.isAuthenticated ? this.$router.push('/profile') : this.$router.push('/login');
    }
  }
}
</script>

<template>
  <header>
    <nav>
      <ul>
        <li v-for="section in sections" :key="section.id">
          <a href="#" @mouseover="showCategories(section.id)">
            <i class="fas fa-home"></i>  {{ section.title }}
          </a>
          <ul v-if="activeSection === section.id">
            <li v-for="category in categories" :key="category.id">
              <a v-if="category.sectionId === section.id" href="#" @click.prevent="navigateToCategory(category.id)">
                {{ category.title }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <a class="login-button" @click.prevent="navigateToLoginPage">
      {{ isAuthenticated ? 'Личный кабинет' : 'Авторизация' }}
    </a>
  </header>
</template>

<style scoped>
header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень */
}

header nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  margin-bottom: 15px;
}

header nav ul li {
  position: relative;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
}

header nav ul li a {
  display: block;
  padding: 10px;
  text-decoration: none;
  transition: background-color 0.3s ease; /* Плавное изменение цвета */
}

header nav ul li ul {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border: 1px solid #ccc
}

header nav ul li a:hover,
header nav ul li ul li a:hover {
  background-color: #e9ecef; /* Светло-серый фон при наведении */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень при наведении */
}

header nav ul li:hover ul {
  display: block;
  background-color: #e9ecef; /* Светло-серый фон при наведении */
}

.login-button {
  display: block;
  padding: 20px 25px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  position: absolute; /* Позиционирование кнопки */
  right: 60px; /* Отступ справа */
  top: 20px; /* Отступ сверху */
  font-size: 1.4em; /* Устанавливаем нужный размер шрифта (например, 1.5em) */
  cursor: pointer;
}

header nav ul li a {
  font-size: 1.8em; /* Устанавливаем нужный размер шрифта (например, 1.5em) */
}

header nav ul li a {
  font-size: 1.3em; /* Устанавливаем нужный размер шрифта (например, 1.5em) */
}
header nav ul li ul li a {
  font-size: 1.06em; /* Устанавливаем нужный размер шрифта (например, 1.5em) */
}
</style>
