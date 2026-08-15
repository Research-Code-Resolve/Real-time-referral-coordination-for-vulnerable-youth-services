# Referral Coordination Platform - Backend

## Overview

This is the backend service for the Referral Coordination Platform for Vulnerable Youth Services.

The backend is built with **Django** and **Django REST Framework** and provides RESTful APIs for managing referrals between organizations supporting vulnerable youth.

## Tech Stack

- Python 3.x
- Django
- Django REST Framework
- SQLite (Development)
- Git

## Features

- User Authentication
- Referral Management (CRUD)
- Youth Management
- Organization Management
- REST API Endpoints

## Project Structure

```
backend/
│
├── config/             # Django project settings
├── api/                # Main application
├── manage.py
├── requirements.txt
├── db.sqlite3
└── README.md
```

## Getting Started

### 1. Create a virtual environment

```bash
python -m venv venv
```

### 2. Activate the virtual environment

Windows

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run migrations

```bash
python manage.py migrate
```

### 5. Create a superuser

```bash
python manage.py createsuperuser
```

### 6. Start the development server

```bash
python manage.py runserver
```

The API will be available at:

```
http://127.0.0.1:8000/
```

## API

The backend exposes REST APIs for:

- Authentication
- Referrals
- Youth
- Organizations

## Author

Backend Team