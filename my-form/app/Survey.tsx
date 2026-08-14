"use client"

import { useState } from "react"
import { submitForm } from "./actions"

export type Question =
    | { id: string; type: "short"; label: string; required?: boolean }
    | { id: string; type: "paragraph"; label: string; required?: boolean }
    | { id: string; type: "multiple"; label: string; options: string[]; required?: boolean }
    | { id: string; type: "checkbox"; label: string; options: string[]; required?: boolean };

type Props = {
    title: string;
    description?: string;
    questions: Question[];
}

export default function Survey({ title, description, questions }: Props) {
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    function updateAnswer(id: string, value: string | string[]) {
        setAnswers((prev: Record<string, string | string[]>) => ({ ...prev, [id]: value }));
    }

    function toggleCheckbox(id: string, option: string) {
        setAnswers((prev: Record<string, string | string[]>) => {
            const current = (prev[id] as string[]) ?? [];
            const next = current.includes(option)
                ? current.filter((o) => o !== option)
                : [...current, option];
            return { ...prev, [id]: next };
        });
    }

    async function handleSubmit() {
        for (const q of questions) {
            if (q.required && !answers[q.id]?.length) {
                alert(`Please answer: ${q.label}`);
                return;
            }
        }
        setLoading(true);
        await submitForm(answers); // <- calls the Server Action
        setLoading(false);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-xl font-medium text-neutral-900">Thanks!</h1>
                <p className="mt-2 text-neutral-500">Your response has been recorded.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-xl space-y-4">
            <div className="rounded-2xl border-t-8 border-neutral-900 bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-medium text-neutral-900">{title}</h1>
                {description && <p className="mt-2 text-neutral-500">{description}</p>}
            </div>

            {questions.map((q) => (
                <div key={q.id} className="rounded-2xl bg-white p-6 shadow-sm">
                    <label className="block text-sm font-medium text-neutral-900">
                        {q.label}
                        {q.required && <span className="text-neutral-500"> *</span>}
                    </label>

                    {q.type === "short" && (
                        <input
                            type="text"
                            className="mt-3 w-full rounded-md bg-neutral-200 px-3 py-2 outline-none focus:bg-neutral-300"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAnswer(q.id, e.target.value)}
                        />
                    )}

                    {q.type === "paragraph" && (
                        <textarea
                            rows={3}
                            className="mt-3 w-full rounded-md bg-neutral-200 px-3 py-2 outline-none focus:bg-neutral-300"
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateAnswer(q.id, e.target.value)}
                        />
                    )}

                    {q.type === "multiple" && (
                        <div className="mt-3 space-y-2">
                            {q.options.map((opt) => (
                                <label key={opt} className="flex items-center gap-3 text-neutral-700">
                                    <input type="radio" name={q.id} value={opt}
                                        onChange={() => updateAnswer(q.id, opt)} />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}

                    {q.type === "checkbox" && (
                        <div className="mt-3 space-y-2">
                            {q.options.map((opt) => (
                                <label key={opt} className="flex items-center gap-3 text-neutral-700">
                                    <input type="checkbox"
                                        checked={((answers[q.id] as string[]) ?? []).includes(opt)}
                                        onChange={() => toggleCheckbox(q.id, opt)} />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-neutral-900 px-6 py-2.5 text-white disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit"}
            </button>
        </div>
    );
}