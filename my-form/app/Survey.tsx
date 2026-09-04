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
    const [error, setError] = useState<string | null>(null);

    const completedQuestions = Object.keys(answers).filter(id => answers[id]?.length).length;
    const progress = Math.round((completedQuestions / questions.length) * 100);

    function updateAnswer(id: string, value: string | string[]) {
        setAnswers((prev: Record<string, string | string[]>) => ({ ...prev, [id]: value }));
        setError(null);
    }

    function toggleCheckbox(id: string, option: string) {
        setAnswers((prev: Record<string, string | string[]>) => {
            const current = (prev[id] as string[]) ?? [];
            const next = current.includes(option)
                ? current.filter((o) => o !== option)
                : [...current, option];
            return { ...prev, [id]: next };
        });
        setError(null);
    }

    async function handleSubmit() {
        for (const q of questions) {
            if (q.required && !answers[q.id]?.length) {
                setError(`Please answer: ${q.label}`);
                return;
            }
        }
        setError(null);
        setLoading(true);
        await submitForm(answers);
        setLoading(false);
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
                <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">Thank You!</h1>
                    <p className="mt-3 text-center text-gray-600">Your response has been recorded successfully. We appreciate your feedback!</p>
                    <div className="mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
            <div className="mx-auto w-full max-w-2xl">
                {/* Header Card */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-lg">
                    <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    <div className="p-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</h1>
                        {description && <p className="mt-3 text-gray-600 text-lg">{description}</p>}
                        
                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm font-bold text-indigo-600">{progress}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                        <svg className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Questions */}
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={q.id} className="group rounded-3xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                                    <span className="text-sm font-bold text-white">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-base font-semibold text-gray-900">
                                        {q.label}
                                        {q.required && <span className="ml-1 text-red-500">*</span>}
                                    </label>

                                    {q.type === "short" && (
                                        <input
                                            type="text"
                                            placeholder="Enter your answer..."
                                            value={(answers[q.id] as string) || ""}
                                            className="mt-3 w-full rounded-xl bg-gray-50 px-4 py-3 border-2 border-gray-200 text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAnswer(q.id, e.target.value)}
                                        />
                                    )}

                                    {q.type === "paragraph" && (
                                        <textarea
                                            rows={4}
                                            placeholder="Share your thoughts..."
                                            value={(answers[q.id] as string) || ""}
                                            className="mt-3 w-full rounded-xl bg-gray-50 px-4 py-3 border-2 border-gray-200 text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateAnswer(q.id, e.target.value)}
                                        />
                                    )}

                                    {q.type === "multiple" && (
                                        <div className="mt-4 space-y-3">
                                            {q.options.map((opt) => (
                                                <label key={opt} className="flex items-center gap-3 cursor-pointer group/radio p-3 rounded-xl hover:bg-indigo-50 transition-colors">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 group-hover/radio:border-indigo-500 transition-colors">
                                                        <input 
                                                            type="radio" 
                                                            name={q.id} 
                                                            value={opt}
                                                            checked={answers[q.id] === opt}
                                                            className="sr-only"
                                                            onChange={() => updateAnswer(q.id, opt)} 
                                                        />
                                                        {answers[q.id] === opt && (
                                                            <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === "checkbox" && (
                                        <div className="mt-4 space-y-3">
                                            {q.options.map((opt) => (
                                                <label key={opt} className="flex items-center gap-3 cursor-pointer group/checkbox p-3 rounded-xl hover:bg-indigo-50 transition-colors">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-lg border-2 border-gray-300 group-hover/checkbox:border-indigo-500 transition-colors" style={{
                                                        backgroundColor: ((answers[q.id] as string[]) ?? []).includes(opt) ? '#6366f1' : 'transparent'
                                                    }}>
                                                        <input 
                                                            type="checkbox"
                                                            checked={((answers[q.id] as string[]) ?? []).includes(opt)}
                                                            className="sr-only"
                                                            onChange={() => toggleCheckbox(q.id, opt)} 
                                                        />
                                                        {((answers[q.id] as string[]) ?? []).includes(opt) && (
                                                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-10 w-full rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-4 font-bold text-white text-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="h-5 w-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Response
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </>
                    )}
                </button>

                {/* Footer Info */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Your responses are secure and will be stored safely.
                </p>
            </div>
        </div>
    );
}