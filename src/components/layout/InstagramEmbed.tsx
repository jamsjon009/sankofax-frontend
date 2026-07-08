'use client'

import { useEffect, useRef } from 'react'

/**
 * Renders an Instagram feed embed pasted by an admin (SnapWidget, LightWidget, Behold, etc.)
 * into the footer. `dangerouslySetInnerHTML` alone will not run any <script> tags the embed
 * ships with, so we re-create them after injection so script-based widgets initialise.
 */
export default function InstagramEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    container.innerHTML = html

    // Re-create <script> tags so the browser actually executes them.
    const scripts = Array.from(container.querySelectorAll('script'))
    for (const old of scripts) {
      const script = document.createElement('script')
      for (const attr of Array.from(old.attributes)) {
        script.setAttribute(attr.name, attr.value)
      }
      script.textContent = old.textContent
      old.replaceWith(script)
    }
  }, [html])

  return (
    <div
      ref={ref}
      className="instagram-embed [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:border-0"
    />
  )
}
