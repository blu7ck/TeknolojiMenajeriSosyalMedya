"use client"

import styles from "./StyledSubscribeButton.module.css"

export interface StyledSubscribeButtonProps {
  isAnimating: boolean
  onClick: () => void
}

export function StyledSubscribeButton({ isAnimating, onClick }: StyledSubscribeButtonProps) {
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={onClick}
        className={`${styles.button} ${isAnimating ? styles.pulse : ""}`}
        aria-label="Abone Ol"
      >
        <span className="sr-only">Abone Ol</span>
        <p className={styles.text} aria-hidden="true">
          A
          <br />
          b
          <br />
          o
          <br />
          n
          <br />
          e
          <br />
          <span className={styles.separator} />
          O
          <br />
          l
        </p>
      </button>
    </div>
  )
}

