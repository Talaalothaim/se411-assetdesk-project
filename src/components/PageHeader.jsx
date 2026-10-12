/** Eyebrow + h1 on the left, optional action on the right (the mockup's `.head`). */
export default function PageHeader({ eyebrow, title, eyebrowId, children }) {
  return (
    <div className="head">
      <div>
        {eyebrow && <p className="eyebrow" id={eyebrowId}>{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  )
}
