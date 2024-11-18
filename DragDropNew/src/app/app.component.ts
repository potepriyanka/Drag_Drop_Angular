import {
  CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem,
  CdkDragEnter,
  CdkDragMove,
  CdkDragStart,
  DragRef,
  Point,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Device } from './model';
import { FormBuilder } from '@angular/forms';
import { fakeAsync } from '@angular/core/testing';
import { race } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public dragRack: boolean = false;
  public dragShelf: boolean = false;
  public dragCard: boolean = false;
  public dragModule: boolean = false;

  dataIds: string[] = [];

  checkoutForm = this.formBuilder.group({
    id: 0,
    name: '',
    type: '',
    boundary: '',
  });

  device: Device = {
    id: 0,
    name: '',
    type: '',
    boundary: '',
    elementLimit: 3,
    width: 0,
    height: 0,
    children: [],
  };
  updatedFlag: boolean = true;
  sourceData: Device[] = [
    {
      id: 686790,
      name: 'Rack-A',
      type: 'rack',
      boundary: '.overview',
      elementLimit: 3,
      width: 0,
      height: 0,
      children: [
        {
          id: 968000,
          name: 'Shelf-A',
          type: 'shelf',
          boundary: '.rack',
          elementLimit: 10,
          width: 0,
          height: 0,
          children: [
            {
              id: 6788000,
              name: 'Card-A',
              type: 'card',
              boundary: '.shelf',
              elementLimit: 10,
              width: 0,
              height: 0,
              children: [
                {
                  id: 8846849,
                  name: 'M-A',
                  type: 'module',
                  boundary: '.card',
                  width: 0,
                  height: 0,
                  children: [],
                },
                {
                  id: 8846850,
                  name: 'M-A',
                  type: 'module',
                  boundary: '.card',
                  width: 0,
                  height: 0,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  renderData = [
    {
      id: 686789,
      name: 'Rack-A',
      type: 'rack',
      boundary: '.overview',
      elementLimit: 3,
      width: 0,
      height: 0,
      children: [],
    },
    {
      id: 967999,
      name: 'Shelf-A',
      type: 'shelf',
      boundary: '.rack',
      elementLimit: 10,
      width: 0,
      height: 0,
      children: [],
    },
    {
      id: 6787999,
      name: 'Card-A',
      type: 'card',
      boundary: '.shelf',
      elementLimit: 10,
      width: 0,
      height: 0,
      children: [],
    },
    {
      id: 8846848,
      name: 'M-A',
      type: 'module',
      boundary: '.card',
      width: 0,
      height: 0,
    },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    for (let device of this.sourceData) {
      this.dataIds.push(device.id.toString());
    };

  }

  onCdkDragEntered(event: CdkDragEnter<any, any>) {
    this.device = event.item.data;
    switch (this.device.type) {
      case "shelf":
        console.log("shelf");
        this.dragRack = false;
        this.dragShelf = true;
        this.dragCard = false;
        this.dragModule = false;
        break;
      case "card":
        console.log("card");
        this.dragRack = false;
        this.dragShelf = false;
        this.dragCard = true;
        this.dragModule = false;
        break;
      case "module":
        console.log("module");
        this.dragShelf = false;
        this.dragRack = false;
        this.dragCard = false;
        this.dragModule = true;
        break;
        case "rack":
          console.log("rack");
          this.dragRack = true;
          this.dragShelf = false;
          this.dragCard = false;
          this.dragModule = false;
          break;
      default:
        this.dragRack = false;
        this.dragShelf = false;
        this.dragCard = false;
        this.dragModule = false;
        break;
    }
  }

  dragCheck(event: DragEvent) {
    console.log('Overrr');
    console.log(event);
  }

  drop(event: CdkDragDrop<any, any, any>) {
    let target = event.event.target as Element;
    //console.log(target);
    let dropElementId = Number(target.id);
    let device: Device = event.item.data;

    //console.log("Device");
    console.log(event);

    console.log('dropElementId : ' + dropElementId + '---' + device.id);

    //event.container.data.push(this.cloneDevice(device));
    transferArrayItem(event.previousContainer.data[0], event.container.data, event.previousIndex, event.currentIndex);
    console.log(JSON.stringify(this.sourceData));

  }

  dragPreview(event: CdkDragMove<any>) {
    console.log('entered');
    console.log(event);
  }

  dragChecksss(
    userPointerPosition: Point,
    dragRef: DragRef<any>,
    dimensions: ClientRect,
    pickupPositionInElement: Point
  ) {
    //let target = event.target as Element;
    //let dropElementId = Number(target.id);
    //let device: Device = event.

    //console.log("IDDDDD :"+device.id + '---' + dropElementId);

    console.log(userPointerPosition);
    console.log(pickupPositionInElement);
    if (false) {
    }
    return dragRef;
  }

  showDetails(event: MouseEvent, device: Device) {
    event.stopPropagation();
    //console.log(event);
    this.device = device;
  }

  deleteDevice() {
    console.log('Deleted' + JSON.stringify(this.device));
    let deletedFlag: boolean = true;
    this.sourceData.map((e, i) => {
      this.checkDeleteIdMatch(e, deletedFlag, i, this.sourceData);
      if (e.children && deletedFlag) {
        this.checkDeleteID(e.children, deletedFlag);
      }
    });
    console.log(JSON.stringify(this.sourceData));
  }

  checkDeleteID(data: Device[], deletedFlag: boolean) {
    data.map((e, i) => {
      this.checkDeleteIdMatch(e, deletedFlag, i, data);
      if (e.children && deletedFlag) {
        this.checkDeleteID(e.children, deletedFlag);
      }
    });
  }

  checkDeleteIdMatch(
    e: Device,
    deletedFlag: boolean,
    i: number,
    data: Device[]
  ) {
    if (e.id === this.device.id && deletedFlag) {
      console.log('Id Matching' + e.id);
      deletedFlag = false;
      data.splice(i, 1);
    }
  }

  onSubmit() {
    console.log('On Save');
  }

  checkChild(e: Device, dropElementId: number, device: Device) {
    if (e.children && this.updatedFlag) {
      e.children?.map((ch, i) => {
        console.log('Iterate Child data : ' + ch.id + '- i :' + i);
        this.checkIDMatching(ch, dropElementId, device);
      });
    }
  }

  //Note: break the statement if id matched and pushed
  checkIDMatching(ch: Device, dropElementId: number, device: Device) {
    if (ch.id === dropElementId && this.updatedFlag) {
      console.log('Id match : ' + ch.id);
      if (ch.type === 'rack' && device.type === 'shelf') {
        this.updatedFlag = false;
        let add = this.cloneDevice(device);
        ch.children?.push(add);
        console.log('Pushed' + add.id);
      } else if (ch.type === 'shelf' && device.type === 'card') {
        this.updatedFlag = false;
        let add = this.cloneDevice(device);
        ch.children?.push(add);
        console.log('Pushed' + add.id);
      } else if (ch.type === 'card' && device.type === 'module') {
        this.updatedFlag = false;
        let add = this.cloneDevice(device);
        ch.children?.push(add);
        console.log('Pushed' + add.id);
      }
    } else {
      this.checkChild(ch, dropElementId, device);
    }
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }

  cloneDevice(de: Device): Device {
    return {
      id: (de.id += 1),
      name: de.name,
      type: de.type,
      boundary: de.boundary,
      elementLimit: de.elementLimit,
      width: de.width,
      height: de.height,
      children: [],
    };
  }
}
