import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("returns ok status payload", () => {
    const controller = new HealthController();
    const result = controller.health();

    expect(result.status).toBe("ok");
    expect(result.service).toBe("historias-de-vo-backend");
    expect(typeof result.timestamp).toBe("string");
  });
});

