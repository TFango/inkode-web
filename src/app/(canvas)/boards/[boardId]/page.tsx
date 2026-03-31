import BoardCanvas from "@/components/canvas/BoardCanvas";

type Params = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardPage({ params }: Params) {
  const { boardId } = await params;
  return <BoardCanvas boardId={boardId} />;
}
