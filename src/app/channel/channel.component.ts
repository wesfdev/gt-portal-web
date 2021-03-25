import { OnInit, Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RestService } from './../services/rest.service';
import { CommonsService } from './../services/commons.service';
import { DEFAULT_PAGE_TABLE, PAGE_SIZE, PAGE_SIZE_OPTIONS, DEFAULT_LENGTH_TABLE } from './../services/GlobalConstants';
import { ACCEPTED } from './../services/GlobalConstants';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  public formChannel:FormGroup;
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['code', 'name', 'actions'];
  public dataSource: any;
  public data:any = [];
  public length = DEFAULT_LENGTH_TABLE;
  public pageSize = PAGE_SIZE;
  public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
  public loading:boolean = false;  

  constructor(public fb: FormBuilder, public http:RestService, private commons: CommonsService){
    this.loadingForm();
    this.getServerData({pageIndex: DEFAULT_PAGE_TABLE, pageSize: this.pageSize});
  }

  public loadingForm(){
    this.formChannel = this.fb.group({
      id:[null],
      code: [null, [Validators.required]],
      name: [null, [Validators.required]]      
    });
  }

  public clearForm(){
    this.formChannel.reset();
  }  

  public editChannel(element:any){
    this.formChannel.reset();
    this.formChannel.setValue(element);
  }

  public saveChannel(){
    if(this.formChannel.valid){
      let body = this.formChannel.value;
      this.request(body);
    }else{
      this.commons.alert('Por favor, complete el formulario.', 'Canal', { duration: 2500});    
    }
  }

  public async request(body:any){
    if(body.id){
      const response = await this.http.puthttp(`/channel/${body.id}`, body).toPromise();
      this.commons.alert('Registro actualizado con exito.', response.status);
    }else{
      const response = await this.http.posthttp(`/channel`, body).toPromise();
      this.commons.alert('Registro guardado con exito.', response.status);
    }
    this.formChannel.reset();
    this.getServerData({pageIndex: DEFAULT_PAGE_TABLE, pageSize: this.pageSize});
  }

  public async deleteChannel(element:any){
    if(element.id){
      const response = await this.http.deletehttp(`/channel/${element.id}`).toPromise();
      if(response.status == ACCEPTED){
        this.commons.alert('Registro eliminado con exito.', response.status);
        this.getServerData({pageIndex: DEFAULT_PAGE_TABLE, pageSize: this.pageSize});
      }else{
        this.commons.alert(`${response.name}: ${response.error}`, response.status);        
      }
    }else{
      this.commons.alert('Registro invalido', 'Canal');
    }    
  }

  public getServerData(event:any){
    const pagination = `?page=${event.pageIndex}&size=${event.pageSize}`;
    this.loadData(pagination);
    return event;
  }

  public async loadData(params: string = ''){
    this.loading = true;
    const response = await this.http.gethttp(`/channel${params}`).toPromise();
    this.loading = false;
    this.data = response.body.content;
    this.length = response.body.totalElements;
    this.dataSource = this.data;
  }

  ngOnInit(): void {}

}
