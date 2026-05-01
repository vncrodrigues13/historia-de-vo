import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { HealthModule } from "./health/health.module";
import { OpenAiProviderAdapter } from "./providers/openai.provider";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
        PORT: Joi.number().default(3001),
        LLM_PROVIDER: Joi.string().valid("openai").default("openai"),
        OPENAI_API_KEY: Joi.string().allow("").default(""),
        OPENAI_MODEL: Joi.string().default("gpt-4.1-mini")
      })
    }),
    HealthModule
  ],
  providers: [OpenAiProviderAdapter]
})
export class AppModule {}
