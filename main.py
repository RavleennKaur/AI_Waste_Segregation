from fastapi import FastAPI, UploadFile, File
from PIL import Image
from transformers import AutoFeatureExtractor, AutoModelForImageClassification

app = FastAPI()

@app.post("/classify/")
async def classify_garbage_image(file: UploadFile = File(...)):
    # Load the model and feature extractor
    extractor = AutoFeatureExtractor.from_pretrained("yangy50/garbage-classification")
    model = AutoModelForImageClassification.from_pretrained("yangy50/garbage-classification")

    # Load the uploaded image
    img = Image.open(file.file)

    # Extract features and classify image
    inputs = extractor(img, return_tensors="pt")
    outputs = model(**inputs)
    label_num = outputs.logits.softmax(1).argmax(1)
    label_num = label_num.item()

    # Map label number to label
    labels = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]
    prediction = labels[label_num]

    return prediction
