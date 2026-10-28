/** Marca texto provisório: aparece entre colchetes e sublinhado tracejado até ser confirmado. */
export default function Pending({ children }: { children: React.ReactNode }) {
  return <span className="pending">[{children}]</span>;
}
