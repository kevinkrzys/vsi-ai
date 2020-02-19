import { Component, OnInit } from "@angular/core";
import { ApiService } from "./services/api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  selectedClient = "Select a client";
  clients: {}[] = [];
  blocks: string[] = [];
  isClicked: Boolean = false;
  displayBlocks: string[] = [];
  emailFrom: string = "vsymons@cleartechnologies.net";
  emailTo: string = "sxv180026@utdallas.edu";
  emailSubject: string = "Weekly Report";
  token: string;
  //TODO

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getToken().subscribe((response: JSON) => {
      this.token = response["user"]["token"];
      this.api.getAllClients(this.token).subscribe((response: JSON) => {
        this.clients = response["clientList"];
      });
    });

    this.blocks = [
      "Enterprise Summary",
      "Storage by DC",
      "Trends - Capacity",
      "Trends - Performance",
      "Host Summary",
      "Pool Alerts",
      "Provisioning Summary"
    ];
  }

  setClient(client) {
    this.selectedClient = client.name;
  }

  add(block) {
    if (!this.displayBlocks.includes(block)) {
      this.displayBlocks.push(block);
      //TODO
      //color the block green
    } else {
      debugger;
      //TODO
      //color the block white
      this.displayBlocks.splice(this.displayBlocks.indexOf(block), 1);
    }
  }
}
