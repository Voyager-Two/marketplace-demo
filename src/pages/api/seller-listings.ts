import { supabase } from "@app/utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const url = req.nextUrl;
  const allowedParams = ["id"];
  const params: any = [];

  url.searchParams.forEach((value, key) => {
    if (allowedParams.includes(key)) {
      params[key] = value;
    }
  });

  const { id } = params;

  // TODO: real world would filter by user id
  const { data: dbResults, error: dbErr } = await supabase
    .from("marketplace_seller_listings")
    .select("*")
    // sort by newest first
    .order("id", { ascending: false })

  if (dbErr) {
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }

  if (!dbResults || !dbResults[0]) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const output = dbResults ? dbResults : {};

  return NextResponse.json(
    { data: { ...output } },
  );
}
