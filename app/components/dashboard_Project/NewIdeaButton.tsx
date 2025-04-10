"use client";

interface NewIdeaButtonProps {
  onClick: () => void;
}

export default function NewIdeaButton({ onClick }: NewIdeaButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        left: "1rem",
        top: "10%",
        transform: "translate(100px,-50%)",
        zIndex: 1000,
        padding: "0.5rem 1rem",
        backgroundColor: "#1677ff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Add Idea +
    </button>
  );
}