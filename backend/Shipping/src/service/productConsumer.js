const { consumeQueue, publishToQueue, consumeFromExchange } = require('../utils/amqp');
const logger = require('../utils/logger');
const amqp = require('amqplib');


const processOrderInfo = (shippingList) => {
  const orderResponse = shippingList.map(shipping => ({
    orderId: shipping.id,
    status: 'Processed',
    shippingDetails: shipping
  }));
  
  console.log('OrderResponse:', orderResponse);
  return orderResponse;
};

consumeFromExchange('orderInfo', 'orderQueue', 'order_info', processOrderInfo);

// consumeQueue('productRequestQueue', handleProductGetAll);
// consumeQueue('productDetailsRequestQueue', handleProductDetailsRequest);
// logger.info("Consumer for productDetailsRequestQueue has started.");

