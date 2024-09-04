import { ReactNode } from "react";

export type ServerMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClientMessage = {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
  text?: string;
};

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export type ToolResultTypes = {
  tool: string;
  data: any;
};

export enum CallToolsToFetchDataEnumTypes {
  Components = "components",
  UserQuery = "userQuery",
}
