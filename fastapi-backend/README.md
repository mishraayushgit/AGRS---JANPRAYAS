# Jan Prayas - FastAPI Python Microservice (Mission BHASHINI)

This folder contains the Python FastAPI implementation for the WhisperX ASR and Indic NLP classification engine.

### Requirements:
- Python 3.10+
- PyTorch with CUDA (optional for GPU acceleration)
- FFmpeg

### Installation & Run:
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
