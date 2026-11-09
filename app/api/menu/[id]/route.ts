import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET (request: Request, {params}: RouteParams) {
    const resolvedParams = await params;
    const numericId = parseInt(resolvedParams.id, 10);
    const item = menu.find((m) => m.id === numericId);

    if (!item) {
    return NextResponse.json({ pesan: "Menu tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(item);
}
