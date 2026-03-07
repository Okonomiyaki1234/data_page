"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Notice_Org from "@/components/Notice_Org";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CreatePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [orgName, setOrgName] = useState("");

    useEffect(() => {
        const fetchOrgName = async () => {
            const orgCode = typeof window !== "undefined" ? localStorage.getItem("organization_code") : null;
            if (!orgCode) return;
            const { data, error } = await supabase
                .from("organization")
                .select("name")
                .eq("id", orgCode)
                .single();
            if (data && data.name) setOrgName(data.name);
        };
        fetchOrgName();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 共通ヘッダー */}
            <Header orgName={orgName} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            {/* ...existing code... */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        組織お知らせ登録
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        組織ごとのお知らせを登録します。登録実行は管理者のみ可能です。
                    </p>
                </div>

                <Notice_Org />
            </main>
        </div>
    );
}
