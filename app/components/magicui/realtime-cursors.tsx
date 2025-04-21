'use client'

import { Cursor } from '@/components/magicui/cursor'
import { useRealtimeCursors } from '@/hooks/use-realtime-cursors'
import { useEffect, useRef } from 'react'

const THROTTLE_MS = 50

export const RealtimeCursors = ({ 
  roomName, 
  username 
}: { 
  roomName: string; 
  username: string 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cursors } = useRealtimeCursors({ 
    roomName, 
    username, 
    throttleMs: THROTTLE_MS 
  });

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[49]" // Below modals but above content
      style={{
        // Ensure it covers the entire interactive area
        marginRight: '320px', // Match your sidebar width
        transition: 'margin-right 0.3s ease', // Match sidebar animation
      }}
    >
      {Object.entries(cursors).map(([id, cursor]) => (
        <Cursor
          key={id}
          className="absolute transition-transform ease-linear duration-75"
          style={{
            transform: `translate(${cursor.position.x}px, ${cursor.position.y}px)`,
          }}
          color={cursor.color}
          name={cursor.user.name}
        />
      ))}
    </div>
  );
}