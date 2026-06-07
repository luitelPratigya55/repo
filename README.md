# URL Shortener

A full-stack URL shortening application with Django backend and Next.js frontend.

## Features

- User registration and login (JWT authentication)
- Create short URLs from long URLs
- Custom alias support (e.g., `yourdomain.com/my-link`)
- Edit and delete URLs
- Click tracking for each short URL
- View all your URLs in one dashboard

## Tech Stack

- **Backend**: Django, Django REST Framework, SQLite
- **Frontend**: Next.js, Tailwind CSS, Axios

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- pip and npm

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver

### Frontend Setup

cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env

# Start frontend server
npm run dev

Frontend runs on http://localhost:3000

Usage
Register - Create a new account at /register

Login - Sign in at /login

Create URL - Enter a long URL and click "Shorten URL"

Manage - Edit, delete, or copy your short URLs from the dashboard

Share - Anyone can visit your short URL and get redirected

API Endpoints
Method	Endpoint	        Description
POST	/api/token/	        Login
POST	/register/	        Register
POST	/user/url/	        Create short URL
GET	    /user/url/	        Get all URLs
PATCH	/user/url/{code}/	Update URL
DELETE	/user/url/{code}/	Delete URL
GET	    /{code}/	        Redirect to original URL


Common Issues
"Authentication credentials were not provided"

Make sure you're logged in and have a valid token

404 on redirect

Check if the short code exists in the database

Verify the URL is active (not deleted)

Database errors

Run python manage.py migrate to sync database schema

# Use short URL (opens in browser)
# http://localhost:8000/abc123/