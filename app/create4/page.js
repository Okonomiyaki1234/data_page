"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MemberUpdateForm from "@/components/MemberUpdateForm";
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

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        メンバー情報更新
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        メンバー情報を更新して、新しい現し身へと生まれ変わりましょう。
                    </p>
                </div>

                <MemberUpdateForm />
            </main>
        </div>
    );
}
