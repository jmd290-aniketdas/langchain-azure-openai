import { GPTModelCatalog } from "@/types/models.types";
import { StoredMessage } from "@langchain/core/messages";

export const CHATS_ROOT_LINK = "/chats";
export const FOLDERS_MANAGE_ROOT_LINK = "/folders/manage";
export const ACCOUNT_SETTINGS_ROOT_LINK = "/settings/account_settings";
export const PRIVACY_AND_SECURITY_ROOT_LINK = "/settings/privacy_amp_security";
export const APPEARENCE_AND_THEME_ROOT_LINK = "/settings/appearance_amp_theme";
export const SUPPORT_AND_HELP_ROOT_LINK = "/settings/support_amp_help";

export const imageExtensions = ["png", "jpg", "jpeg", "gif", "svg", "webp"];
export const pdfExtensions = ["pdf"];
export const wordExtensions = ["doc", "docx", "txt"];
export const excelExtensions = ["xls", "xlsx", "csv"];

export const TITLE_GEN_DEVELOPER_MSG = `
  You are an AI that generates engaging, concise, and context-aware titles for chat conversations between users and an assistant. Given the full conversation transcript, generate a short (max 6 - 8 words) title that clearly reflects the most relevant or likely intent of the conversation, even if only partially known. If the chat is too short to determine a specific topic, return a default but inviting and expressive title like "Starting a New Conversation" or "Opening Chat With Assistant"—avoid vague corporate phrases like "Inquiry" or "Assistance Request."
  Focus on:
    - Making the title feel natural and relevant to a human user
    - Avoiding stiff or overly formal language
    - Preferring curiosity and warmth when context is thin
    - Accurately reflect the main purpose or theme of the chat
    - Use clear, natural language with proper capitalization
    - Avoid vague terms
    - Exclude unnecessary punctuation or filler words
    - Avoid using the whole context as the title
  Return only the title as plain text. Do not include labels or explanations.
`;

export const SCRATCHPAD_GEN_SYSTEM_MSG = `
  You are an intelligent and helpful AI assistant designed to solve problems and answer questions accurately and concisely. Your primary goal is to understand the user's intent based on the context provided and respond with relevant, clear, and actionable information.
  Your responses should be:
  - Precise - stick strictly to what the user is asking
  - Concise - avoid unnecessary explanations or filler
  - Context-aware - adapt your answers to the specific information or scenario given
  - Helpful - offer practical steps, insights, or solutions the user can use immediately
  - Avoid speculation when information is insufficient. If something is unclear, ask clarifying questions before proceeding. When a task requires structured output (like a title, code snippet, or summary), format your response cleanly and consistently.
  When appropriate, use natural and conversational language — professional but not overly formal. Focus on usefulness, not verbosity.
`;

export const fileExtensionsCategories = [
  { category: "Images", extensions: imageExtensions },
  { category: "PDF Documents", extensions: pdfExtensions },
  { category: "Word Documents", extensions: wordExtensions },
  { category: "Excel Documents", extensions: excelExtensions },
];

export const DROPZONE_MAX_FILE_SIZE = 10 * 1024 * 1024;

export const GPT_MODELS_AVAILABLE: GPTModelCatalog[] = [
  {
    name: "gpt-4.5-preview",
    formalName: "GPT-4.5 Preview",
    description:
      "GPT-4.5 is OpenAI's largest and most advanced model for chat, offering improved pattern recognition and creative insights without reasoning capabilities.",
    footer: "Good for writing and exploring ideas",
    date: "2025-02-27",
    available: false,
  },
  {
    name: "o3-mini",
    formalName: "o3-mini",
    description:
      "o3-mini is a cost-efficient reasoning model optimized for STEM tasks, particularly excelling in science, math, and coding.",
    footer: "Fast at advanced reasoning",
    date: "2025-01-31",
    available: false,
  },
  {
    name: "o1",
    formalName: "o1",
    description:
      "o1 is a reflective generative pre-trained transformer designed to spend more time 'thinking' before responding, enhancing complex reasoning tasks, science, and programming.",
    footer: "Uses advanced reasoning",
    date: "2024-09-12",
    available: false,
  },
  {
    name: "o1-mini",
    formalName: "o1-mini",
    description:
      "o1-mini is a streamlined version of the o1 model, offering enhanced reasoning capabilities with lower computational overhead, suitable for cost-effective AI reasoning applications.",
    footer: "With reasoning capabilities",
    date: "2024-09-12",
    available: false,
  },
  {
    name: "gpt-4o",
    formalName: "GPT-4o",
    description:
      "GPT-4o is a multilingual, multimodal generative pre-trained transformer capable of processing and generating text, images, and audio.",
    footer: "Great for most questions",
    date: "2024-05-13",
    available: false,
  },
  {
    name: "gpt-4o-mini",
    formalName: "GPT-4o mini",
    description:
      "GPT-4o Mini is a smaller, cost-effective version of GPT-4o, supporting text and vision inputs with a context window of 128K tokens.",
    footer: "Faster for most questions",
    date: "2024-07-18",
    available: false,
  },
  {
    name: "gpt-4",
    formalName: "GPT-4",
    description:
      "GPT-4 is a large multimodal model capable of processing text and images, known for its advanced reasoning capabilities.",
    footer: "Legacy model",
    date: "2023-03-14",
    available: false,
  },
];

export const EMPTY_STORED_MESSAGE: StoredMessage = {
  type: "",
  data: {
    content: "",
    role: undefined,
    name: undefined,
    tool_call_id: undefined,
  },
};
