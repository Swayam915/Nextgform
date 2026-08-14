"use server";

export async function submitForm(answers: Record<string, string | string[]>) {
    
    console.log("New response:", answers);

    return { success: true };
}