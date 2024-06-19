from flask import Flask, request, jsonify
from models import RecommenderSystem

app = Flask(__name__)
recommender = RecommenderSystem()

@app.route('/api/v1/recommend/<int:user_id>', methods=['GET'])
def recommend(user_id):
    try:
        recommendations = recommender.get_hybrid_recommendations(user_id)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5008)
