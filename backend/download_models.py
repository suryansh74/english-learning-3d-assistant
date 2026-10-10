"""Download Kokoro ONNX model files if missing."""
import urllib.request
import os

files = {
    "kokoro-v1.0.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
    "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}

for name, url in files.items():
    if not os.path.exists(name):
        print(f"Downloading {name}...")
        urllib.request.urlretrieve(url, name)
        print(f"Saved {name}")
    else:
        print(f"{name} already exists")
