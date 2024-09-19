import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { EventsService } from '../services/events/events.service';
import { EventData } from '../services/events/events.service';

@Component({
  standalone: true,
  selector: 'app-events',
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: []
})
export class EventsComponent implements OnInit {

  events: EventData[] = []; 
  filteredEvents: EventData[] = [];
  selectedEvent: EventData | null = null;
  filter = {
    siteId: '',
    timestamp: '',
    eventType: '',
      search: ''
  };

  constructor(private eventsService: EventsService) {
    this.eventsService.eventProcessed.subscribe((event: EventData) => {
      this.addEvent(event);
    });
  }

  ngOnInit(): void {
    // this.eventsService.createConnection();
    this.loadEvents();
  }

  addEvent(event: EventData) {
    const eventId = `${event.eventType}-${event.siteId}-${event.timestamp}`;
    if (!this.events.some(e => `${e.eventType}-${e.siteId}-${e.timestamp}` === eventId)) {
      this.events.push(event);
      this.filteredEvents = [...this.events];
      this.saveEvent(event);
    }
  }

  // loadEvents() {
  //   this.eventsService.getEvents().subscribe((events: EventData[]) => {
  //     this.events = events;
  //     this.filteredEvents = [...this.events];
  //   });
  // }

  loadEvents() {
    this.eventsService.getEvents().subscribe({
      next: (events: EventData[]) => {
        this.events = events;
        this.filteredEvents = [...this.events];
      },
      error: (err) => {
        console.error('Error loading events:', err);
      }
    });
  }
  

  saveEvent(event: EventData) {
    this.eventsService.saveEvent(event).subscribe(response => {
      console.log('Event saved successfully:', response);
    }, error => {
      console.error('Error saving event:', error);
    });
  }

  deleteEvent(eventToDelete: EventData, mouseEvent?: MouseEvent) {
    mouseEvent?.stopPropagation(); 
  
    if (!eventToDelete.id) {
      console.error('Event has no ID and cannot be deleted.');
      return;
    }
  
    this.eventsService.deleteEvent(eventToDelete.id).subscribe(
      response => {
        console.log('Event deleted successfully:', response);
        this.events = this.events.filter(e => e.id !== eventToDelete.id);
        this.filteredEvents = this.filteredEvents.filter(e => e.id !== eventToDelete.id);
        this.selectedEvent = null; 
      },
      error => {
        console.error('Error deleting event:', error);
      }
    );
  }
  


  selectEvent(event: EventData) {
    this.selectedEvent = event;
  }

  deselectEvent() {
    this.selectedEvent = null;
  }

  filterEvents() {
    this.filteredEvents = this.events.filter(event => {
      const matchesSiteId = this.filter.siteId ? event.siteId.toLowerCase().includes(this.filter.siteId.toLowerCase()) : true;
      const matchesTimestamp = this.filter.timestamp ? new Date(event.timestamp).toISOString().startsWith(new Date(this.filter.timestamp).toISOString().substring(0, 10)) : true;
      const matchesType = this.filter.eventType ? event.eventType.toLowerCase().includes(this.filter.eventType.toLowerCase()) : true;
      const matchesSearch = this.filter.search ? (
        event.siteId.toLowerCase().includes(this.filter.search.toLowerCase()) ||
        event.eventType.toLowerCase().includes(this.filter.search.toLowerCase()) ||
        new Date(event.timestamp).toISOString().startsWith(this.filter.search)
      ) : true;
      return matchesSiteId && matchesTimestamp && matchesType && matchesSearch;
    });
  }

  clearFilters() {
    this.filter = {
      search: '',
      siteId: '',
      timestamp: '',
      eventType: ''
    };
    this.filterEvents();
  }
  
  removeFilter(filterType: 'siteId' | 'timestamp' | 'eventType') {
    this.filter[filterType] = '';
    this.filterEvents();
  }
}
