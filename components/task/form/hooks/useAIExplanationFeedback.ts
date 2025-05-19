import { useState } from "react";

export function useAIExplanationFeedback(explanation: string | null) {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);

  const handleFeedback = (liked: boolean) => {
    setFeedback(liked ? "liked" : "disliked");
    fetch('/api/tasks/explanation/feedback', {
      method: 'POST',
      body: JSON.stringify({
        explanation,
        liked,
      }),
    });
  };

  return {
    feedback,
    handleFeedback,
    isFeedbackDisliked: feedback === "disliked",
    isFeedbackLiked: feedback === "liked",
  };
}