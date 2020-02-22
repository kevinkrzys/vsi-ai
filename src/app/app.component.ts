import { Component, OnInit } from "@angular/core";
import { ApiService } from "./services/api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  selectedClient: any = {};
  clients: {}[] = [];
  blocks: string[] = [];
  isClicked: boolean = false;
  displayBlocks: string[] = [];
  emailFrom: string = "gauty95@gmail.com";
  emailTo: string = "";
  emailSubject: string = "Weekly Report";
  token: string;
  displayBlockOrder: {} = {};
  displayBlockText: string = "";
  tools: object = {
    items: [
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "Outdent",
      "Indent",
      "|",
      "CreateLink",
      "Image",
      "|",
      "ClearFormat",
      "Print",
      "SourceCode",
      "FullScreen",
      "|",
      "Undo",
      "Redo"
    ]
  };
  fontColor = {
    modeSwitcher: true
  };
  showPredict: boolean = false;
  pid: {}[] = [];
  selectedPid: {} = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.selectedClient.name = "Select a client";
    this.selectedPid["title"] = "Select a period";
    this.api.getToken().subscribe((response: JSON) => {
      this.token = response["user"]["token"];
      this.api.getAllClients(this.token).subscribe((response: JSON) => {
        this.clients = response["clientList"];
      });
    });
  }

  setClient(client) {
    if (
      (client.name == "High Flying Healthcare" ||
        client.name == "Works Comp") &&
      this.selectedClient != client
    ) {
      this.selectedClient = client;
      this.displayBlockText = "";
      this.displayBlocks = [];
    }
    if (client.name == "High Flying Healthcare") {
      this.blocks = [
        "Introduction",
        "Enterprise Summary",
        "Storage by DC",
        "Trends - Capacity",
        "Trends - Performance",
        "Host Summary",
        "VMware Summary",
        "Pool Alerts",
        "Provisioning Summary",
        "Conclusion",
        "Signature"
      ];
      this.pid = [
        { title: "01-20-2020", id: "1846", client: 188 },
        { title: "01-18-2020", id: "1844", client: 188 },
        { title: "01-15-2020", id: "1841", client: 188 },
        { title: "01-13-2020", id: "1839", client: 188 },
        { title: "01-11-2020", id: "1837", client: 188 }
      ];
    } else if (client.name == "Works Comp") {
      this.blocks = [
        "Introduction",
        "Enterprise Summary",
        "Storage by DC",
        "Trends - Capacity",
        "Trends - Performance",
        "Host Summary",
        "Pool Alerts",
        "Provisioning Summary",
        "Conclusion",
        "Signature"
      ];
      this.pid = [
        { title: "01-19-2020", id: "1845", client: 137 },
        { title: "01-16-2020", id: "1842", client: 137 },
        { title: "01-14-2020", id: "1840", client: 137 },
        { title: "01-12-2020", id: "1838", client: 137 },
        { title: "01-09-2020", id: "1835", client: 137 }
      ];
    }
  }

  add(block) {
    if (!this.displayBlocks.includes(block)) {
      this.displayBlocks.push(block);
    } else {
      this.displayBlocks.splice(this.displayBlocks.indexOf(block), 1);
    }
    switch (block) {
      case "Enterprise Summary":
        this.api
          .enterpriseSummary(
            this.selectedClient["clientid"],
            this.selectedPid["id"]
          )
          .subscribe(response => {
            this.api
              .generateNLG(JSON.stringify(response), block)
              .subscribe(res => {
                this.displayBlockOrder[block] = res;
                this.regenerateEmail();
              });
          });
        break;

      case "Storage by DC":
        this.api
          .storageByDC(this.selectedClient["clientid"], this.selectedPid["id"])
          .subscribe(response => {
            this.api
              .generateNLG(JSON.stringify(response), block)
              .subscribe(res => {
                this.displayBlockOrder[block] = res;
                this.regenerateEmail();
              });
          });
        break;

      case "VMware Summary":
        this.api
          .vmwareSummary(
            this.selectedClient["clientid"],
            this.selectedPid["id"]
          )
          .subscribe(response => {
            this.api
              .generateNLG(JSON.stringify(response[0]), block)
              .subscribe(res => {
                this.displayBlockOrder[block] = res;
                this.regenerateEmail();
              });
          });
        break;

      case "Provisioning Summary":
        this.api
          .proSummary(this.selectedClient["clientid"], this.selectedPid["id"])
          .subscribe(response => {
            this.api
              .generateNLG(JSON.stringify(response), block)
              .subscribe(res => {
                this.displayBlockOrder[block] = res;
                this.regenerateEmail();
              });
          });
        break;

      default:
        this.api
          .generateNLG(JSON.stringify(this.selectedClient), block)
          .subscribe(res => {
            this.displayBlockOrder[block] = res;
            this.regenerateEmail();
          });
        break;
    }
  }

  setClientEmail(clientName: string) {
    switch (clientName) {
      case "Arkansas":
        return "rcd190000@utdallas.edu";

      case "Backup Boys":
        return "sxv180026@utdallas.edu";

      case "Energizer Bunny":
        return "vxa180017@utdallas.edu";

      case "Healthcare":
        return "rcd190000@utdallas.edu";

      case "High Flying Healthcare":
        return "sxv180026@utdallas.edu";

      case "Kerrie's Unicorn":
        return "vxa180017@utdallas.edu";

      case "Milk Men":
        return "rcd190000@utdallas.edu";

      case "Pan Am":
        return "sxv180026@utdallas.edu";

      case "Parts People":
        return "vxa180017@utdallas.edu";

      case "Works Comp":
        return "rcd190000@utdallas.edu";
    }
  }

  remove(block) {
    this.displayBlockOrder[block] = "";
    this.regenerateEmail();
  }

  regenerateEmail() {
    this.displayBlockText = "";
    for (var key of Object.keys(this.displayBlockOrder)) {
      this.displayBlockText += this.displayBlockOrder[key];
    }
  }

  sendEmail() {
    this.api
      .sendEmail(this.emailTo, this.emailSubject, this.displayBlockText)
      .subscribe((result: JSON) => {
        if (result["status"] == "success") {
          this.reset();
          alert("Email Sent Successfully");
        }
      });
  }

  predict() {
    alert("Coming Soon!");
  }

  setPid(id: string) {
    this.selectedPid = id;
  }

  reset() {
    this.selectedClient = {};
    this.selectedClient.name = "Select a client";
    this.selectedPid["title"] = "Select a period";
    this.displayBlockOrder = {};
  }
}
