import Editor from "@monaco-editor/react";

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
    const editor = useEditor();

    return (
      <HTMLContainer
        style={{
          width: shape.props.w,
          height: shape.props.h,
          background: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: 8,
          overflow: "hidden",
          pointerEvents: "all",
        }}
      >
        <Editor
          height="100%"
          width="100%"
          value={shape.props.code}
          language={shape.props.language}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
          onChange={(value) => {
            editor.updateShape({
              id: shape.id,
              type: "code-block",
              props: {
                ...shape.props,
                code: value || "",
              },
            });
          }}
        />
      </HTMLContainer>
    );
  }

  indicator(shape: CodeBlockShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
