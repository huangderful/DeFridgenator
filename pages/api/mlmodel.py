import sys
import json
from inference_sdk import InferenceHTTPClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

api_key = os.getenv("ROBOFLOW_KEY")

# Load your pre-trained model
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key=api_key
)


def detect_ingredients(image_path):
    # Assuming `process_image` will take an image and return detected ingredients
    result = CLIENT.infer(image_path, model_id="aicook-lcv4d/3")
    predictions = result['predictions']
    confidence_threshold = 0.4
    ingredients = {}
    # Counting classes with confidence greater than the threshold
    for item in predictions:
        if item['confidence'] > confidence_threshold:
            class_name = item['class']
            if class_name in ingredients:
                ingredients[class_name] += 1
            else:
                ingredients[class_name] = 1


    return ingredients

if __name__ == "__main__":
    image_path =  sys.argv[1]  # Get the image path from the arguments
    # print(json.dumps({"image_path": image_path}))
    ingredients = detect_ingredients(image_path)
    # Output the ingredients in JSON format
    print(json.dumps(ingredients))