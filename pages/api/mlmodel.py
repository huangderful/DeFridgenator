import sys
import json
import os
from inference_sdk import InferenceHTTPClient

# Load your pre-trained model
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key=os.environ["ROBOFLOW_KEY"]
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
    image_path =  "./fridge.png"# sys.argv[1]  # Get the image path from the arguments
    ingredients = detect_ingredients(image_path)
    print(json.dumps(ingredients))
    # Output the ingredients in JSON format
    print(json.dumps(ingredients))
