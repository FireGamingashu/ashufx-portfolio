import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export type Category = "gaming" | "educational" | "etc";

export interface Thumbnail {
  id: string;
  url: string;
  title: string;
  tag: string;
  description: string;
  price: number;
  category: Category;
  createdAt: number;
  docId: string;
}

type DB = Record<Category, Thumbnail[]>;

const REDIS_KEY = "ashufx:thumbnails";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function readDB(): Promise<DB> {
  const raw = await redis.get<DB>(REDIS_KEY);
  return raw ?? { gaming: [], educational: [], etc: [] };
}

async function writeDB(data: DB): Promise<void> {
  await redis.set(REDIS_KEY, data);
}

// ── GET /api/thumbnails?category=gaming ──────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") as Category | null;
    const db = await readDB();
    if (category && db[category]) {
      const sorted = [...db[category]].sort((a, b) => b.createdAt - a.createdAt);
      return NextResponse.json(sorted);
    }
    return NextResponse.json(db);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// ── POST /api/thumbnails — body: { category, url, title, tag, price } ─────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      category: Category;
      url: string;
      title?: string;
      tag?: string;
      description?: string;
      price?: number;
    };
    const db = await readDB();

    const existing = db[body.category] ?? [];
    const nums = existing
      .map((t) => parseInt(t.id.replace("thumb", ""), 10))
      .filter((n) => !isNaN(n));
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const id    = `thumb${nextNum}`;
    const docId = `${body.category}_${id}_${Date.now()}`;

    const thumb: Thumbnail = {
      id,
      url:         body.url,
      title:       body.title       ?? "Untitled",
      tag:         body.tag         ?? body.category,
      description: body.description ?? "",
      price:       body.price       ?? 6,
      category:    body.category,
      createdAt:   Date.now(),
      docId,
    };

    db[body.category] = [thumb, ...existing];
    await writeDB(db);
    return NextResponse.json(thumb, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// ── PATCH /api/thumbnails — body: { category, docId, title, tag, url } ────────

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json() as {
      category: Category;
      docId: string;
      title?: string;
      tag?: string;
      description?: string;
      price?: number;
      url?: string;
    };
    const db   = await readDB();
    const list = db[body.category] ?? [];
    const idx  = list.findIndex((t) => t.docId === body.docId);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.title       !== undefined) list[idx].title       = body.title;
    if (body.tag         !== undefined) list[idx].tag         = body.tag;
    if (body.description !== undefined) list[idx].description = body.description;
    if (body.price       !== undefined) list[idx].price       = body.price;
    if (body.url         !== undefined) list[idx].url         = body.url;

    db[body.category] = list;
    await writeDB(db);
    return NextResponse.json(list[idx]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// ── DELETE /api/thumbnails?category=gaming&docId=xxx ──────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") as Category;
    const docId    = req.nextUrl.searchParams.get("docId");
    if (!category || !docId) {
      return NextResponse.json({ error: "category and docId required" }, { status: 400 });
    }
    const db = await readDB();
    db[category] = (db[category] ?? []).filter((t) => t.docId !== docId);
    await writeDB(db);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
