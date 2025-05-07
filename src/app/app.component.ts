import { Component, Inject, OnInit } from '@angular/core';
import { MasterService } from './Service/master.service';
import { ApiResponseModel, ITask, Task } from './Model/task';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [DatePipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  taskObj: Task = new Task();
  taskList: ITask[] = [];

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadAllTask();
  }

  loadAllTask() {
    this.masterService.getAllTaskList().subscribe((res: ApiResponseModel) => {
      this.taskList = res.data;
    });
  }

  addTask() {
    this.masterService.addNewTask(this.taskObj).subscribe(
      (res: ApiResponseModel) => {
        if (res.result) {
          alert('Task Created Successfully');
          this.loadAllTask();
          this.taskObj = new Task();
        }
      },
      (error) => {
        alert('API call error');
      }
    );
  }

  onEdit(item: Task) {
    this.taskObj = item;
    setTimeout(() => {
      const dat = new Date(this.taskObj.dueDate);
      const day = ('0' + dat.getDate()).slice(-2);
      const month = ('0' + (dat.getMonth() + 1)).slice(-2);
      const today = dat.getFullYear() + '-' + month + '-' + day;
      // tslint:disable-next-line:no-string-literal

      (<HTMLInputElement>document.getElementById('textDate')).value = today;
      // const dateField =  document.getElementById('textDate');
      // if(dateField != null) {
      //   dateField['value'] = today;
      // }
    }, 1000);
  }

  updateTask() {
    this.masterService.updateTask(this.taskObj).subscribe(
      (res: ApiResponseModel) => {
        if (res.result) {
          alert('Task Updated Successfully');
          this.loadAllTask();
          this.taskObj = new Task();
        }
      },
      (error) => {
        alert('API call error');
      }
    );
  }

  onDelete(id: number) {
    const isConfirm = confirm('Are you sure you want to delete this?');
    if (isConfirm) {
      this.masterService.deleteTask(id).subscribe(
        (res: ApiResponseModel) => {
          if (res.result) {
            alert('Task Deleted Successfully');
            this.loadAllTask();
            this.taskObj = new Task();
          }
        },
        (error) => {
          alert('API call error');
        }
      );
    }
  }
}
