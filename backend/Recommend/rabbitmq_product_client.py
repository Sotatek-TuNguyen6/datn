import pandas as pd
from surprise import Dataset, Reader, SVD, KNNBasic, KNNWithMeans
from surprise.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_squared_error, precision_score, recall_score, f1_score
import json

class RecommenderSystem:
    def __init__(self):
        self.interaction_weights = {'watching': 1, 'add_to_cart': 3, 'purchase': 5}
        
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
        
        # Tune hyperparameters for different algorithms and find the best one
        self.algo_svd, self.mse_svd = self.tune_svd()
        self.algo_knn, self.mse_knn = self.tune_knn()

        # Choose the best model
        if self.mse_svd < self.mse_knn:
            self.algo = self.algo_svd
            self.mse = self.mse_svd
        else:
            self.algo = self.algo_knn
            self.mse = self.mse_knn
        
        # Train the best algorithm
        self.algo.fit(self.trainset)
        
        # Perform TF-IDF vectorization on product descriptions
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(self.df_items['productName'])
        
        # Calculate cosine similarity between all product descriptions
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        
        # Calculate Precision, Recall, F1-score for the best algorithm
        predictions = self.algo.test(self.testset)
        self.precision, self.recall, self.f1 = self.calculate_precision_recall_f1(predictions)

        # Analyze rating distribution
        self.analyze_rating_distribution(predictions)

    def tune_svd(self):
        param_grid = {
            'n_epochs': [20, 30, 40, 50],
            'lr_all': [0.001, 0.002, 0.005, 0.01],
            'reg_all': [0.02, 0.05, 0.1, 0.2, 0.4]
        }
        gs = GridSearchCV(SVD, param_grid, measures=['rmse'], cv=5)
        gs.fit(self.dataset)
        best_algo = gs.best_estimator['rmse']
        best_mse = gs.best_score['rmse']
        print(f"Best SVD RMSE: {best_mse}")
        print(f"Best SVD hyperparameters: {gs.best_params['rmse']}")
        return best_algo, best_mse

    def tune_knn(self):
        param_grid = {
            'k': [20, 30, 40, 50],
            'sim_options': {'name': ['cosine', 'msd', 'pearson'], 'user_based': [False]}
        }
        gs = GridSearchCV(KNNWithMeans, param_grid, measures=['rmse'], cv=5)
        gs.fit(self.dataset)
        best_algo = gs.best_estimator['rmse']
        best_mse = gs.best_score['rmse']
        print(f"Best KNN RMSE: {best_mse}")
        print(f"Best KNN hyperparameters: {gs.best_params['rmse']}")
        return best_algo, best_mse

    def calculate_precision_recall_f1(self, predictions, threshold=3):
        y_true = [pred.r_ui for pred in predictions]
        y_pred = [pred.est for pred in predictions]
        
        y_pred_binary = [1 if rating >= threshold else 0 for rating in y_pred]
        y_true_binary = [1 if rating >= threshold else 0 for rating in y_true]
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        return precision, recall, f1

    def analyze_rating_distribution(self, predictions):
        predicted_ratings = [pred.est for pred in predictions]
        print(f"Predicted Rating Distribution: {pd.Series(predicted_ratings).describe()}")

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
