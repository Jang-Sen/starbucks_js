import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello starbucks_js!';
  }

  // @Cron('* * * * * *')
  scheduleTest() {
    return console.log('스케줄러 테스트');
  }
}
