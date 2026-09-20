export function FaqBlock({ items, eyebrow = "Questions, answered", title = "What teams usually ask before we begin." }: { items: { question: string; answer: string }[]; eyebrow?: string; title?: string }) {
  return (
    <section className="faq-section">
      <div className="faq-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>If your question is project-specific, include it in your consultation request and we’ll address it directly.</p></div>
      <div className="faq-list">
        {items.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <div className="faq-answer"><p>{item.answer}</p></div>
          </details>
        ))}
      </div>
    </section>
  );
}
