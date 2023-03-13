import { from, Observable } from 'rxjs';
import { ImageType } from './../models/project';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import 'firebase/compat/storage';
import { ListResult } from '@firebase/storage-types';

@Injectable({
  providedIn: 'root'
})
export class ImageHandlerService {

  storageRef = this.storage.ref('project-images')

  constructor(private storage: AngularFireStorage) { }

  getUploadImageTask(
    imageType: ImageType,
    imageName: string,
    imageFile: File): AngularFireUploadTask {

    const imageRef = this.storageRef.child(`${imageType}/${imageName}`);
    const imageTask = imageRef.put(imageFile!);
    return imageTask;

  }

  getImageUrl(imageType: ImageType, imageName: string): Observable<string> | null {

    if (imageType === ImageType.pre) {
      return this.storage.ref(`project-images/${imageName}`).getDownloadURL();
    } else if (imageType === ImageType.post) {
      return this.storage.ref(`project-images/${imageName}`).getDownloadURL();
    } else {
      return null
    }
  }

  deleteImage(imageType: ImageType, imageName: string) {
    const imageToDelete = this.storage.ref(`project-images/${imageType}/${imageName}`);
    imageToDelete.delete().subscribe();

  }

  clearImages() {
    const folderList = ["pre", "post"]
    folderList.forEach((folderItem) => {
      const folderRef = this.storage.ref(`/project-images/${folderItem}`)
      // Use the 'listAll' method to get a list of all files in the folder
      const listObservable = from(folderRef.listAll());
      // Convert the Observable to a Promise using 'toPromise' method
      listObservable.toPromise().then((listResult: ListResult) => {
        listResult.items.forEach((itemRef) => {
          // Delete each file in the folder
          itemRef.delete()
        });
      })
    })
  }

}




