import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  health() {
    return {
      status: "ok",
      service: "historias-de-vo-backend",
      timestamp: new Date().toISOString()
    };
  }
}

