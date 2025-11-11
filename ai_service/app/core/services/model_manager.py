import logging
import os
import joblib
import threading
from io import BytesIO

class ModelManager:
    def __init__(self):
        self._lock = threading.Lock()
        self._models = {}

    def load_model(self, model_path, name):
        try:
            with self._lock:
                with open(model_path, 'rb') as f:
                    self._models[name] = joblib.load(f)
        except FileNotFoundError:
            logging.error(f"Model file {model_path} not found.")
        except Exception as e:
            logging.error(f"Error loading model {name}: {e}")

    def get_model(self, name):
        with self._lock:
            return self._models.get(name)

    def reload_model_from_bytes(self, content: bytes, name: str):
        with self._lock:
            self._models[name] = joblib.load(BytesIO(content))

    def predict(self, data, name):
        with self._lock:
            model = self._models.get(name)
            if model is None:
                raise ValueError(f"Model '{name}' not loaded")
            if not hasattr(model, 'predict'):
                raise TypeError(f"Model '{name}' does not support prediction")
            return model.predict(data)
        
    def save_model_to_disk(self, name: str, file_path: str = None):
        """
        Save a model to disk, overwriting the existing file if it exists.
        
        Args:
            name: The name of the model to save
            file_path: The path where to save the model
        
        Raises:
            ValueError: If the model with the given name is not loaded
            IOError: If there's an error writing to the file
        """
        with self._lock:
            model = self._models.get(name)
            if model is None:
                raise ValueError(f"Model '{name}' not found in memory")
            
            # Use static directory if file_path is not provided
            if file_path is None:
                file_path = os.path.join("app/models/", f"{name}.pkl")
            
            try:
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                # Save the model to disk
                joblib.dump(model, file_path)
                logging.info(f"Model '{name}' successfully saved to {file_path}")
            except Exception as e:
                logging.error(f"Error saving model '{name}' to {file_path}: {e}")
                raise IOError(f"Failed to save model: {e}")

        
model_manager = ModelManager()

