"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Notice() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadNotices() {
            setLoading(true);
            setError(null);

            try {
                const { data, error: sbError } = await supabase
                    .from("notice")
                    .select("id, title, content, date")
                    .order("id", { ascending: false });

                if (sbError) throw sbError;

                setNotices(data || []);
            } catch (e) {
                setError(String(e));
            } finally {
                setLoading(false);
            }
        }

        loadNotices();
    }, []);

    return (
        <div>
            <h2 className="text-xl text-gray-900 font-bold mb-6">お知らせ一覧</h2>

            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">読み込み中…</p>
                </div>
            ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-red-600">エラー: {error}</p>
                </div>
            ) : notices.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">お知らせはありません。</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map((n) => (
                        <div key={n.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {n.title}
                            </p>
                            <p className="text-gray-800 dark:text-gray-300 mb-2">
                                （{new Date(n.date).toLocaleDateString()}）
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                {n.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}