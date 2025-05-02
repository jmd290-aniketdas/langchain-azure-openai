"use server";

import { GPT_MODELS_AVAILABLE } from "@/lib/consts";
import { GPT_MODELS_LANGCHAIN_MAP } from "@/lib/langchain";
import { GPTModelCatalog } from "@/types/models.types";

async function fetchAvailableGPTModels(): Promise<GPTModelCatalog[]> {
  "use server";
  const modelsWithAvailability = GPT_MODELS_AVAILABLE.map((model) => {
    const chatModel = GPT_MODELS_LANGCHAIN_MAP.find(
      (m) => m.name === model.name
    )?.model;
    return {
      ...model,
      available: !!chatModel,
    };
  });
  return modelsWithAvailability;
}

export { fetchAvailableGPTModels };

