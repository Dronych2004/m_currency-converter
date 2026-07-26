/**
 * КОМПОНЕНТ КНОПКИ ОБМЕНА - ПРОДВИНУТЫЙ ДИЗАЙН
 */

interface SwapButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function SwapButton({ onClick, disabled = false }: SwapButtonProps) {
  return (
    <div className="relative">
      {/* Фоновое свечение */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="btn-swap relative"
        aria-label="Поменять валюты местами"
        title="Поменять валюты местами"
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </button>
    </div>
  )
}
