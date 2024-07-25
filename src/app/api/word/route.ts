import { WordModel } from "@/models/WordModel";

import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const json = await request.json();
  const wordModel = new WordModel(json);
  try {
    await wordModel.save();
    return new Response(
      JSON.stringify({
        code: 200,
        data: null,
        msg: "ok",
      })
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        code: 500,
        data: null,
        msg: "ERROR" + error.message,
      })
    );
  }
}
