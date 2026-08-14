import Survey, { Question } from "./Survey";

const questions: Question[] = [
  { id: "name", type: "short", label: "Name", required: true },
  { id: "age", type: "short", label: "Age", required: true },
  { id: "phone", type: "short", label: "Phone Number", required: true },
  { id: "favoriteSport", type: "short", label: "Favorite Sport" },
  { id: "feedback", type: "paragraph", label: "Any feedback for us?" },
  {
    id: "role",
    type: "multiple",
    label: "What best describes you?",
    options: ["Student", "Developer", "Designer", "Other"],
    required: true,
  },
  {
    id: "interests",
    type: "checkbox",
    label: "Which topics interest you?",
    options: ["AI/ML", "Web Dev", "Systems", "Data"],
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-white py-12 px-4">
      <Survey
        title="Feedback Form"
        description="We'd love to hear from you. It takes 2 minutes."
        questions={questions}
      />
    </main>
  );
}