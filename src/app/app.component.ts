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
  emailFrom: string = "vsymons@cleartechnologies.net";
  emailTo: string = "sxv180026@utdallas.edu";
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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.selectedClient.name = "Select a client";
    this.api.getToken().subscribe((response: JSON) => {
      this.token = response["user"]["token"];
      this.api.getAllClients(this.token).subscribe((response: JSON) => {
        this.clients = response["clientList"];
      });
    });
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
  }

  setClient(client) {
    debugger;
    if (
      (client.name == "High Flying Healthcare" ||
        client.name == "Works Comp") &&
      this.selectedClient != client
    ) {
      this.selectedClient = client;
      this.displayBlockText = "";
      this.displayBlocks = [];
    }
  }

  add(block) {
    if (!this.displayBlocks.includes(block)) {
      this.displayBlocks.push(block);
    } else {
      this.displayBlocks.splice(this.displayBlocks.indexOf(block), 1);
    }
    this.api
      .generateNLG(JSON.stringify(this.selectedClient), block)
      .subscribe(response => {
        this.displayBlockOrder[block] = response;
        this.regenerateEmail();
      });
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

  sendEmail() {
    alert("Email Sent!");
  }

  remove(block) {
    debugger;
    this.displayBlockOrder[block] = "";
    this.regenerateEmail();
  }

  regenerateEmail() {
    this.displayBlockText = "";
    for (var key of Object.keys(this.displayBlockOrder)) {
      this.displayBlockText += this.displayBlockOrder[key];
    }
  }
}
