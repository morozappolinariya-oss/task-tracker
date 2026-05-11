import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await sql`
    SELECT id, text, completed, category, deadline, created_at
    FROM tasks
    WHERE user_id = ${session.user.id}
    ORDER BY created_at DESC
  `;

  return Response.json(tasks);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, category, deadline } = await request.json();

  if (!text || !category) {
    return Response.json({ error: "text and category are required" }, { status: 400 });
  }

  const [task] = await sql`
    INSERT INTO tasks (user_id, text, category, deadline, created_at)
    VALUES (${session.user.id}, ${text}, ${category}, ${deadline || null}, ${Date.now()})
    RETURNING id, text, completed, category, deadline, created_at
  `;

  return Response.json(task, { status: 201 });
}
