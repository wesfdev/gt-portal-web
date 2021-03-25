import { OnInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RestService } from './../services/rest.service';
import { CommonsService } from './../services/commons.service';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DEFAULT_PAGE_TABLE,PAGE_SIZE,PAGE_SIZE_OPTIONS,DEFAULT_LENGTH_TABLE,} from './../services/GlobalConstants';
import { ACCEPTED, OK } from './../services/GlobalConstants';



@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.component.html',
  styleUrls: ['./distributor.component.css'],
})
export class DistributorComponent implements OnInit {
  public formDistributor: FormGroup;
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['name','code','notificationEmail','alertEmail','actions',];
  public dataSource: any;
  public data: any = [];
  public length = DEFAULT_LENGTH_TABLE;
  public pageSize = PAGE_SIZE;
  public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
  public loading: boolean = false;
  public file: File;

  constructor(public fb: FormBuilder, public http: RestService, public commons: CommonsService, public dialog: MatDialog) {
    this.loadingForm();
    this.getServerData({
      pageIndex: DEFAULT_PAGE_TABLE,
      pageSize: this.pageSize,
    });
  }

  public loadingForm() {
    this.formDistributor = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      notificationEmail: [null, [Validators.email]],
      alertEmail: [null, [Validators.email]],
    });
  }

  public clearForm() {
    this.formDistributor.reset();
  }

  public editDistributor(element: any) {
    this.formDistributor.reset();
    this.formDistributor.setValue(element);
  }

  public saveDistributor() {
    if (this.formDistributor.valid) {
      let body = this.formDistributor.value;
      this.request(body);
    } else {
      this.commons.alert('Por favor, complete el formulario.', 'Distribuidor', {
        duration: 2500,
      });
    }
  }

  public async request(body: any) {
    if (body.id) {
      const response = await this.http.puthttp(`/distributor/${body.id}`, body).toPromise();
      this.commons.alert('Registro actualizado con exito.', response.status);
    } else {
      const response = await this.http.posthttp(`/distributor`, body).toPromise();
      this.commons.alert('Registro guardado con exito.', response.status);
    }
    this.formDistributor.reset();
    this.getServerData({
      pageIndex: DEFAULT_PAGE_TABLE,
      pageSize: this.pageSize,
    });
  }

  public async deleteDistributor(element: any) {
    if (element.id) {
      const response = await this.http.deletehttp(`/distributor/${element.id}`).toPromise();
      if (response.status == ACCEPTED) {
        this.commons.alert('Registro eliminado con exito.', response.status);
        this.getServerData({
          pageIndex: DEFAULT_PAGE_TABLE,
          pageSize: this.pageSize,
        });
      } else {
        this.commons.alert(`${response.name}: ${response.error}`,response.status);
      }
    } else {
      this.commons.alert('Registro invalido', 'Distribuidor');
    }
  }

  public getServerData(event: any) {
    const pagination = `?page=${event.pageIndex}&size=${event.pageSize}`;
    this.loadData(pagination);
    return event;
  }

  public async loadData(params: string = '') {
    this.loading = true;
    const response = await this.http.gethttp(`/distributor${params}`).toPromise();
    this.loading = false;
    this.data = response.body.content;
    this.length = response.body.totalElements;
    this.dataSource = this.data;
  }

  public uploadFile(files: FileList) {
    if (files && files.length > 0) {
      this.file = files.item(0);
    }
  }

  public async sendFile(file) {
    if(file){
      let formData = new FormData();
      formData.append('file', file);
      const response = await this.http.posthttpFile('/distributor/upload', formData).toPromise();
      
      if (response.status == OK) {
        this.commons.alert('Archivo subido con exito.', response.status);
        this.getServerData({pageIndex: DEFAULT_PAGE_TABLE, pageSize: this.pageSize,});
      } else {
        this.commons.alert(`${response.name}: ${response.error}`,response.status);
      }
      
    }else{
      this.commons.alert('Archivo inválido', 'file');
    }
  }

  public uploadFileProduct(){
    const data = { file: undefined };
    const dialogRef = this.dialog.open(DialogContentUploadFile, { data });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: `, data);
      //this.sendFile(data.file);
      this.commons.alert('Implementacion en proceso.','archivos.');
    });
  }

  public uploadFileChannel(){

  }  

  ngOnInit(): void {}
}


@Component({
  selector: 'dialog-content-upload-file',
  templateUrl: 'dialog-content-upload-file.html',
})
export class DialogContentUploadFile {
  constructor(
    public dialogRef: MatDialogRef<DialogContentUploadFile>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  
    public uploadFile(files: FileList) {
      if (files && files.length > 0) {
        this.data.file = files.item(0);
      }
    }
    cancel(): void {
    this.dialogRef.close();
  }


}