import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(private http: HttpClient) { }

  title = 'emailExample';
  fileToUpload: File;

  errorMsg: string;
  progressValue: number = 0;

  profileForm = new FormGroup({
    sendingAddress: new FormControl(''),
    file: new FormControl(''),
  });



  @ViewChild('file', { static: false }) file;
  @ViewChild('email') email : ElementRef;

  handleFileInput(files: FileList) {
    this.errorMsg = '';
    if (files.item(0).size > 9437184) {
      this.errorMsg = "file size too large. Select a new file."
    }

    this.fileToUpload = files.item(0);
  }

  reset(){
    this.errorMsg = "";
    this.progressValue = 0;
    this.profileForm.reset();
  }

  sendFile() {

    var body: FormData = new FormData();
    body.append("sendingAddress", this.email.nativeElement.value);

    body.append('file', this.fileToUpload, this.fileToUpload.name);

    // create a http-post request and pass the form
    // tell it to report the upload progress
    const req = new HttpRequest('POST', "https://emaildemowailiu.azurewebsites.net/api/Function1", body, {
      reportProgress: true, responseType : "text"
    });

    this.http.request(req).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        // calculate the progress percentage

        this.progressValue = Math.round((100 * event.loaded) / event.total);

      }
      else if (event instanceof HttpResponse) {
          alert('successfully sent! check your email'); 
          this.profileForm.reset();

      }
    }, 
    error => {
      this.errorMsg = "error sending to server"
    });




  }


  get sendingAddressField(){
    return this.profileForm.get('sendingAddress');
  }


  get fileField(){
    return this.profileForm.get('file');
  }
}
