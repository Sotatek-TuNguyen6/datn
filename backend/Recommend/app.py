from flask import Flask, request, jsonify
from models import RecommenderSystem
import json
import threading
from rabbitmq_product_client import consume_queue
import pika

app = Flask(__name__)
# recommender = RecommenderSystem()


def handle_recommend_message_actions(message_content):
    # Xử lý logic khi nhận được message
    print('Recommendations data received for actions:')
    # Ghi đè dữ liệu vào file JSON
    with open('actions.json', 'w') as f:
        json.dump(message_content, f)
        f.write('\n')

def handle_recommend_message_products(message_content):
    # Xử lý logic khi nhận được message
    print('Recommendations data received for products:')
    # Ghi đè dữ liệu vào file JSON
    with open('response.json', 'w') as f:
        json.dump(message_content, f)
        f.write('\n')
@app.route('/api/v1/recommend/<string:user_id>', methods=['GET'])
def recommend(user_id):
    try:
        recommender = RecommenderSystem()
        recommendations = recommender.get_hybrid_recommendations(user_id)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/metrics', methods=['GET'])
def get_metrics():
    recommender = RecommenderSystem()
    metrics = {
        'MSE': recommender.mse,
        'Precision': recommender.precision,
        'Recall': recommender.recall,
        'F1-score': recommender.f1
    }
    return jsonify(metrics)
if __name__ == '__main__':
    threading.Thread(target=consume_queue, args=('recommend_queue_actions', handle_recommend_message_actions)).start()
    threading.Thread(target=consume_queue, args=('recommend_queue_products', handle_recommend_message_products)).start()
    app.run(debug=True, host='0.0.0.0', port=5008)