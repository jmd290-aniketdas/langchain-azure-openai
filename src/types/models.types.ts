import { AzureChatOpenAI } from "@langchain/openai";

type GPTModelCatalog = {
  name: string;
  formalName: string;
  description: string;
  footer: string;
  date: string;
  available: boolean;
};

type GPTModelCatalogMap = {
  name: string;
  model?: AzureChatOpenAI;
}

export { type GPTModelCatalog, type GPTModelCatalogMap };
