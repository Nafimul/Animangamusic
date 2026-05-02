from google import genai
from google.genai import types
import dotenv
from dotenv import load_dotenv

def promptFromImageBytes(bytes, prompt):
        client = genai.Client()
        response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=[
                types.Part.from_bytes(
                data=bytes,
                mime_type='image/jpeg',
                ),
                prompt
            ]
        )
        return response.text

def promptFromImagePath(path, prompt):
    with open(path, 'rb') as f:
        image_bytes = f.read()

        client = genai.Client()
        response = client.models.generate_content(
        model='gemini-3-flash-preview',
        contents=[
                types.Part.from_bytes(
                data=image_bytes,
                mime_type='image/jpeg',
                ),
                prompt
            ]
        )

        return response.text