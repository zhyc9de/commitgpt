// Adapted from: https://github.com/wong2/chat-gpt-google-extension/blob/main/background/index.mjs

import {
  OpenAIClient,
  AzureKeyCredential,
  OpenAIKeyCredential,
} from "@azure/openai";
import { getApiKey, getPromptOptions } from "./config.js";
import { getConfig } from "./config_storage.js";

let openai: OpenAIClient;
let basePath = getConfig<string | undefined>("basePath");
let apiKey = await getApiKey();
if (basePath?.includes("azure")) {
  openai = new OpenAIClient(basePath, new AzureKeyCredential(apiKey));
} else {
  openai = new OpenAIClient(new OpenAIKeyCredential(apiKey));
}
console.log('测试下',basePath,apiKey)

export class ChatGPTClient {
  async getAnswer(question: string): Promise<string> {
    const { model, maxTokens, temperature } = await getPromptOptions();

    try {
      const result = await openai.getCompletions(model, [question], {
        maxTokens,
        temperature,
      });
      return result.choices[0].text;
    } catch (e) {
      console.error(e?.response ?? e);
      throw e;
    }

    // @ts-ignore
  }
}
