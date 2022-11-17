import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export type AssessmentDto = {
  title: string;
  id: number;
  userId: number;
  completed: boolean;
};

export type Assessment = Omit<AssessmentDto, 'userId'> & { user: string };

@Injectable({ providedIn: 'root' })
export class RiskAssessmentsService {
  private http = inject(HttpClient);

  getAssessments() {
    return this.http.get<AssessmentDto[]>(
      `https://jsonplaceholder.typicode.com/todos`
    );
  }
}
