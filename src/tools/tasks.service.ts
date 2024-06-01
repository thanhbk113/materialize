import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron("0 */9 * * * *")
  handleCron() {
    try {
      axios.get(process.env.API_URL);
      this.logger.debug("Cron Job is working with url: " + process.env.API_URL);
    } catch (error) {
      this.logger.error("Cron Job is not working");
    }
  }
}
