import pika
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

RABBITMQ_URL = os.getenv('RABBITMQ_URL')
REQUEST_QUEUE = 'productRequestQueue'
RESPONSE_QUEUE = 'productResponseQueue'

class RpcClient:
    def __init__(self):
        try:
            print(f"Connecting to RabbitMQ at {RABBITMQ_URL}")
            self.connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
            self.channel = self.connection.channel()

            # Declare the response queue
            result = self.channel.queue_declare(queue=RESPONSE_QUEUE, durable=True)
            print(f"Response queue: {RESPONSE_QUEUE}")

            self.channel.basic_consume(
                queue=RESPONSE_QUEUE,
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
                    reply_to=RESPONSE_QUEUE
                ),
                body=json.dumps(message)
            )
            while self.response is None:
                self.connection.process_data_events()
            return self.response
        except Exception as e:
            print(f"Error in call method: {e}")

def fetch_data(REQUEST_QUEUE, RESPONSE_QUEUE, message):
    try:
        rpc_client = RpcClient()
        response = rpc_client.call(REQUEST_QUEUE, message)
        print(response)
        return response
    except Exception as e:
        print(f"Error in fetch_data: {e}")
        return None