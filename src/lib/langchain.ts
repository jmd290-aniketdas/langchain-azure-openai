import { AzureChatOpenAI } from "@langchain/openai";
import {
  AZURE_OPENAI_API_KEY_gpt_45_preview,
  AZURE_OPENAI_API_VERSION_gpt_45_preview,
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_45_preview,
  AZURE_OPENAI_ENDPOINT_gpt_45_preview,
  AZURE_OPENAI_API_KEY_gpt_o3_mini,
  AZURE_OPENAI_API_VERSION_gpt_o3_mini,
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o3_mini,
  AZURE_OPENAI_ENDPOINT_gpt_o3_mini,
  AZURE_OPENAI_API_KEY_gpt_o1,
  AZURE_OPENAI_API_VERSION_gpt_o1,
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o1,
  AZURE_OPENAI_ENDPOINT_gpt_o1,
  AZURE_OPENAI_API_KEY_gpt_o1_mini,
  AZURE_OPENAI_API_VERSION_gpt_o1_mini,
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o1_mini,
  AZURE_OPENAI_ENDPOINT_gpt_o1_mini,
  AZURE_OPENAI_API_KEY_gpt_4o,
  AZURE_OPENAI_API_VERSION_gpt_4o,
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4o,
  AZURE_OPENAI_ENDPOINT_gpt_4o,
  AZURE_OPENAI_API_KEY_gpt_4o_mini,
  AZURE_OPENAI_API_VERSION_gpt_4o_mini,
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4o_mini,
  AZURE_OPENAI_ENDPOINT_gpt_4o_mini,
  AZURE_OPENAI_API_KEY_gpt_4,
  AZURE_OPENAI_API_VERSION_gpt_4,
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4,
  AZURE_OPENAI_ENDPOINT_gpt_4,
  NODE_ENV,
} from "./environment-variables";
import { GPTModelCatalogMap } from "@/types/models.types";

declare global {
  var ChatModel_gpt_45_preview: AzureChatOpenAI | undefined;
  var ChatModel_gpt_o3_mini: AzureChatOpenAI | undefined;
  var ChatModel_gpt_o1: AzureChatOpenAI | undefined;
  var ChatModel_gpt_o1_mini: AzureChatOpenAI | undefined;
  var ChatModel_gpt_4o: AzureChatOpenAI | undefined;
  var ChatModel_gpt_4o_mini: AzureChatOpenAI | undefined;
  var ChatModel_gpt_4: AzureChatOpenAI | undefined;
}

var ChatModel_gpt_45_preview: AzureChatOpenAI | undefined = undefined;
var ChatModel_gpt_o3_mini: AzureChatOpenAI | undefined = undefined;
var ChatModel_gpt_o1: AzureChatOpenAI | undefined = undefined;
var ChatModel_gpt_o1_mini: AzureChatOpenAI | undefined = undefined;
var ChatModel_gpt_4o: AzureChatOpenAI | undefined = undefined;
var ChatModel_gpt_4o_mini: AzureChatOpenAI | undefined = undefined;
var ChatModel_gpt_4: AzureChatOpenAI | undefined = undefined;

if (
  AZURE_OPENAI_API_KEY_gpt_45_preview &&
  AZURE_OPENAI_API_VERSION_gpt_45_preview &&
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_45_preview &&
  AZURE_OPENAI_ENDPOINT_gpt_45_preview
) {
  ChatModel_gpt_45_preview =
    global.ChatModel_gpt_45_preview ||
    new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY_gpt_45_preview,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION_gpt_45_preview,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME_gpt_45_preview,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT_gpt_45_preview,
      model: "gpt-4.5-preview",
    });
}

if (
  AZURE_OPENAI_API_KEY_gpt_o3_mini &&
  AZURE_OPENAI_API_VERSION_gpt_o3_mini &&
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o3_mini &&
  AZURE_OPENAI_ENDPOINT_gpt_o3_mini
) {
  ChatModel_gpt_o3_mini =
    global.ChatModel_gpt_o3_mini ||
    new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY_gpt_o3_mini,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION_gpt_o3_mini,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o3_mini,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT_gpt_o3_mini,
      model: "gpt-o3-mini",
    });
}

