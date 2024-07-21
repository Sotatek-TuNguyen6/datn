import pika
import json
import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv('RABBITMQ_URL')

def connect_rabbitmq():
    # rabbitmq_url = os.getenv('RABBITMQ_URL', 'amqp://localhost')
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue='recommend_queue', durable=True)
    return connection, channel

def publish_to_queue(queue_name, message):
    connection, channel = connect_rabbitmq()
    try:
        channel.basic_publish(exchange='', routing_key=queue_name, body=json.dumps(message))
        logger.info(f"Message sent to queue: {queue_name}")
    except Exception as error:
        logger.error(f"Error publishing to queue: {queue_name} - {error}")
    finally:
        channel.close()
        connection.close()

def consume_queue(queue_name, callback):
    connection, channel = connect_rabbitmq()
    try:
        def _callback(ch, method, properties, body):
            message_content = json.loads(body)
            logger.info(f"Message received from queue: {queue_name}")
            callback(message_content)
            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_consume(queue=queue_name, on_message_callback=_callback, auto_ack=False)
        logger.info(f"Started consuming queue: {queue_name}")
        channel.start_consuming()
    except Exception as error:
        logger.error(f"Error consuming queue: {queue_name} - {error}")
        raise error
    finally:
        channel.close()
        connection.close()