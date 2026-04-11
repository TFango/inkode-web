import React, { useState } from "react";
import { useMode } from "@/context/modeContext";
import Editor from "@monaco-editor/react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import cpp from "highlight.js/lib/languages/cpp";
import sql from "highlight.js/lib/languages/sql";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("php", php);
hljs.registerLanguage("ruby", ruby);

const HLJS_TO_MONACO: Record<string, string> = {
  xml: "html",
  bash: "shell",
};

function detectLanguage(code: string): string | null {
  if (code.trim().length < 20) return null;
  const result = hljs.highlightAuto(code);
  if (!result.language || (result.relevance ?? 0) < 5) return null;
  return HLJS_TO_MONACO[result.language] ?? result.language;
}

import {
  Geometry2d,
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  TLBaseShape,
  TLResizeInfo,
  T,
  useEditor,
} from "tldraw";


import styles from "./CodeBlockShape.module.css";
import { useAnalytics } from "@/hooks/useAnalytics";

declare module "tldraw" {
  interface TLShapeUtilMap {
    "code-block": CodeBlockShapeUtil;
  }

  interface TLGlobalShapePropsMap {
    "code-block": {
      w: number;
      h: number;
      code: string;
      language: string;
      userResized: boolean;
    };
  }
}

type CodeBlockShapeProps = {
  w: number;
  h: number;
  code: string;
  language: string;
  userResized: boolean;
};

export type CodeBlockShape = TLBaseShape<"code-block", CodeBlockShapeProps>;

export class CodeBlockShapeUtil extends ShapeUtil<CodeBlockShape> {
  static override type = "code-block" as const;

  static override props = {
    w: T.number,
    h: T.number,
    code: T.string,
    language: T.string,
    userResized: T.boolean,
  };

  getDefaultProps(): CodeBlockShapeProps {
    return { w: 500, h: 300, code: "", language: "javascript", userResized: false };
  }

  getGeometry(shape: CodeBlockShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
  }

  override canBind() {
    return false;
  }

  override onResize(shape: CodeBlockShape, info: TLResizeInfo<CodeBlockShape>) {
    return {
      props: {
        w: Math.max(200, shape.props.w * info.scaleX),
        h: Math.max(100, shape.props.h * info.scaleY),
        userResized: true,
      },
    };
  }

  component(shape: CodeBlockShape) {
    return (
      <HTMLContainer style={{ width: shape.props.w, height: shape.props.h }}>
        <CodeBlockContent shape={shape} />
      </HTMLContainer>
    );
  }

  indicator(shape: CodeBlockShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

export function CodeBlockContent({ shape }: { shape: CodeBlockShape }) {
  const editor = useEditor();
  const { mode } = useMode();
  const { track } = useAnalytics();
  const [copied, setCopied] = useState(false);

  const isCodeMode = mode === "code";

  const LINE_HEIGHT = 19;
  const TOOLBAR_HEIGHT = 40;
  const MIN_LINES = 5;
  const PADDING = 16;
  const CHAR_WIDTH = 7.8;
  const MIN_WIDTH = 500;

  const handleCodeChange = (value: string | undefined) => {
    const code = value || "";
    const detected = detectLanguage(code);
    const lines = Math.max(MIN_LINES, code.split("\n").length);
    const autoH = lines * LINE_HEIGHT + TOOLBAR_HEIGHT + PADDING;
    const longestLine = Math.max(...code.split("\n").map((l) => l.length));
    const autoW = Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH + PADDING * 2);
    editor.updateShape({
      id: shape.id,
      type: "code-block",
      props: {
        code,
        ...(shape.props.userResized ? {} : { h: autoH, w: autoW }),
        ...(detected ? { language: detected } : {}),
      },
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editor.updateShape({
      id: shape.id,
      type: "code-block",
      props: { language: e.target.value },
    });
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pointerEvents: isCodeMode ? "all" : "none",
      }}
    >
      <div className={styles.toolbar}>
        {/* Selector de lenguaje con prefijo { } */}
        <div className={styles.selectWrap}>
          <span className={styles.selectPrefix}>{"{ }"}</span>
          <select
            value={shape.props.language}
            onChange={handleLanguageChange}
            className={styles.select}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="json">JSON</option>
            <option value="shell">Bash/Shell</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
          </select>
        </div>

        {/* Botón copiar con ícono + feedback */}
        <button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ""}`}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={() => {
            navigator.clipboard.writeText(shape.props.code);
            track("code_copied", { language: shape.props.language });
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? (
            <>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7.5l3 3 6-6" />
              </svg>
              Copiado
            </>
          ) : (
            <>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="4.5" width="7" height="8" rx="1.5" />
                <path d="M3.5 9.5H3a1.5 1.5 0 01-1.5-1.5V3A1.5 1.5 0 013 1.5h5A1.5 1.5 0 019.5 3v1" />
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>

      <Editor
        value={shape.props.code}
        language={shape.props.language}
        theme="vs-dark"
        onChange={handleCodeChange}

        options={{
          readOnly: !isCodeMode,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
}
