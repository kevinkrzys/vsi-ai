import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  root: string = "http://vsiai.visualstorageintelligence.com";

  body = new HttpParams()
    .set("lg_username", "super@hackathon.com")
    .set("lg_password", "hackathon");

  constructor(private http: HttpClient) {}

  getToken() {
    return this.http.post(this.root + "/api/login", this.body);
  }

  getAllClients(token: string) {
    return this.http.get(this.root + "/api/allclients/" + token);
  }
}
