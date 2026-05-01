import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OpenAiProviderAdapter {
  constructor(private readonly configService: ConfigService) {}

  getModel(): string {
    return this.configService.getOrThrow<string>("OPENAI_MODEL");
  }
}

