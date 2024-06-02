import requests
import pandas as pd
from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALS
from flask import Flask, request, jsonify

app = Flask(__name__)

# Tạo SparkSession
spark = SparkSession.builder.appName('EcommerceRecommender').getOrCreate()

def fetch_actions():
    response = requests.get('http://localhost:5007/api/v1/actions')
    if response.status_code == 200:
        return response.json()
    else:
        return []

def train_als_model():
    data = fetch_actions()
    if data:
        df = pd.DataFrame(data)
        df['userId'] = df['userId'].astype(str)
        df['productId'] = df['productId'].astype(str)
        
        # Assign implicit feedback as ratings
        df['rating'] = df['actionType'].apply(lambda x: 1 if x == 'click' else 2 if x == 'add_to_cart' else 3)
        
        spark_df = spark.createDataFrame(df[['userId', 'productId', 'rating']])
        als = ALS(userCol='userId', itemCol='productId', ratingCol='rating', nonnegative=True, implicitPrefs=True)
        model = als.fit(spark_df)
        model.save('als_model')
        return model
    else:
        return None

model = train_als_model()

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('userId')
    user_df = spark.createDataFrame([(user_id,)], ['userId'])
    recommendations = model.recommendForUserSubset(user_df, 5)
    return recommendations.toPandas().to_json(orient='records')

if __name__ == '__main__':
    app.run(port=5000)
