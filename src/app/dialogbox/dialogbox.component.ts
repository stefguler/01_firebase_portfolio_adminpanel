import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.css']
})
export class DialogboxComponent {

  constructor(private navigationService: NavigationService) {

  }

  @Input() message: string;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

}

