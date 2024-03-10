FROM python:latest
WORKDIR /frontend
COPY . .
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["python", "-m", "hypercorn", "app:app", "--bind", "0.0.0.0:8000"]
