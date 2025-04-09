import { Idea } from "@/types/idea";

export function toggleVoteInIdeas(
  ideas: Idea[],
  ideaId: string,
  userId: string,
  type: "up" | "down"
): Idea[] {
  return ideas.map((idea) => {
    if (idea.ideaId !== ideaId) return idea;

    const alreadyUpvoted = idea.upVotes.includes(userId);
    const alreadyDownvoted = idea.downVotes.includes(userId);

    let upvotesL = [...idea.upVotes];
    let downvotesL = [...idea.downVotes];

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
