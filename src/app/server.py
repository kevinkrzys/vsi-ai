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

@app.route('/api/v1/enterprise_summary/<client_id>/<period_id>', methods=['GET'])
def enterprise_summary(client_id, period_id):
    try:
        df_storage_1 = pd.read_csv(str(client_id)+"_enterprise_summary.csv", index_col=None)
        df_temp = df_storage_1[df_storage_1['period_id']==int(period_id)]
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = {"raw_disk_gb":int(df_temp["raw_disk_gb"].sum()),
                    "total_allocated":int(df_temp["raw_disk_gb"].sum()),
                    "total_free":int(df_temp["total_free"].sum()),
                    "total_used":int(df_temp["total_used"].sum()),
                    "usable_gb":int(df_temp["usable_gb"].sum()),
                    "percent_used":int(df_temp["percent_used"].mean()),
                    "provisioned_gb":int(df_temp["provisioned_gb"].sum()),
                    "orphan_gb":int(df_temp["orphan_gb"].sum()),
                    "orphan_luns":int(df_temp["num_orphans"].sum()),
                    "num_hosts":int(df_temp["num_hosts"].sum()),
                    "pools":int(df_temp["num_disk_groups"].sum()),
                    "savings":int(df_temp["dedupe_gb"].sum()),
                    "num_drives":int(df_temp["num_drives"].sum()),
                    "iops":int(df_temp["iops"].sum()),
                    "latency":int(df_temp["latency"].mean()),
                    "volume_locked_free":int(df_temp["volume_locked_free"].sum())}
        return response
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
@app.route('/api/v1/storage_environment_by_datacenter_grouping/<client_id>/<period_id>', methods=['GET'])
def storage_environment_by_datacenter_grouping(client_id, period_id):
    try:
        df_storage_2 = pd.read_csv(str(client_id)+"_storage_environment_by_datacenter_grouping.csv", index_col=None)
        df_temp = df_storage_2[df_storage_2['period_id']==int(period_id)]
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
@app.route('/api/v1/storage_environment_by_datacenter_metagrouping/<client_id>/<period_id>', methods=['GET'])
def storage_environment_by_datacenter_metagrouping(client_id, period_id):
    try:
        df_storage_3 = pd.read_csv(str(client_id)+"_storage_environment_by_datacenter_metagrouping.csv", index_col=None)
        df_temp = df_storage_3[df_storage_3['period_id']==int(period_id)]
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
@app.route('/api/v1/storage_environment_by_datacenter_overview/<client_id>/<period_id>', methods=['GET'])
def storage_environment_by_datacenter_overview(client_id, period_id):
    try:
        df_storage_4 = pd.read_csv(str(client_id)+"_storage_environment_by_datacenter_overview.csv", index_col=None)
        df_temp = df_storage_4[df_storage_4['period_id']==int(period_id)]
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
@app.route('/api/v1/get_bu_provisioning_data/<client_id>/<period_id>', methods=['GET'])
def get_bu_provisioning_data(client_id, period_id):
    try:
        df_business_unit = pd.read_csv(str(client_id)+"_get_bu_provisioning_data.csv", index_col=None)
        df_temp = df_business_unit[df_business_unit['period_id']==int(period_id)]
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
@app.route('/api/v1/enterprise_virtual_center_summary/<client_id>/<period_id>', methods=['GET'])
def enterprise_virtual_center_summary(client_id, period_id):
    try:
        df_enterprise_virtual_center_summary = pd.read_csv(str(client_id)+"_enterprise_virtual_center_summary.csv", index_col=None)
        df_temp = df_enterprise_virtual_center_summary[df_enterprise_virtual_center_summary['period_id']==int(period_id)]
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
@app.route('/api/v1/enterprise_trend/<client_id>', methods=['GET'])
def enterprise_trend(client_id):
    try:
        df_enterprise_trend = pd.read_csv(str(client_id)+"_enterprise_trend.csv", index_col=None)
        df_temp = df_enterprise_trend
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)

@app.route('/api/v1/enterprise_trend_all_classifications/<client_id>', methods=['GET'])
def enterprise_trend_all_classifications(client_id):
    try:
        df_enterprise_trend_all_classifications = pd.read_csv(str(client_id)+"_enterprise_trend_all_classifications.csv", index_col=None)
        df_temp = df_enterprise_trend_all_classifications
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
@app.route('/api/v1/enterprise_performance_iops_trend/<client_id>', methods=['GET'])
def enterprise_performance_iops_trend(client_id):
    try:
        df_enterprise_performance_iops_trend = pd.read_csv(str(client_id)+"_enterprise_performance_iops_trend.csv", index_col=None)
        df_temp = df_enterprise_performance_iops_trend
        df_temp = df_temp.reset_index()
        df_temp = df_temp.drop(['index'],axis=1)
        response = df_temp.to_dict('records')
        return jsonify(response)
    except Exception as e:
        return raiseError(BAD_REQUEST, e)
    
if __name__ == "__main__":
    app.run(debug=True)