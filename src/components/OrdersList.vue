<template>
    <div class="orders-list">
      <h2>Список заказов</h2>
    
      <div v-for="order in formattedOrders" :key="order.id" class="order-item">
        <h3>Заказ №{{ order.id }} - <span :class="statusClass(order)">{{ getStatusText(order.status) }}</span></h3>
        <p><strong>Дата заказа:</strong> {{ order.date }}</p>
    
        <div v-for="item in order.orderItems" :key="item.id" class="order-item-details">
          <router-link :to="{ name: 'Product', params: { productId: item.productId }}" class="product-link">
            <p><strong>Товар:</strong> {{ item.productName }}</p>
            <p><strong>Количество:</strong> {{ item.quantity }}</p>
          </router-link>
        </div>

      </div>
    </div>
  </template>
  
<script>
import apiClient from '@/service/apiService.ts'

export default {
  props: {
    customerOrders: Array
  },
  watch: {
    customerOrders: {
      handler: 'fetchOrderItemsForAllOrders',
      immediate: true 
    }
  },
  computed: {
    formattedOrders() {
      if (!this.customerOrders) {
        return [];
      }

      return this.customerOrders.map(order => {
        return {
          id: order.id,
          status: order.status,
          date: order.date,
          orderItems: order.orderItems,
          paymentInfo: order.paymentInfo
        };
      });
    },
    statusClass() {
      return function (order) {
        switch (order.status) {
          case 1:
            return 'awaiting-payment'; 
          case 2:
            return 'paid-delivering';
          case 3:
            return 'completed'; 
          default:
            return '';
          }
        }
    },
  },
  methods: {
    getStatusText(status) {
      switch (status) {
        case 1:
          return 'Ждет оплаты';
        case 2:
          return 'Оплачен/в доставке';
        case 3:
          return 'Завершен';
        default:
          return 'Статус неизвестен';
      }
    },    
    async fetchOrderItems(orderId) {
      try {
          console.log('Fetching order items for order ID:', orderId);

          const response = await apiClient.get(`/OrderItem/GetOrderItemsByOrder/${orderId}`);
          console.log('Received order items response:', response.data); // Логирование полученных данных

          const orderItems = response.data;

          for (let i = 0; i < orderItems.length; i++) {
            const productResponse = await apiClient.get(`/Product/GetProductById/${orderItems[i].productId}`);
            console.log('Received product response for product ID:', orderItems[i].productId, productResponse.data); // Логирование данных о продукте

            orderItems[i].productName = productResponse.data.title; // Добавляем название продукта в позицию заказа
          }

          console.log('Processed order items:', orderItems); // Логирование обработанных данных

          return orderItems;
      } catch (error) {
        console.error('Error while fetching order items:', error);
        return [];
      }
    },
    async fetchOrderItemsForAllOrders() {    
      console.log('Start fetching order items for all orders');  
      for (const order of this.formattedOrders) {
        console.log('Fetching order items for order ID:', order.id);
        order.orderItems = await this.fetchOrderItems(order.id);
      }
      console.log('All order items fetched:', this.formattedOrders);
    }
  },
  async mounted() {
    await this.fetchOrderItemsForAllOrders();
  }
}

</script>
  
  <style scoped>
  .orders-list {
    margin-top: 20px;
  }
  
  .order-item {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  
  .order-item-details {
    margin-top: 10px;
    border-top: 1px solid #ccc;
    padding-top: 10px;
  }
  
  .payment-info {
    margin-top: 10px;
    background-color: #f9f9f9;
    padding: 10px;
  }
  .awaiting-payment {
  color: orange; /* Цвет для статуса "Ждет оплаты" */
}

.paid-delivering {
  color: green; /* Цвет для статуса "Оплачен/в доставке" */
}

.completed {
  color: blue; /* Цвет для статуса "Завершен" */
}
  </style>
  