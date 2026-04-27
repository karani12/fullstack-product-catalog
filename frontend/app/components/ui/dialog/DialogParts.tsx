export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b">{children}</div>
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4">{children}</div>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-t flex justify-end gap-2">{children}</div>
}
