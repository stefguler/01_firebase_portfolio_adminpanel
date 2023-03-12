import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {

  preImgFile: File | null = null;
  postImgFile: File | null = null;
  newPreImgName: string;
  newPostImgName: string;
  preImagePreview: string | undefined;
  postImagePreview: string | undefined;
  
  
  constructor() { }


}
