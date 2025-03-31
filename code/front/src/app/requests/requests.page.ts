import {Component, inject, OnInit} from '@angular/core';
import {RequestsService} from "../services/requests.service";
import {Request, RequestType} from "../middleware/request";
import {getBaseUrl} from "../../../variables";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  requestService = inject(RequestsService)
  translationService = inject(TranslateService)

  requests: Request[] = []
  baseUrl: string
  selRequest: number
  public alertButtons = [
    {
      text: '',
      role: 'cancel',
      handler: () => {
        this.selRequest = 0
      },
    },
    {
      text: '',
      role: 'confirm',
      handler: async () => {
        await this.deleteRequest()
      },
    },
  ];
  constructor() {
    this.baseUrl = getBaseUrl()
    this.selRequest = 0
  }

  ngOnInit() {
    this.translationService.get('cancel').subscribe((res: string) => {  // Es la única forma de obtener la traducción de una cadena de texto
      this.alertButtons[0].text = res
    })
    this.translationService.get('accept').subscribe((res: string) => {
      this.alertButtons[1].text = res
    })
  }

  async ionViewWillEnter() {
    this.requests = await this.requestService.getRequests()
  }

  async deleteRequest() {
    await this.requestService.deleteRequest(this.selRequest)
    this.selRequest = 0
    this.requests = await this.requestService.getRequests()
  }

  selectedRequest(request: Request) {
    this.selRequest = request.id
  }

  async markAsViewed(request: Request) {
    await this.requestService.deleteRequest(request.id, request.type)
    this.selRequest = 0
    this.requests = await this.requestService.getRequests()

  }


  acceptRequest(request: Request) {

  }
  protected readonly RequestType = RequestType;
}
