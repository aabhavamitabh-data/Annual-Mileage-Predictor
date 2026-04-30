#!/bin/bash
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Generating dataset..."
python src/generate_data.py

echo "Preprocessing..."
python src/preprocess.py

echo "Training model..."
python src/train.py

echo "Build complete!"
