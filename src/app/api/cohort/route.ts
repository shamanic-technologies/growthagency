import { NextResponse } from "next/server";
import { getCohortInfo } from "@/lib/stripe";

export async function GET() {
  try {
    const cohort = await getCohortInfo();
    return NextResponse.json(cohort);
  } catch (err) {
    console.error("[growthagency] Error fetching cohort info:", err);
    return NextResponse.json(
      { error: "Failed to fetch cohort info" },
      { status: 500 },
    );
  }
}
