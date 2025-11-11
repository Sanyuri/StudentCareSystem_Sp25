import os
import stat
import joblib
import logging
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def train_kmeans_model(x, n_clusters: int):
    """
    Train KMeans and save the model and scaler as pkl files.

    Parameters:
    -----------
    X : ndarray
        Input data (unscaled).
    n_clusters : int
        Number of clusters (k) for the KMeans model.

    Returns:
    --------
    kmeans : KMeans
        KMeans object after fitting.
    scaler : StandardScaler
        Scaler object fitted on the data.
    """
    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(x)

    # Initialize KMeans
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(x_scaled)

    # Create directory to save models if not exist
    model_dir = "app/models"
    os.makedirs(model_dir, exist_ok=True)

    # Save model and scaler
    model_path = os.path.join(model_dir, "kmeans_model.pkl")
    scaler_path = os.path.join(model_dir, "scaler.pkl")
    joblib.dump(kmeans, model_path)
    joblib.dump(scaler, scaler_path)
    
    try:
        if os.name != "nt":  # Only run in Linux/MacOs
            os.chmod(model_path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IRGRP | stat.S_IROTH)
            os.chmod(scaler_path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IRGRP | stat.S_IROTH)
    except Exception as e:
        logging.error(f"Could not set file permissions: {e}")

    return kmeans, scaler