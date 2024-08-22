import {Pipe, PipeTransform} from '@angular/core';
import {JobNameEnum, JobNameType, MagusJobNameEnum} from "../../routes/profile/state/jobs/job.model";

@Pipe({
  name: 'jobImage',
  standalone: true
})
export class JobImagePipe implements PipeTransform {
  transform(job: JobNameType): string {
    const jobKey = this.getEnumKeyByValue(JobNameEnum, job) || this.getEnumKeyByValue(MagusJobNameEnum, job);

    if (jobKey) {
      const imageName = jobKey.toLowerCase();
      return `assets/jobs/${imageName}.jpg`;
    } else {
      return `assets/jobs/default.jpg`;
    }
  }

  private getEnumKeyByValue(enumType: any, value: JobNameType): string | undefined {
    return Object.keys(enumType).find(key => enumType[key] === value);
  }
}

