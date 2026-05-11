import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const [task] = await sql`
    UPDATE tasks
    SET completed = ${body.completed}
    WHERE id = ${id} AND user_id = ${session.user.id}
    RETURNING id, text, completed, category, deadline, created_at
  `;

  if (!task) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(task);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await sql`
    DELETE FROM tasks
    WHERE id = ${id} AND user_id = ${session.user.id}
  `;

  return new Response(null, { status: 204 });
}
