import { Idea } from "@/types/idea";

export function toggleVoteInIdeas(
  ideas: Idea[],
  ideaId: number,
  userId: number,
  type: "up" | "down"
): Idea[] {
  return ideas.map((idea) => {
    if (idea.id !== ideaId) return idea;

    const alreadyUpvoted = idea.upvotesL.includes(userId);
    const alreadyDownvoted = idea.downvotesL.includes(userId);

    let upvotesL = [...idea.upvotesL];
    let downvotesL = [...idea.downvotesL];

    if (type === "up") {
      if (alreadyUpvoted) {
        upvotesL = upvotesL.filter((id) => id !== userId);
      } else {
        upvotesL.push(userId);
        downvotesL = downvotesL.filter((id) => id !== userId);
      }
    } else {
      if (alreadyDownvoted) {
        downvotesL = downvotesL.filter((id) => id !== userId);
      } else {
        downvotesL.push(userId);
        upvotesL = upvotesL.filter((id) => id !== userId);
      }
    }

    return {
      ...idea,
      upvotesL,
      downvotesL,
    };
  });
}
