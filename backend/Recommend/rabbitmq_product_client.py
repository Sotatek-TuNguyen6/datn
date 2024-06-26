# import pika
# import json
# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# RABBITMQ_URL = os.getenv('RABBITMQ_URL')
# REQUEST_QUEUE = 'productRequestQueue'
# RESPONSE_QUEUE = 'productResponseQueue'

# class RpcClient:
#     def __init__(self):
#         try:
#             print(f"Connecting to RabbitMQ at {RABBITMQ_URL}")
#             self.connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
#             self.channel = self.connection.channel()

#             # Declare the response queue
#             result = self.channel.queue_declare(queue=RESPONSE_QUEUE, durable=True)
#             print(f"Response queue: {RESPONSE_QUEUE}")

#             self.channel.basic_consume(
#                 queue=RESPONSE_QUEUE,
#                 on_message_callback=self.on_response,
#                 auto_ack=True
#             )
#         except Exception as e:
#             print(f"Error initializing RpcClient: {e}")

#     def on_response(self, ch, method, props, body):
#         try:
#             print("Response received")
#             self.response = json.loads(body)
#         except Exception as e:
#             print(f"Error in on_response: {e}")

#     def call(self, queue, message):
#         try:
#             self.response = None
#             print(f"Sending request to queue: {queue}")
#             self.channel.basic_publish(
#                 exchange='',
#                 routing_key=queue,
#                 properties=pika.BasicProperties(
#                     reply_to=RESPONSE_QUEUE
#                 ),
#                 body=json.dumps(message)
#             )
#             while self.response is None:
#                 self.connection.process_data_events()
#             return self.response
#         except Exception as e:
#             print(f"Error in call method: {e}")

# def send_and_receive_all_products():
#     try:
#         rpc_client = RpcClient()
#         print("Requesting all products...")
#         response = rpc_client.call(REQUEST_QUEUE, {})
#         print(response)

#         if response:
#             with open('response.json', 'w') as f:
#                 json.dump(response, f, indent=4)
#             print("Response written to response.json")
        
#         if response and 'data' in response:
#             df_items_data = response['data']
#             print(df_items_data)
#         return response
#     except Exception as e:
#         print(f"Error in send_and_receive_all_products: {e}")
#         return None
# send_and_receive_all_products()

import pika
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

RABBITMQ_URL = os.getenv('RABBITMQ_URL')

class RpcClient:
    def __init__(self, response_queue):
        try:
            print(f"Connecting to RabbitMQ at {RABBITMQ_URL}")
            self.connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
            self.channel = self.connection.channel()

            # Declare the response queue
            result = self.channel.queue_declare(queue=response_queue, durable=True)
            print(f"Response queue: {response_queue}")

            self.channel.basic_consume(
                queue=response_queue,
                on_message_callback=self.on_response,
                auto_ack=True
            )
        except Exception as e:
            print(f"Error initializing RpcClient: {e}")

    def on_response(self, ch, method, props, body):
        try:
            print("Response received")
            self.response = json.loads(body)
        except Exception as e:
            print(f"Error in on_response: {e}")

    def call(self, queue, message):
        try:
            self.response = None
            print(f"Sending request to queue: {queue}")
            self.channel.basic_publish(
                exchange='',
                routing_key=queue,
                properties=pika.BasicProperties(
                    reply_to=response_queue
                ),
                body=json.dumps(message)
            )
            while self.response is None:
                self.connection.process_data_events()
            return self.response
        except Exception as e:
            print(f"Error in call method: {e}")

def send_and_receive_all_products(request_queue, response_queue, file):
    try:
        rpc_client = RpcClient(response_queue)
        print("Requesting all products...")
        response = rpc_client.call(request_queue, {})
        # print(response)

        if response:
            with open(file, 'w') as f:
                json.dump(response, f, indent=4)
            print("Response written to response.json")
        
        if response and 'data' in response:
            df_items_data = response['data']
            # print(df_items_data)
        return response
    except Exception as e:
        print(f"Error in send_and_receive_all_products: {e}")
        return None

# Example of how to call the function with custom queue names
# request_queue = "actionsRequestQueue"
response_queue = "actionsResponseQueue"
# file = "actions"
# send_and_receive_all_products(request_queue, response_queue, file)
