import {
  chatInvoke,
  createNewChat,
  createNewMessage,
  fetchChatMessages,
  fetchChatTitle,
  updateChatTitle,
} from "@/actions/chats.actions";
import { sendChatStream } from "@/actions/chats.client.actions";
import { EMPTY_STORED_MESSAGE } from "@/lib/consts";
import { Message } from "@/types/chats.types";
import { StoredMessage } from "@langchain/core/messages";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useModelsContext } from "./models-context";

type ChatContext = {
  chatId: string;
  chatTitle: string;

  messages: Message[];

  chatTextStream: string;
  chatTextResponse: StoredMessage;
  chatLoading: boolean;
  chatStreaming: boolean;

  scratchpadTextStream: string;
  scratchpadTextResponse: StoredMessage;
  scratchpadLoading: boolean;
  scratchpadStreaming: boolean;

  loadChat: (chatId: string) => Promise<void>;
  newChat: () => void;
  sendChat: (message: string) => Promise<StoredMessage>;
  sendScratchpadChat: (message: string) => Promise<StoredMessage>;

  isWebSearchOn: boolean;
  setIsWebSearchOn: Dispatch<SetStateAction<boolean>>;
};

const ChatContext = createContext<ChatContext | undefined>(undefined);

const ChatProvider = ({ children }: { children?: React.ReactNode }) => {
  const [chatId, setChatId] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [chatTextStream, setChatTextStream] = useState<string>("");
  const [chatTextResponse, setChatTextResponse] = useState<StoredMessage>(EMPTY_STORED_MESSAGE);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatStreaming, setChatStreaming] = useState<boolean>(false);

  const [scratchpadTextStream, setScratchpadTextStream] = useState<string>("");
  const [scratchpadTextResponse, setScratchpadTextResponse] = useState<StoredMessage>(EMPTY_STORED_MESSAGE);
  const [scratchpadLoading, setScratchpadLoading] = useState<boolean>(false);
  const [scratchpadStreaming, setScratchpadStreaming] = useState<boolean>(false);

  const [isWebSearchOn, setIsWebSearchOn] = useState<boolean>(false);

  const { selectedModel } = useModelsContext();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { chatId: paramsChatId }: { chatId: string } = useParams();

  useEffect(() => {
    if (!pathname.includes("/chats")) return;
    if (!paramsChatId) newChat();
    else loadChat(paramsChatId);
  }, [pathname, paramsChatId]);

  const loadChat = async (_chatId: string) => {
    setChatLoading(true);
    try {
      setChatId(_chatId);

      const chatTitle = await fetchChatTitle(_chatId);
      setChatTitle(chatTitle);

      const chatMessages = await fetchChatMessages(_chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error(error);
      router.push("/chats");
    } finally {
      setChatLoading(false);
    }
  };

  const newChat = () => {
    setChatLoading(true);
    setChatId("");
    setChatTitle("New Chat");
    setMessages([]);
    setChatLoading(false);
  };

  const sendChat = async (message: string) => {
    try {
      if (sessionStatus !== "authenticated") throw new Error("Not Authenticated");

      const userMessage: Message = { role: "user", content: message };

      let newChatId: string = "";
      if (!chatId) {
        const newChat = await createNewChat(session.user.email);
        newChatId = newChat.id;
        setChatId(newChat.id);
        router.push(`/chats/${newChat.id}`);
      }

      setMessages([...messages, userMessage]);

      const res = await sendChatStream({
        modelName: selectedModel,
        messages: [...messages, userMessage],
        streamingTextSetter: setChatTextStream,
        loadingSetter: setChatLoading,
        streamingSetter: setChatStreaming,
        responseSetter: setChatTextResponse,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: res.data.content,
      };

      setMessages([...messages, userMessage, assistantMessage]);

      if (newChatId) {
        await createNewMessage(newChatId, userMessage);
        await createNewMessage(newChatId, assistantMessage);

        const developerMessage: Message = {
          role: "developer",
          content:
            "Summerize the context of the above message into a meaningful title. Return only the Title without any other unnecessary data.",
        };
        const titleRes = await chatInvoke(selectedModel, [...messages, userMessage, assistantMessage, developerMessage]);
        setChatTitle(titleRes.data.content);
        await updateChatTitle(newChatId, titleRes.data.content);
      } else {
        await createNewMessage(chatId, userMessage);
        await createNewMessage(chatId, assistantMessage);
      }

      return res;
    } catch (error) {
      throw error;
    }
  };

  const sendScratchpadChat = async (message: string) => {
    try {
      setScratchpadTextStream(message);
      const systemMessage: Message = {
        role: "system",
        content:
          "You are an intelligent AI model who helps in solving problems, and gives very precise and concise answers according to the context of the user",
      };
      const userMessage: Message = {
        role: "user",
        content: message,
      };
      const res = await sendChatStream({
        modelName: selectedModel,
        messages: [systemMessage, userMessage],
        streamingTextSetter: setScratchpadTextStream,
        loadingSetter: setScratchpadLoading,
        streamingSetter: setScratchpadStreaming,
        responseSetter: setScratchpadTextResponse,
      });
      return res;
    } catch (error) {
      setScratchpadTextStream("An error occured");
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatId,
        chatTitle,
        messages,
        chatTextStream,
        chatTextResponse,
        chatLoading,
        chatStreaming,
        scratchpadTextStream,
        scratchpadTextResponse,
        scratchpadLoading,
        scratchpadStreaming,
        loadChat,
        newChat,
        sendChat,
        sendScratchpadChat,
        isWebSearchOn,
        setIsWebSearchOn,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => {
  const _context = useContext(ChatContext);
  if (!_context) throw new Error("useChatContext must be used within a ChatProvider");
  return _context;
};

export { ChatProvider, useChatContext, type ChatContext };
