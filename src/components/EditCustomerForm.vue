<template>
    <div class="edit-user-form">
        <h2>Редактирование персональных данных</h2>
        <form @submit.prevent="saveChanges">
            <label for="name">Имя:</label>
            <input type="text" v-model="editedUser.name" required>

            <label for="email">Email:</label>
            <input type="email" v-model="editedUser.email" required>

            <label for="phoneNumber">Телефон:</label>
            <input type="text" v-model="editedUser.phoneNumber" required>

            <label for="address">Адрес:</label>
            <input type="text" v-model="editedUser.address" required>

            <label for="currentPassword">Текущий пароль:</label>
            <input type="password" v-model="currentPassword" required>

            <button type="submit">Сохранить изменения</button>
            <button @click="closeForm">Закрыть без сохранения</button>
        </form>
    </div>
</template>
  
<script>
import apiClient from '@/service/apiService.ts'
import VueJwtDecode from 'vue-jwt-decode';
    export default {
        data () {
        return {
            editedUser: {
                id: null,
                name: '',
                email: '',
                phoneNumber: '',
                address: '',
                password: ''
            }
        }
        },
        methods: {
            saveChanges() {
                let token = localStorage.getItem('jwtToken');
                if (token) {
                    let decodedToken = VueJwtDecode.decode(token);
                    console.log(decodedToken);
                    let userData = {
                        id: decodedToken.Id,
                        role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
                    };
                    
                    console.log(userData.id)
                    console.log(this.currentPassword)
                    // Сравнение введенного текущего пароля с хэшированным паролем из базы данных
                    apiClient.post('/auth/verifyPassword', { 
                        id: userData.id,
                        password: this.currentPassword 
                    })
                        .then(response => {
                            if (response.status === 200) {
                                console.log('Пароль подтвержден');
                                // Создаем объект Customer из данных формы и данных из токена
                                let updatedCustomer = {
                                    id: this.editedUser.id,
                                    name: this.editedUser.name,
                                    email: this.editedUser.email,
                                    phoneNumber: this.editedUser.phoneNumber,
                                    address: this.editedUser.address,
                                    password: this.currentPassword,
                                    role: userData.role
                                };

                                // Отправляем объект Customer на сервер для обновления данных
                                apiClient.put(`Customer/UpdateCustomer/${updatedCustomer.id}`, updatedCustomer)
                                    .then(response => {
                                        // Успешное сохранение данных
                                        this.$emit('closeEditForm');
                                        this.$emit('dataUpdated');
                                    })
                                    .catch(error => {
                                        console.error('Ошибка при сохранении данных:', error);
                                        console.log('Дополнительная информация об ошибке:', error.response);
                                    });
                            } else {
                                console.error('Неверный текущий пароль');
                            }
                        })
                        .catch(error => {
                            console.error('Ошибка при проверке пароля:', error);
                        });
                } else {
                    console.error('Токен аутентификации не найден в localStorage');
                }
            },
        },
          closeForm() {
            this.$emit('closeEditForm'); 
        }
      }
  </script>
  
<style scoped>
  .edit-user-form {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    width: 300px;
    z-index: 999; /* Перемещаем модальное окно поверх остального контента */
  }
  
  input {
    padding: 8px;
    margin-bottom: 10px;
    width: 100%;
  }
</style>
  