import { Component, inject, Injectable, OnInit, VERSION } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subject,
  Subscription,
  tap,
} from 'rxjs';
import {
  Assessment,
  RiskAssessmentsService,
} from './services/risk-assessment.service';
import { UsersService } from './services/users.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  riskAssessmentService = inject(RiskAssessmentsService);
  usersService = inject(UsersService);
  users$ = this.usersService.users$;

  private filterAction$ = new BehaviorSubject<string>('all');

  riskAssessments$: Observable<Assessment[]> = combineLatest([
    this.riskAssessmentService.getAssessments(),
    this.users$,
  ]).pipe(
    map(([assessments, users]) =>
      assessments.map((assessment) => {
        const { userId, ...rest } = assessment;
        return {
          ...rest,
          user:
            users.find((user) => user.id === assessment.userId).name ??
            'No user found',
        };
      })
    )
  );

  filteredAssesments$ = combineLatest([
    this.riskAssessments$,
    this.filterAction$.asObservable(),
  ]).pipe(
    tap(console.log),
    map(([assessments, filterOption]) =>
      assessments.filter(({ completed }) => {
        if (filterOption === 'completed') {
          return completed === true;
        }
        if (filterOption === 'uncompleted') {
          return completed === false;
        }
        return true;
      })
    )
  );

  filterChanges(value: string) {
    this.filterAction$.next(value);
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;

  assessments$ = this.dashboardService.filteredAssesments$;

  filterControl = new FormControl('all');

  private subscription = new Subscription();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.subscription.add(
      this.filterControl.valueChanges
        .pipe(tap((value) => this.dashboardService.filterChanges(value)))
        .subscribe()
    );
  }
}
