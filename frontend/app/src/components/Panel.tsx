import React, { ReactNode } from "react";

interface PanelProps {
  type: string;
  title: string;
  children: ReactNode;
}

export const Panel = ({ type, title, children }: PanelProps) => {
  return (
    <div className={"panel panel-" + type}>
      <div className="panel-title">{title}</div>
      <div className="panel-content">{children}</div>
    </div>
  );
};
