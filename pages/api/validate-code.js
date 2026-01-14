import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ valid: false, message: "Method Not Allowed" });
    }

    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ valid: false, message: "Code is required" });
    }

    // organizationテーブルのidがcodeと一致するデータを取得
    const { data, error } = await supabase
        .from("organization")
        .select("id")
        .eq("id", code)
        .single();

    if (error || !data) {
        return res.status(200).json({ valid: false });
    }

    return res.status(200).json({ valid: true });
}