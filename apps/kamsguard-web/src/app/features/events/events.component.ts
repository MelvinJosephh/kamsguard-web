import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventsService } from '../services/events/events.service';
import { EventData } from '../services/events/events.service'; // Import EventData

@Component({
  standalone: true,
  selector: 'app-events',
  imports: [CommonModule, MatExpansionModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: []
})
export class EventsComponent implements OnInit {
  events: EventData[] = []; // Use EventData interface for type safety

  constructor(private eventsService: EventsService) {
    this.eventsService.eventProcessed.subscribe((event: EventData) => {
      this.addEvent(event);
    });
  }

  ngOnInit(): void {
    // Call createConnection from the service
    this.eventsService.createConnection();
  }

  // Helper function to add events to the array
  addEvent(event: EventData) {
    const eventId = `${event.eventType}-${event.siteId}-${event.timestamp}`;
    if (!this.events.some(e => `${e.eventType}-${e.siteId}-${e.timestamp}` === eventId)) {
      this.events.push(event);
    }
  }
}
