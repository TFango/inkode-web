import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

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
    editor.updateShape({
      id: shape.id,
      type: "code-block",
      props: { code: value || "" },
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
      onPointerDown={(e) => e.stopPropagation()} // evita que tldraw intercepte los clicks
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pointerEvents: isMoving ? "none" : "all",
      }}
    >
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, padding: 8 }}>
        <select value={shape.props.language} onChange={handleLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
        <button onClick={handleCopy}>Copiar</button>
      </div>

      {/* Editor */}
      <Editor
        value={shape.props.code}
        language={shape.props.language}
        theme="vs-dark"
        onChange={handleCodeChange}
        options={{
          readOnly: isMoving,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
}
