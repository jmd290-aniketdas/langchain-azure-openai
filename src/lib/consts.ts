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

export const fileExtensionsCategories = [
  { category: "Images", extensions: imageExtensions },
  { category: "PDF Documents", extensions: pdfExtensions },
  { category: "Word Documents", extensions: wordExtensions },
  { category: "Excel Documents", extensions: excelExtensions },
];

export const DROPZONE_MAX_FILE_SIZE = 10 * 1024 * 1024;