if (
  AZURE_OPENAI_API_KEY_gpt_o1 &&
  AZURE_OPENAI_API_VERSION_gpt_o1 &&
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o1 &&
  AZURE_OPENAI_ENDPOINT_gpt_o1
) {
  ChatModel_gpt_o1 =
    global.ChatModel_gpt_o1 ||
    new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY_gpt_o1,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION_gpt_o1,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o1,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT_gpt_o1,
      model: "gpt-o1",
    });
}

if (
  AZURE_OPENAI_API_KEY_gpt_o1_mini &&
  AZURE_OPENAI_API_VERSION_gpt_o1_mini &&
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o1_mini &&
  AZURE_OPENAI_ENDPOINT_gpt_o1_mini
) {
  ChatModel_gpt_o1_mini =
    global.ChatModel_gpt_o1_mini ||
    new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY_gpt_o1_mini,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION_gpt_o1_mini,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME_gpt_o1_mini,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT_gpt_o1_mini,
      model: "gpt-o1-mini",
    });
}

if (
  AZURE_OPENAI_API_KEY_gpt_4o &&
  AZURE_OPENAI_API_VERSION_gpt_4o &&
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4o &&
  AZURE_OPENAI_ENDPOINT_gpt_4o
) {
  ChatModel_gpt_4o =
    global.ChatModel_gpt_4o ||
    new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY_gpt_4o,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION_gpt_4o,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4o,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT_gpt_4o,
      model: "gpt-4o",
    });
}

if (
  AZURE_OPENAI_API_KEY_gpt_4o_mini &&
  AZURE_OPENAI_API_VERSION_gpt_4o_mini &&
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4o_mini &&
  AZURE_OPENAI_ENDPOINT_gpt_4o_mini
) {
  ChatModel_gpt_4o_mini =
    global.ChatModel_gpt_4o_mini ||
    new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY_gpt_4o_mini,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION_gpt_4o_mini,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4o_mini,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT_gpt_4o_mini,
      model: "gpt-4o-mini",
    });
}

if (
  AZURE_OPENAI_API_KEY_gpt_4 &&
  AZURE_OPENAI_API_VERSION_gpt_4 &&
  AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4 &&
  AZURE_OPENAI_ENDPOINT_gpt_4
) {
  ChatModel_gpt_4 =
    global.ChatModel_gpt_4 ||
    new AzureChatOpenAI({
      azureOpenAIApiKey: AZURE_OPENAI_API_KEY_gpt_4,
      azureOpenAIApiVersion: AZURE_OPENAI_API_VERSION_gpt_4,
      azureOpenAIApiDeploymentName: AZURE_OPENAI_DEPLOYMENT_NAME_gpt_4,
      azureOpenAIEndpoint: AZURE_OPENAI_ENDPOINT_gpt_4,
      model: "gpt-4",
    });
}

if (NODE_ENV === "development") {
  global.ChatModel_gpt_45_preview = ChatModel_gpt_45_preview;
  global.ChatModel_gpt_o3_mini = ChatModel_gpt_o3_mini;
  global.ChatModel_gpt_o1 = ChatModel_gpt_o1;
  global.ChatModel_gpt_o1_mini = ChatModel_gpt_o1_mini;
  global.ChatModel_gpt_4o = ChatModel_gpt_4o;
  global.ChatModel_gpt_4o_mini = ChatModel_gpt_4o_mini;
  global.ChatModel_gpt_4 = ChatModel_gpt_4;
}

const GPT_MODELS_LANGCHAIN_MAP: GPTModelCatalogMap[] = [
  {
    name: "gpt-4.5-preview",
    model: ChatModel_gpt_45_preview,
  },
  {
    name: "o3-mini",
    model: ChatModel_gpt_o3_mini,
  },
  {
    name: "o1",
    model: ChatModel_gpt_o1,
  },
  {
    name: "o1-mini",
    model: ChatModel_gpt_o1_mini,
  },
  {
    name: "gpt-4o",
    model: ChatModel_gpt_4o,
  },
  {
    name: "gpt-4o-mini",
    model: ChatModel_gpt_4o_mini,
  },
  {
    name: "gpt-4",
    model: ChatModel_gpt_4,
  },
];

export { GPT_MODELS_LANGCHAIN_MAP };
