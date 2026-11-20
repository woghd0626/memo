type ButtonFormatProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

export function ButtonFormat({ label, active = false, onClick }: ButtonFormatProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      // 누르는 순간 글자 선택이 풀리지 않게 한다
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-9 items-center justify-center rounded-sm px-space-12 text-label-md whitespace-nowrap ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
