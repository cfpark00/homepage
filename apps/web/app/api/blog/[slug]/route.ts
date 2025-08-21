import { NextResponse } from "next/server"
import { getPostBySlug } from "@/lib/blog"

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params
    const post = getPostBySlug(params.slug)
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    )
  }
}