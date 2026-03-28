"use client";
import {
  DefaultToolbar,
  DefaultToolbarContent,
} from "tldraw";
import { ModeToggleButton } from "./ModeToggleButton";
import AddCodeBlockButton from "./AddCodeBlockButton";

export default function CustomToolbar() {
  return (
    <DefaultToolbar>
      <DefaultToolbarContent />
      <ModeToggleButton />
      <AddCodeBlockButton />
    </DefaultToolbar>
  );
}