import type { Block } from "@/data/memos";

/** 에디터 안의 글자 서식 → **굵게** 표시가 든 글 */
function inline(node: Node, inBold: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (!(node instanceof HTMLElement)) return "";
  if (node.tagName === "BR") return "\n";
  const bold =
    node.tagName === "B" ||
    node.tagName === "STRONG" ||
    /bold|^[6-9]00$/.test(node.style.fontWeight);
  const inner = Array.from(node.childNodes)
    .map((c) => inline(c, inBold || bold))
    .join("");
  return bold && !inBold && inner.trim() ? `**${inner}**` : inner;
}

const BLOCK_TAGS = new Set(["H1", "H2", "H3", "H4", "UL", "OL", "DIV", "P"]);

/** 에디터(contenteditable) 내용 → 저장용 블록 */
export function htmlToBlocks(root: HTMLElement): Block[] {
  const out: Block[] = [];
  let buf = "";
  const pushParagraph = (text: string) => {
    const t = text.replace(/ /g, " ").trim();
    if (t) out.push({ type: "paragraph", text: t });
  };
  const flush = () => {
    pushParagraph(buf);
    buf = "";
  };

  // 브라우저가 서식을 바꿀 때 <div> 안에 <div>나 <ul>을 넣기도 해서, 안쪽까지 따라 들어간다
  const walk = (container: Node) => {
    for (const n of Array.from(container.childNodes)) {
      if (n.nodeType === Node.TEXT_NODE) {
        buf += n.textContent ?? "";
        continue;
      }
      if (!(n instanceof HTMLElement)) continue;
      const tag = n.tagName;
      if (tag === "H1" || tag === "H2") {
        flush();
        const t = (n.textContent ?? "").trim();
        if (t) out.push({ type: "heading", text: t });
      } else if (tag === "H3" || tag === "H4") {
        flush();
        const t = (n.textContent ?? "").trim();
        if (t) out.push({ type: "subheading", text: t });
      } else if (tag === "UL" || tag === "OL") {
        flush();
        const items = Array.from(n.querySelectorAll("li"))
          .map((li) => (li.textContent ?? "").trim())
          .filter(Boolean);
        if (items.length) out.push({ type: "list", items });
      } else if (tag === "DIV" || tag === "P") {
        flush();
        if (Array.from(n.children).some((c) => BLOCK_TAGS.has(c.tagName))) {
          walk(n);
          flush();
        } else {
          pushParagraph(inline(n, false));
        }
      } else if (tag === "BR") {
        buf += "\n";
      } else {
        buf += inline(n, false);
      }
    }
  };

  walk(root);
  flush();
  return out;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function paragraphHtml(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part) =>
      part.startsWith("**")
        ? `<b>${escapeHtml(part.slice(2, -2))}</b>`
        : escapeHtml(part),
    )
    .join("")
    .replace(/\n/g, "<br>");
}

/** 저장해 둔 블록 → 에디터에 넣을 HTML (글자는 모두 이스케이프한다) */
export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
          return `<h2>${escapeHtml(b.text)}</h2>`;
        case "subheading":
          return `<h3>${escapeHtml(b.text)}</h3>`;
        case "paragraph":
          return `<div>${paragraphHtml(b.text)}</div>`;
        case "list":
          return `<ul>${b.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}

/** 목록 화면에 보일 한 줄 미리보기 */
export function previewOf(blocks: Block[]): string {
  for (const b of blocks) {
    if (b.type === "list") return b.items.join(", ");
    if (b.type === "paragraph") return b.text.replace(/\*\*/g, "").replace(/\n/g, " ");
    if (b.type === "heading" || b.type === "subheading") continue;
  }
  const head = blocks.find((b) => b.type === "heading" || b.type === "subheading");
  return head && "text" in head ? head.text : "";
}

/** 저장 시각을 "10월 30일 오전 9:12" 모양으로 */
export function formatNow(d = new Date()): string {
  const h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm} ${h12}:${mm}`;
}
