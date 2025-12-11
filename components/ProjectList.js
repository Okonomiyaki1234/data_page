"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);


export default function ListProject() {
    const [project, setProject] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                // project一覧取得
                const { data: projectData, error: projectError } = await supabase
                    .from("project")
                    .select("id, name, duration, roler")
                    .order("id", { ascending: false });
                if (projectError) throw projectError;

                // member一覧取得
                const { data: memberData, error: memberError } = await supabase
                    .from("member")
                    .select("id, name");
                if (memberError) throw memberError;

                setProject(projectData);
                setMembers(memberData);
            } catch (e) {
                setError(String(e));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // roler（代表者ID）からmemberのnameを取得
    const getMemberName = (id) => {
        const member = members.find((m) => m.id === id);
        return member ? member.name : "不明";
    };

    return (
        <div>
            <h2 className="text-xl text-gray-900 font-bold mb-6">プロジェクト一覧</h2>

            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">読み込み中…</p>
                </div>
            ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-red-600">エラー: {error}</p>
                </div>
            ) : project.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">プロジェクトが登録されていません。</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {project.map((p) => (
                        <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                プロジェクト名：{p.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                期間：{p.duration}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                代表者（一名）：{getMemberName(p.roler)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}