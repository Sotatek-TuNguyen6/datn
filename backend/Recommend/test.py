import json
from rabbitmq_product_client import RpcClient
from models import RecommenderSystem
from rabbitmq_product_client import consume_from_exchange

def handle_message(message):
    
    # Assuming message contains both product data and action data
    product_data = message.get('products')
    action_data = message.get('actions')
    
    recommender = RecommenderSystem(product_data, action_data)
    # Example usage: Replace with your actual logic
    user_id = 'example_user_id'
    recommendations = recommender.get_hybrid_recommendations(user_id)
    print(f"Recommendations for user {user_id}: {recommendations}")

if __name__ == '__main__':
    rpc_client = RpcClient()
    consume_from_exchange(rpc_client, "productExchange", "product_queue", "product_response", handle_message)
