<template>
  <div class="orders-list">
    <div v-for="order in ordersData" :key="order.id" class="order-item">
      <h3>
        Заказ №{{ order.id }} -
        <span :class="statusClass(order.status)">{{ getStatusText(order.status) }}</span>
      </h3>
      <p><strong>Дата заказа:</strong> {{ formatOrderDate(order.date) }}</p>
      <div v-if="order.orderItems && order.orderItems.length > 0" class="order-items-container">
        <div v-for="item in order.orderItems" :key="item.id" class="order-item-details">
          <router-link :to="{ name: 'Product', params: { productId: item.productId }}" class="product-link">
            <p class="product-name">{{ item.productName }}</p>
          </router-link>
          <p class="product-quantity">Количество: {{ item.quantity }}</p>
        </div>
      </div>
      <div v-else>
        Загрузка информации о заказе...
      </div>
      <div class="payment-info" v-if="order.paymentInfo">
        <p><strong>Информация о платеже:</strong> {{ order.paymentInfo }}</p>
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
  data() {
    return {
      ordersData: []
    };
  },
  computed: {
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
    formatOrderDate(date) {
      const parsedDate = new Date(date);
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
      return parsedDate.toLocaleDateString('ru-RU', options);
    },
    async fetchOrderItemsForOrder(order) {
      try {
        console.log('Fetching order items for order id:', order.id);

        const response = await apiClient.get(`/OrderItem/GetOrderItemsByOrder/${order.id}`);
        const orderItems = response.data;

        for (let i = 0; i < orderItems.length; i++) {
          const productResponse = await apiClient.get(`/Product/GetProductById/${orderItems[i].productId}`);
          orderItems[i].productName = productResponse.data.title;
        }

        const updatedOrders = this.ordersData.map((ord) => {
          if (ord.id === order.id) {
            return { ...ord, orderItems: orderItems };
          }
          return ord;
        });

        console.log('Updated orders:', updatedOrders);

        this.ordersData = updatedOrders;
        this.$emit('update-customer-orders', updatedOrders);

        console.log('Successfully fetched order items for order id:', order.id);
      } catch (error) {
        console.error('Error while fetching order items for order id:', order.id, error);
      }
    },
    async fetchData() {
      try {
        console.log('Fetching orders...');

        if (this.customerOrders) {
          this.ordersData = this.customerOrders;
          this.customerOrders.forEach(order => this.fetchOrderItemsForOrder(order));
        } else {
          console.error('No customer orders provided.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
  },
  watch: {
  customerOrders: {
    immediate: true,
    handler(newVal) {
      if (newVal) {
        this.fetchData();
      }
    }
  },
  mounted() {
    console.log('Component mounted');
  }
}

}

</script>
  
<style scoped>
.orders-list {
  margin-top: 20px;
}

.order-item {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.order-items-container {
  margin-top: 10px;
}

.order-item-details {
  margin-top: 10px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

.product-name {
  font-weight: bold;
}

.product-quantity {
  color: #333;
}

.product-quantity.noclick {
  text-decoration: none;
  cursor: default;
}

.payment-info {
  margin-top: 10px;
  background-color: #f0f0f0;
  padding: 10px;
}

.awaiting-payment {
  color: orange;
}

.paid-delivering {
  color: green;
}

.completed {
  color: blue;
}
</style>
  