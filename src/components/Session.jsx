import React from "react";
import { isDeck } from "../utils";
import { StdStage } from "./StdStage";
import { DeckStage } from "./DeckStage";

export function Session({ run, setRun, finish, quit }) {
  const item = run.items[run.i];
  const common = { run, setRun, finish, quit };
  return isDeck(item) ? <DeckStage key={item.id} {...common} /> : <StdStage key={item.id} {...common} />;
}
