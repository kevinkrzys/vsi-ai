import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  vsiRoot: string = "http://vsiai.visualstorageintelligence.com";
  nodeRoot: string = "http://localhost:4300";
  pythonRoot: string = "http://127.0.0.1:5000/api/v1/";

  body = new HttpParams()
    .set("lg_username", "super@hackathon.com")
    .set("lg_password", "hackathon");

  constructor(private http: HttpClient) {}

  getToken() {
    return this.http.post(this.vsiRoot + "/api/login", this.body);
  }

  getAllClients(token: string) {
    return this.http.get(this.vsiRoot + "/api/allclients/" + token);
  }

  getGenereatedText(button: string) {
    return this.http.get(this.nodeRoot + "/generatedText", {
      responseType: "text"
    });
  }

  generateNLG(response, block) {
    return this.http.get(this.nodeRoot + "/generateNLG", {
      params: {
        data: response,
        block: block
      },
      responseType: "text"
    });
  }

  sendEmail(to: string, subject: string, body: string) {
    return this.http.post(this.pythonRoot + "sendEmail", {
      email_to: to,
      email_subject: subject,
      email_body: body
    });
  }

  enterpriseSummary(clientId: string, periodId: string) {
    return this.http.get(
      this.pythonRoot + "enterprise_summary/" + clientId + "/" + periodId
    );
  }

  storageByDC(clientId: string, periodId: string) {
    return this.http.get(
      this.pythonRoot +
        "storage_environment_by_datacenter_grouping/" +
        clientId +
        "/" +
        periodId
    );
  }

  proSummary(clientId: string, periodId: string) {
    return this.http.get(
      this.pythonRoot + "get_bu_provisioning_data/" + clientId + "/" + periodId
    );
  }

  hostSummary(clientId: string, periodId: string) {
    return this.http.get(this.pythonRoot + "/" + clientId + "/" + periodId);
  }

  vmwareSummary(clientId: string, periodId: string) {
    debugger;
    return this.http.get(
      this.pythonRoot +
        "enterprise_virtual_center_summary/" +
        clientId +
        "/" +
        periodId
    );
  }
}
