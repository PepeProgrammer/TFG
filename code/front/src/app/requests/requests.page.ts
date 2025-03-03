import {Component, inject, OnInit} from '@angular/core';
import {RequestsService} from "../services/requests.service";
import {Requests, RequestType} from "../middleware/requests";
import {getBaseUrl} from "../../../variables";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  requestService = inject(RequestsService)

  requests: Requests[] = []
  baseUrl: string
  constructor() {
    this.baseUrl = getBaseUrl()
  }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.requests = await this.requestService.getRequests()
    console.log(this.requests)
  }

  protected readonly RequestType = RequestType;
}
