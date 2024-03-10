# Name: Кредитный ассистент
## Design by: Михаил Краснов
## Frontend by: Даниил Коростелев и Александр Крайнов
## Backend by: Александр Крайнов

# Description:
That's web app, created during hackathon. It's workplace for credit assistence
## Screenshots of our platform:
### Login Page
![alt text](https://github.com/Sanorian/squad47/blob/main/images/login_screen.png)
### Main Page
![alt text](https://github.com/Sanorian/squad47/blob/main/images/work_screen.png)
## Dependencies:
```
pip install fastapi
pip install mysql-connector-python
pip install cors
pip install hypercorn
pip install uvicorn
```
## Для запуска серверного приложения для тестирования:
```
python -m uvicorn app:app --reload
```
## For release:
```
python -m hypercorn app:app
```
