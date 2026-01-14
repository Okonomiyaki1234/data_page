"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MemberForm from "@/components/MemberForm";
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
                        新規メンバー登録
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        メンバーとして登録して、新たな世界を切り拓きましょう。
                    </p>
                </div>

                <MemberForm />
            </main>
        </div>
    );
}
