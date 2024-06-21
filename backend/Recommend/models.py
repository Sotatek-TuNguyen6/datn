import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
from rabbitmq_product_client import send_and_receive_all_products
class RecommenderSystem:
    def __init__(self):
        self.interaction_weights = {'watching': 1, 'add_to_cart': 3, 'purchase': 5}
        
        # send_and_receive_all_products('productRequestQueue', 'productResponseQueue', 'response')
        send_and_receive_all_products('actionsRequestQueue', 'actionsResponseQueue', 'actions.json')

        # Load items data from JSON file
        with open('response.json', 'r') as file:
            product_data = json.load(file)
        df_items_data = product_data['products']
        
        # Load interactions data from JSON file
        with open('actions.json', 'r') as file:
            action_data = json.load(file)
        df_interactions_data = action_data['actions']

        # Create DataFrames
        self.df_items = pd.DataFrame(df_items_data)
        self.df_interactions = pd.DataFrame(df_interactions_data)
        
        # Map interaction types to ratings
        self.df_interactions['rating'] = self.df_interactions['actionType'].map(self.interaction_weights)
        
        # Create a surprise dataset for collaborative filtering
        self.reader = Reader(rating_scale=(1, 5))
        self.dataset = Dataset.load_from_df(self.df_interactions[['userId', 'productId', 'rating']], self.reader)
        
        self.trainset, self.testset = train_test_split(self.dataset, test_size=0.25)
        
        # Train SVD algorithm
        self.algo = SVD()
        self.algo.fit(self.trainset)
        
        # Perform TF-IDF vectorization on product descriptions
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(self.df_items['productName'])
        
        # Calculate cosine similarity between all product descriptions
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)

    def get_content_based_recommendations(self, user_id):
        user_interactions = self.df_interactions[self.df_interactions['userId'] == user_id]
        user_items = user_interactions['productId'].tolist()
        
        sim_scores = {}
        for item in user_items:
            try:
                item_index = self.df_items.index[self.df_items['_id'] == item].tolist()[0]
                sim_items = list(enumerate(self.cosine_sim[item_index]))
                for i, score in sim_items:
                    sim_item_id = self.df_items.iloc[i]['_id']
                    if sim_item_id not in user_items:
                        if sim_item_id not in sim_scores:
                            sim_scores[sim_item_id] = score
                        else:
                            sim_scores[sim_item_id] += score
            except IndexError:
                continue
        
        sorted_items = sorted(sim_scores.items(), key=lambda x: x[1], reverse=True)
        return [item[0] for item in sorted_items]

    def get_collaborative_recommendations(self, user_id):
        item_ids = self.df_interactions['productId'].unique()
        
        collab_recommendations = []
        user_rated_items = self.df_interactions[self.df_interactions['userId'] == user_id]['productId'].tolist()
        for item_id in item_ids:
            if item_id not in user_rated_items:
                est_rating = self.algo.predict(user_id, item_id).est
                collab_recommendations.append((item_id, est_rating))
        
        collab_recommendations.sort(key=lambda x: x[1], reverse=True)
        return [item[0] for item in collab_recommendations]

    def get_hybrid_recommendations(self, user_id, top_n=5):
        collab_recommendations = self.get_collaborative_recommendations(user_id)
        content_recommendations = self.get_content_based_recommendations(user_id)
        
        hybrid_scores = {}
        for item in collab_recommendations:
            if item in content_recommendations:
                hybrid_scores[item] = collab_recommendations.index(item) * 0.7 + content_recommendations.index(item) * 0.3
        
        sorted_hybrid_scores = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)
        top_hybrid_recommendations = sorted_hybrid_scores[:top_n]
        
        results = []
        for item_id, score in top_hybrid_recommendations:
            product_info = self.df_items[self.df_items['_id'] == item_id].to_dict('records')[0]
            product_info['score'] = score
            results.append(product_info)
        
        return results

