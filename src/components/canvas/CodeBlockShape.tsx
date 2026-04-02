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
import { useEffect, useState } from "react";

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
  TLGeometryOpts,
  T,
  useEditor,
} from "tldraw";

import styles from "./CodeBlockShape.module.css";

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
    };
  }
}

type CodeBlockShapeProps = {
  w: number;
  h: number;
  code: string;
  language: string;
};

export type CodeBlockShape = TLBaseShape<"code-block", CodeBlockShapeProps>;

export class CodeBlockShapeUtil extends ShapeUtil<CodeBlockShape> {
  static override type = "code-block" as const;

  static override props = {
    w: T.number,
    h: T.number,
    code: T.string,
    language: T.string,
  };

  getDefaultProps(): CodeBlockShapeProps {
    return { w: 500, h: 300, code: "", language: "javascript" };
  }

  getGeometry(shape: CodeBlockShape, opts?: TLGeometryOpts): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  override canResize() {
    return true;
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
  const [isMoving, setIsMoving] = useState(false);
  const { mode } = useMode();

  const isCodeMode = mode === "code";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyQ") setIsMoving(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyQ") setIsMoving(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    const code = value || "";
    const detected = detectLanguage(code);
    editor.updateShape({
      id: shape.id,
      type: "code-block",
      props: { code, ...(detected ? { language: detected } : {}) },
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    editor.updateShape({
      id: shape.id,
      type: "code-block",
      props: { language: e.target.value },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shape.props.code);
  };

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pointerEvents: isCodeMode ? "all" : "none",
      }}
    >
      <div className={styles.toolbar}>
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
        <button
          className={styles.copyBtn}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={() => navigator.clipboard.writeText(shape.props.code)}
        >
          Copiar
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
