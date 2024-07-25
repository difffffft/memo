import { UserModel, WordModel } from "@/models/WordModel";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const words = await WordModel.find();
  return new Response(JSON.stringify(words));
}
