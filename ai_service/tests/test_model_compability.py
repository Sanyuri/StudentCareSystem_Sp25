import os
import pytest
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

def test_model_files_exist():
    """Test that model files exist before trying to load them"""
    model_path = os.path.join("app", "models", "kmeans_model.pkl")
    scaler_path = os.path.join("app", "models", "scaler.pkl")
    
    assert os.path.exists(model_path), f"Model file not found at {model_path}"
    assert os.path.exists(scaler_path), f"Scaler file not found at {scaler_path}"

def test_kmeans_model_py3_compatibility():
    """Test that the KMeans model can be loaded in Python 3"""
    model_path = os.path.join("app", "models", "kmeans_model.pkl")
    
    if not os.path.exists(model_path):
        pytest.skip(f"Model file not found at {model_path}")
    
    try:
        model = joblib.load(model_path)
        assert isinstance(model, KMeans), f"Model is not KMeans type, got {type(model)} instead"
    except Exception as e:
        pytest.fail(f"Failed to load model: {str(e)}")

def test_scaler_py3_compatibility():
    """Test that the scaler can be loaded in Python 3"""
    scaler_path = os.path.join("app", "models", "scaler.pkl")
    
    if not os.path.exists(scaler_path):
        pytest.skip(f"Scaler file not found at {scaler_path}")
    
    try:
        scaler = joblib.load(scaler_path)
        assert isinstance(scaler, StandardScaler), f"Scaler is not StandardScaler type, got {type(scaler)} instead"
    except Exception as e:
        pytest.fail(f"Failed to load scaler: {str(e)}")