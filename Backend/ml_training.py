import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Load CSV
df = pd.read_csv('training_data_500.csv')  # or your large synthetic CSV

# Preprocessing
cat_cols = [
    'shift', 'sensor_id', 'weather_station_id', 'sensor_status', 'data_quality_flag',
    'slope_zone', 'rock_type', 'rockfall_size_category'
]
for col in cat_cols:
    df[col] = LabelEncoder().fit_transform(df[col].astype(str))
df['rockfall_occurred'] = df['rockfall_occurred'].astype(int)
df = df.drop(columns=['timestamp'])
df = df.fillna(df.median(numeric_only=True))

# Features and Target
TARGET = 'rockfall_risk_score'
X = df.drop(TARGET, axis=1)
y = df[TARGET]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Random Forest Regressor
rf = RandomForestRegressor(n_estimators=200, min_samples_leaf=3, max_depth=10, random_state=42)
scores = cross_val_score(rf, X_train, y_train, cv=5, scoring='neg_mean_squared_error')
print("RandomForest CV MSE avg:", -scores.mean())
rf.fit(X_train, y_train)
print("RandomForest Test MSE:", mean_squared_error(y_test, rf.predict(X_test)))
joblib.dump(rf, 'rf_risk_model.joblib')
joblib.dump(scaler, 'rf_scaler.joblib')
print("Random Forest model saved.")

# Deep Learning Model
dl_model = keras.Sequential([
    layers.Input(shape=(X_train.shape[1],)),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(64, activation='relu'),
    layers.Dense(32, activation='relu'),
    layers.Dense(1, activation='linear')
])
dl_model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.01), loss='mse', metrics=['mae'])
dl_model.fit(
    X_train, y_train,
    validation_split=0.1,
    epochs=100,
    batch_size=8,
    verbose=2
)
dl_eval = dl_model.evaluate(X_test, y_test)
print("Keras Test MSE:", dl_eval)
dl_model.save('dl_risk_model.keras')
print("Deep Learning model saved.")
