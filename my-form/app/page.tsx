import Survey, { Question } from "./Survey";

const questions: Question[] = [
  { id: "name", type: "short", label: "Full Name", required: true },
  { id: "age", type: "short", label: "Age", required: true },
  { id: "phone", type: "short", label: "Phone Number", required: true },
  { id: "favoriteSport", type: "short", label: "Favorite Sport", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop" },
  { id: "feedback", type: "paragraph", label: "Any feedback for us?", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop" },
  {
    id: "role",
    type: "multiple",
    label: "What best describes you?",
    options: ["Student", "Developer", "Designer", "Other"],
    optionImages: {
      "Student": "https://images.unsplash.com/photo-1523050854058-7bda33b4610a?w=300&h=200&fit=crop",
      "Developer": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop",
      "Designer": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
      "Other": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop"
    },
    required: true,
  },
  {
    id: "interests",
    type: "checkbox",
    label: "Which topics interest you?",
    options: ["AI/ML", "Web Dev", "Systems", "Data"],
    optionImages: {
      "AI/ML": "https://images.unsplash.com/photo-1677442d019cecf8a146be3442badfa8b11f10a78?w=300&h=200&fit=crop",
      "Web Dev": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop",
      "Systems": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
      "Data": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
    }
  },
];

export default function Page() {
  return (
    <main className="min-h-screen">
      <Survey
        title="Feedback Form"
        description="We'd love to hear from you. It takes 2 minutes."
        headerImage="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
        questions={questions}
      />
    </main>
  );
}