import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListviewComponent } from '../shared/components/listview/listview.component';
import { Employee } from '../shared/models/employee';
import { Group } from '../shared/models/group';
import { EmployeeService } from '../shared/services/employee-service';
import { GroupService } from '../shared/services/group-service';
import { WorkerFormComponent } from './worker-form/worker-form.component';

@Component({
  selector: 'app-mitarbeiter',
  templateUrl: './mitarbeiter.component.html',
  styleUrls: ['./mitarbeiter.component.scss']
})

export class MitarbeiterComponent implements OnInit {
  showWorkerForm: boolean = false;
  showNewEmployeeForm: boolean = false;
  toggleGroup: boolean = true;

  topTitle: string = 'Mitarbeiter';
  midTitle: string = 'Gruppen';
  botTitle: string = 'Schichtplan';

  buttonTitleNewWorker = 'Neuer Mitarbeiter';
  buttonTitleGroup = 'Mitarbeiter in dieser Gruppe verwalten';
  buttonTitleWorker = 'Neuer Mitarbeiter';

  iconMitarbeiter = "mitarbeiter";
  iconGroup = "group";

  employeeList: Employee[];
  groupEmployeeList: Employee[];
  groupList: Group[];

  selectedEmployee: Employee;
  selectedGroup: Group;

  groupService;
  employeeService;
  constructor(eService: EmployeeService, gService: GroupService, private modalService: NgbModal) {
    this.employeeService = eService;
    this.groupService = gService;
    this.employeeList = this.employeeService.getAllEmployees();
    this.groupList = this.groupService.getAllGroups();
  }

  ngOnInit(): void {
  }

  @ViewChild(WorkerFormComponent) wfc: WorkerFormComponent;

  itemDetails(value: any) {
    document.getElementById("workerForm").removeAttribute("hidden");
    this.showNewEmployeeForm = false;
    this.wfc.changeEntrys(value);
  }

  showForms(value) {
    this.showNewEmployeeForm = true;
    document.getElementById("workerForm").setAttribute("hidden", "true");
  }

  showGroupMembers(value: Group) {
    this.selectedEmployee = undefined;
    this.groupEmployeeList = this.employeeList.filter(x => x.groupIdgroup == value.idgroups);
  }

  setEmployee(value: Employee) {
    this.selectedEmployee = value;
  }

  swapGroup() {
    if (this.selectedEmployee == null) {
      //TODO:
      console.log("bitte einen employee auswählen");
    } else {
      const modalRef = this.modalService.open(ListviewComponent);
      modalRef.componentInstance.list = this.groupList;
      modalRef.componentInstance.buttonTitle = 'zur Gruppe hinzufügen';
      modalRef.componentInstance.iconName = this.iconGroup;

      // gets group selection in listview
      modalRef.componentInstance.itemEvent.subscribe(($event) => {
        this.selectedGroup = $event;
      })

      // sets the group swap
      modalRef.componentInstance.showButton1Value.subscribe(($event) => {
        console.log(this.selectedGroup);
        this.changeEmployeeGroup();
        modalRef.close();
      })
    }
  }

  propsToRemove = [
    "group",
    "loginfailedcounter",
    "usersafetycode",
    "usersafetycodedate",
    "usersafetycodeexpiredate",
    "salt",
    "createdat",
    "lastpasswordresetat",
    "inactiveList",
    "text",
    "birthday",
    "email",
    "phonenumber",
    "isdeleted",
    "targetweeklyworkinghours"
  ]

  public changeEmployeeGroup(): void {
    let clone = JSON.parse(JSON.stringify(this.selectedEmployee));
    let i = 0;

    for (let [key] of Object.entries(clone)) {
      this.propsToRemove.forEach(element => {
        delete clone[element];
      });
      if (key === "groupIdgroup") {
        this.selectedEmployee.groupIdgroup = this.selectedGroup.idgroups;
        clone.groupIdgroup = this.selectedGroup.idgroups;
      }
    }
    //remove from current grouplist
    this.groupEmployeeList = this.groupEmployeeList.filter(item => item !== this.selectedEmployee)
    this.employeeService.changeEmployee(clone);
  }

}
