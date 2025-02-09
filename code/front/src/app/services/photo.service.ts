import { Injectable } from '@angular/core';
import {Directory, Filesystem} from "@capacitor/filesystem";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos = []
  private PHOTO_STORAGE: string = "photos"

  constructor() {
  }
  dataURLtoFile(images: string[], name: string) {
    const files: File[] = []
    for (const image of images) {
      const arr = image.split(',')

      // @ts-ignore
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n) {
        u8arr[n - 1] = bstr.charCodeAt(n - 1)
        n -= 1 // to make eslint happy
      }
      return new File([u8arr], `${new Date().getTime()}_${name}.jpg`, {type: mime})
    }

    return undefined

  }
}
