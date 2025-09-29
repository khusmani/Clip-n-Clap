
RUN LOCALLY:
============

Run these commands on a Command Prompt. Same things can be done in PyCharm by loading this folder
1. cd <THIS DIR>
2. python -m venv venv
3. venv\Scripts\activate
4.1. pip install Flask  OR
4.2. pip install -r requirements.txt
5. install all other packages as required (preferably via PyCharm)
6. python app.py [in Command Prompt] or run it in PyCharm
7. a local URL (e.g. http://127.0.0.1:5000/) will be displayed. Load it in the browser to test the app.

DEPLOY on Heroku:
=================

Instructions from https://devcenter.heroku.com/articles/getting-started-with-python

1. Dependencies: Create a requirements.txt file listing all necessary Python packages
   by running this command in PyCharm terminal
        pip freeze > requirements.txt

2. Procfile: Create a Procfile in the root of your project to tell Heroku how to run your application.
   For a Flask app using Gunicorn, it typically looks like this:
        web: gunicorn your_app_file_name:app

3. Create Heroku App: If you haven't already, create a new Heroku application:
        heroku create your-app-name

4. Add Python Buildpack: Heroku will usually detect your Python app and automatically add the
   Python buildpack. If not, you can add it explicitly:
        heroku buildpacks:add heroku/python

5. Add FFmpeg Buildpack: This is the crucial step for FFmpeg. Add a buildpack that provides the
   latest FFmpeg binaries:
        heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git

6.
