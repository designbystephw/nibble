export default function OnigiriIcon({ className = 'w-6 h-6', ...props }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Hand-drawn onigiri (triangle rice ball) */}
      {/* Outer triangle shape — slightly wobbly for hand-drawn feel */}
      <path
        d="M24 4C23 4 22 5 20 8C17 12 13 18 10 24C7.5 29 6 33 6.5 36C7 39 9 41 13 42.5C16 43.5 20 44 24 44C28 44 32 43.5 35 42.5C39 41 41 39 41.5 36C42 33 40.5 29 38 24C35 18 31 12 28 8C26 5 25 4 24 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Nori (seaweed) wrap at bottom — rectangular band */}
      <path
        d="M11 32C11 32 14 31 18 30.5C21 30.2 24 30 24 30C24 30 27 30.2 30 30.5C34 31 37 32 37 32C37.5 34 37 36 36 37.5C34 39.5 30 41 24 41C18 41 14 39.5 12 37.5C11 36 10.5 34 11 32Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      {/* Small grain detail lines on rice */}
      <path
        d="M20 16L21 17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M27 14L26.5 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M23 21L24 22.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 24L19 25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M29 22L28.5 23.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
