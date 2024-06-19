import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class RecommenderSystem:
    def __init__(self):
        self.interaction_weights = {'click': 1, 'add_to_cart': 3, 'purchase': 5}
        self.df_interactions = pd.read_csv('data/user_interactions.csv')
        self.df_items = pd.read_csv('data/item_features.csv')
        self.df_interactions['rating'] = self.df_interactions['interaction'].map(self.interaction_weights)
        
        self.reader = Reader(rating_scale=(1, 5))
        self.dataset = Dataset.load_from_df(self.df_interactions[['user_id', 'item_id', 'rating']], self.reader)
        
        self.trainset, self.testset = train_test_split(self.dataset, test_size=0.25)
        
        self.algo = SVD()
        self.algo.fit(self.trainset)
        
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(self.df_items['description'])
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
    
    def get_content_based_recommendations(self, user_id):
        user_interactions = self.df_interactions[self.df_interactions['user_id'] == user_id]
        user_items = user_interactions['item_id'].tolist()
        
        sim_scores = {}
        for item in user_items:
            sim_items = list(enumerate(self.cosine_sim[item - 1]))
            for i, score in sim_items:
                if i + 1 not in user_items:
                    if i + 1 not in sim_scores:
                        sim_scores[i + 1] = score
                    else:
                        sim_scores[i + 1] += score
        
        sorted_items = sorted(sim_scores.items(), key=lambda x: x[1], reverse=True)
        return [item[0] for item in sorted_items]
    
    def get_hybrid_recommendations(self, user_id, top_n=5):
        item_ids = self.df_interactions['item_id'].unique()
        
        collab_recommendations = []
        user_rated_items = self.df_interactions[self.df_interactions['user_id'] == user_id]['item_id'].tolist()
        for item_id in item_ids:
            if item_id not in user_rated_items:
                est_rating = self.algo.predict(user_id, item_id).est
                collab_recommendations.append((item_id, est_rating))
        
        collab_recommendations.sort(key=lambda x: x[1], reverse=True)
        
        content_recommendations = self.get_content_based_recommendations(user_id)
        
        hybrid_recommendations = []
        for item in collab_recommendations:
            if item[0] in content_recommendations:
                hybrid_score = item[1] * 0.7 + content_recommendations.index(item[0]) * 0.3
                hybrid_recommendations.append((item[0], hybrid_score))
        
        hybrid_recommendations.sort(key=lambda x: x[1], reverse=True)
        
        top_hybrid_recommendations = hybrid_recommendations[:top_n]
        results = []
        for item_id, score in top_hybrid_recommendations:
            product_name = self.df_items[self.df_items['item_id'] == item_id]['title'].values[0]
            results.append({'item_id': item_id, 'product_name': product_name, 'score': score})
        
        return results
