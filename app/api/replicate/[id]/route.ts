import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
 
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
 
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    const { id } = await context.params;
    const prediction = await replicate.predictions.get(id);
 
  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }
 
  return NextResponse.json(prediction);
}

// Add this type declaration
export type RouteSegment = { params: { id: string } };