import { getBoardById } from "@/lib/boards";
import { notFound } from "next/navigation";
import SharedCanvas from "@/components/canvas/SharedCanvas";

type Params = {
  params: Promise<{ boardId: string }>;
};

export default async function SharedBoardPage({ params }: Params) {
  const { boardId } = await params;
  const board = await getBoardById(boardId);

  if (!board || board.isPublic !== true) {
    notFound();
  }

  return <SharedCanvas boardId={boardId} name={board.name} />;
}
