import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  vsiRoot: string = "http://vsiai.visualstorageintelligence.com";
  nodeRoot: string = "http://localhost:4300";

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

  generateNLG(client, block) {
    return this.http.get(this.nodeRoot + "/generateNLG", {
      params: {
        client: client,
        block: block
      },
      responseType: "text"
    });
  }
}
