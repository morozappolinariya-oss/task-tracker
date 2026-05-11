import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "Пароль должен быть не менее 6 символов" }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return Response.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name || null})
    `;

    return Response.json({ success: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
