import { supabase } from "@app/utils/supabaseClient";

// export const config = {
//   runtime: "experimental-edge",
// };

export default async function handler(req: { body: any }, res: any) {
  // TODO: data validation

  const { data: dbResults, error: dbError } = await supabase
    .from("marketplace_seller_listings")
    .delete()
    .eq('id', req.body.listingId);

  if (dbError) {
    console.log(dbError);
    return res.status(500).send({ error: "Database error." });
  }

  return res.status(200).send({ data: { success: true } });
}
