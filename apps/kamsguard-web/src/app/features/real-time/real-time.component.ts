import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';

interface Event {
  cam?: string;
  alm?: string;
  index?: string;
  ondisk?: boolean;
  duration?: string;
  pre_alarm?: string;
  archive?: string;
  entry_status?: string;
  alm_type?: string;
}

@Component({
  selector: 'app-real-time',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatListModule, MatChipsModule, MatTableModule],
  templateUrl: './real-time.component.html',
  styleUrl: './real-time.component.scss',
})

export class RealTimeComponent implements OnInit{

  events: Event[] = [];

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchEvents();
  }

  // fetchEvents(): void {
  //   this.http.get<Event[]>('http://localhost:3300/events')
  //     .subscribe((data) => {
  //       this.events = data;
  //     });
  // }

  fetchEvents(): void {
    this.http.get<any[]>('http://localhost:3300/events')
      .subscribe((data) => {
        this.events = data.map(item => ({
          cam: item['0'],
          alm: item['1'],
          index: item['2'],
          ondisk: item['10800'] === '1',  // Example condition
          duration: item['22834'],
          pre_alarm: item['1724397538'],
          archive: item['Flame [MDKFire]'],
          entry_status: item[''],
          alm_type: item['exists']
        }));
      });
  }
  

}
