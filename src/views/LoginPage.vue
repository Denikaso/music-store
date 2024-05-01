<template>
  <div class="login-container">
    <h2>Авторизация</h2>

    <form @submit.prevent="login" class="login-form">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required placeholder="Введите ваш email" style="width: 375px; padding: 12px; font-size: 16px;">

      <label for="password">Пароль:</label>
      <input type="password" id="password" v-model="password" required placeholder="Введите пароль" style="width: 375px; padding: 12px; font-size: 16px;">

      <div class="button-container">
        <button type="submit" class="login-button">Войти</button>
      </div>
    </form>

    <div class="registration-section">
      <p>Еще нет учетной записи? <button @click="redirectToRegistration" class="registration-button">Регистрация</button></p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/apiService.ts'

export default {  
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login () {
      try {
        const response = await apiClient.post('/auth/login', {
          email: this.email,
          password: this.password
        })

        if (response.status === 200) {
          const token = response.data.token // Получаем JWT токен из ответа сервера

          // Сохраняем токен в localStorage или в куках для последующего использования
          localStorage.setItem('jwtToken', token)

          console.log('Успешная авторизация')
          
          this.$store.commit('login');

          // Перенаправляем пользователя на защищенную страницу
          this.$router.push('/')
          
        } else {
          console.error('Ошибка авторизации')
        }
      } catch (error) {
        console.error('Произошла ошибка:', error)
      }
    },
    redirectToRegistration () {
      this.$router.push('/registration')
    }
  }
}
</script>

<style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 25px;
    border-radius: 10px;
    background-color: #f9f9f9;
    margin-top: 30px; /* Отступ сверху */
  }

  .login-form {
    display: flex;
    flex-direction: column;
  }

  form {
    width: 100%; /* Делаем форму занимающей всю ширину доступного контейнера */
  }

  input {
    padding: 12px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%; /* Ширина поля для ввода равна 100% относительно родительского контейнера */
    font-size: 16px; /* Размер шрифта */
    text-align: center; /* Выравниваем текст по центру внутри поля ввода */
  }

  label {
    font-size: 18px; /* Увеличиваем размер шрифта текста в лейблах */
  }

  h2 {
    font-size: 26px;
  }

  .button-container {
    margin-top: 10px;
  }

  button {
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    color: white;
    cursor: pointer;
  }

  .registration-section {
    margin-top: 20px;
    text-align: center;
  }

  .registration-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
  }
</style>
