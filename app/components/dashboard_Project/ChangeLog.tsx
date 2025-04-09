// "use client";

// import React from "react";
// import {LogEntry} from "@/types/logEntry";

// interface ChangeLogProps {
//   logEntries: LogEntry[];
// }

// export default function ChangeLog({ logEntries }: ChangeLogProps) {
//   return (
//     <div style={{ padding: "1rem", overflowY: "auto", height: "100%" }}>
//       <h2>Latest changes:</h2>
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr style={{ borderBottom: "1px solid #ccc" }}>
//             <th style={{ textAlign: "left", padding: "0.5rem" }}>User</th>
//             <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
//             <th style={{ textAlign: "left", padding: "0.5rem" }}>Time</th>
//             <th style={{ textAlign: "left", padding: "0.5rem" }}>Action</th>
//             <th style={{ textAlign: "left", padding: "0.5rem" }}>Idea Title</th>
//           </tr>
//         </thead>
//         <tbody>
//           {[...logEntries].reverse().map((entry, index) => (
//             <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
//               <td style={{ padding: "0.5rem" }}>{entry.userId}</td>
//               <td style={{ padding: "0.5rem" }}>{entry.date}</td>
//               <td style={{ padding: "0.5rem" }}>{entry.time}</td>
//               <td style={{ padding: "0.5rem" }}>{entry.action}</td>
//               <td style={{ padding: "0.5rem" }}>{entry.ideaTitle}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }