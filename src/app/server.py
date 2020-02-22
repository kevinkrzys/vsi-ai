import flask
from flask_cors import CORS, cross_origin
from flask import jsonify, make_response, current_app, request
from datetime import timedelta
from functools import update_wrapper
import requests
import pandas as pd
import numpy as np
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import *
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

app = flask.Flask(__name__)
CORS(app, resources=r'/api/v1/*', headers='Content-Type')

MISSING_PARAMETER = 400
BAD_REQUEST = 400
UNAUTHORIZED = 401
ACCESS_DENIED = 403
SERVER_FAILED = 500
NOT_FOUND = 404
PRE_CONDITION_FAILED = 412
EVOLVE_ONLY = 0

def raiseError(code, message):
    resp = jsonify({'message': message})
    resp.status_code = code
    return resp


@app.route('/api/v1/sendEmail', methods=['POST'])
def sendEmail():
    try:
        data = request.json
        # Create the email object
        msg = MIMEMultipart()
        msg['From'] = param["email_from"]
        msg['To'] = data["email_to"]
        msg['Subject'] = data["email_subject"]
        msg.attach(MIMEText(data["email_body"], 'html'))
        # Initiate email server and login with the credentials
        smtp_server = smtplib.SMTP(param["host"], 587)
        smtp_server.ehlo()
        smtp_server.starttls()
        smtp_server.login(param["email_from"], param["email_password"])
        text = msg.as_string()
        smtp_server.sendmail(param["email_from"], data["email_to"], text)
        smtp_server.quit()
        return jsonify({'status': 'success', 'results': 'OK'}) 
    except Exception as e:
        return raiseError(BAD_REQUEST, e)

@app.route('/api/v1/sendEmail', methods=['POST'])
def sendEmail():
    try:
        data = request.json
        # Create the email object
        msg = MIMEMultipart()
        msg['From'] = param["email_from"]
        msg['To'] = data["email_to"]
        msg['Subject'] = data["email_subject"]
        msg.attach(MIMEText(data["email_body"], 'html'))
        # Initiate email server and login with the credentials
        smtp_server = smtplib.SMTP(param["host"], 587)
        smtp_server.ehlo()
        smtp_server.starttls()
        smtp_server.login(param["email_from"], param["email_password"])
        text = msg.as_string()
        smtp_server.sendmail(param["email_from"], data["email_to"], text)
        smtp_server.quit()
        return jsonify({'status': 'success', 'results': 'OK'}) 
    except Exception as e:
        return raiseError(BAD_REQUEST, e)

if __name__ == "__main__":
    app.run(debug=True)