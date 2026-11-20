import type { Block } from "@/data/memos";

/** **굵게** 표시를 굵은 글씨 스타일로 바꾼다 */
function Rich({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="text-body-md-bold text-text-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

export function MemoBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-space-12">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return <h2 key={i} className="text-title-lg text-text-primary">{b.text}</h2>;
          case "subheading":
            return <h3 key={i} className="text-title-md text-text-primary">{b.text}</h3>;
          case "paragraph":
            return (
              <p key={i} className="text-body-md whitespace-pre-line text-text-secondary">
                <Rich text={b.text} />
              </p>
            );
          case "list":
            return (
              <ul key={i} className="flex flex-col gap-space-4">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-space-8 text-body-md text-text-secondary">
                    <span aria-hidden>•</span>
                    <span className="min-w-0 flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
