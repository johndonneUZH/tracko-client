// "use client";

// import React, { useState } from "react";
// import { Comment } from "@/types/comment";



// interface CommentsProps {
//   comments: Comment[];
//   currentUserId: number; 
//   onAddComment: (content: string, parentId?: number) => void;
//   onDeleteComment: (commentId: number) => void;
// }
// export default function Comments({
//     comments,
//     currentUserId,
//     onAddComment,
//     onDeleteComment,
//   }: CommentsProps) {
//     const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
//     const [replyContent, setReplyContent] = useState("");
  
//     function handleSubmitReply() {
//       if (!replyContent.trim()) return;
//       onAddComment(replyContent, replyTargetId || undefined);
//       setReplyContent("");
//       setReplyTargetId(null);
//     }
  
//     function renderCommentList(commentList: Comment[]): React.ReactNode[] {
//       return commentList.map((comment) => (
//         <div key={comment.id} style={{ marginLeft: "1rem", marginTop: "1rem" }}>
//           <div style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
//             <p>
//               <strong>User {comment.authorId}</strong>: {comment.content}
//             </p>
  
//             <div style={{ display: "flex", gap: "0.5rem" }}>
//               {/* Reply */}
//               <button
//                 onClick={() => {
//                   setReplyTargetId(comment.id);
//                   setReplyContent("");
//                 }}
//                 style={{
//                   background: "#1677ff",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "4px",
//                   padding: "0.25rem 0.5rem",
//                   cursor: "pointer",
//                 }}
//               >
//                 Reply
//               </button>
  
//               {/* Delete */}
//               {comment.authorId === currentUserId && (
//                 <button
//                   onClick={() => onDeleteComment(comment.id)}
//                   style={{
//                     background: "#ff4d4f",
//                     color: "#fff",
//                     border: "none",
//                     borderRadius: "4px",
//                     padding: "0.25rem 0.5rem",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           </div>
  
//           {/* Sub-comm */}
//           {renderCommentList(comment.replies)}
//         </div>
//       ));
//     }
  
//     return (
//       <div style={{ marginTop: "1rem" }}>
//         <h3>Comments</h3>
//         {renderCommentList(comments)}
  
//         <hr />
//         {replyTargetId ? (
//           <div>
//             <label>Reply to comment #{replyTargetId}</label>
//             <textarea
//               value={replyContent}
//               onChange={(e) => setReplyContent(e.target.value)}
//               style={{ width: "100%", height: "60px" }}
//             />
//             <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
//               <button
//                 onClick={handleSubmitReply}
//                 style={{
//                   background: "#1677ff",
//                   color: "#fff",
//                   border: "none",
//                   padding: "0.25rem 0.5rem",
//                   cursor: "pointer",
//                   marginRight: "0.5rem",
//                 }}
//               >
//                 Add Reply
//               </button>
//               <button
//                 onClick={() => {
//                   setReplyTargetId(null);
//                   setReplyContent("");
//                 }}
//                 style={{
//                   background: "#ccc",
//                   border: "none",
//                   padding: "0.25rem 0.5rem",
//                   cursor: "pointer",
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <label>Add new comment:</label>
//             <textarea
//               value={replyContent}
//               onChange={(e) => setReplyContent(e.target.value)}
//               style={{ width: "100%", height: "60px" }}
//             />
//             <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
//               <button
//                 onClick={handleSubmitReply}
//                 style={{
//                   background: "#1677ff",
//                   color: "#fff",
//                   border: "none",
//                   padding: "0.25rem 0.5rem",
//                   cursor: "pointer",
//                 }}
//               >
//                 Add Comment
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }