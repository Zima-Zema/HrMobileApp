import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasksPage } from './tasks';
//plugins
import { NgCalendarModule } from 'ionic2-calendar';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { MonthViewComponent } from 'ionic2-calendar/monthview';
import { WeekViewComponent } from 'ionic2-calendar/weekview';
import { DayViewComponent } from 'ionic2-calendar/dayview';
import { TasksServicesApi } from '../../shared/TasksService'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [
    TasksPage,
  ],
  imports: [
    IonicPageModule.forChild(TasksPage),
    NgCalendarModule,
    TranslateModule

  ],
  providers: [TasksServicesApi,
    CalendarComponent,
    MonthViewComponent,
    WeekViewComponent,
    DayViewComponent]
})
export class TasksPageModule { }
