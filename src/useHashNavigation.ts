import { useEffect } from 'react'

/** Restore fragment navigation after React replaces the prerendered document. */
export function useHashNavigation(aliases: Record<string, string>) {
  useEffect(() => {
    let frame = 0
    let disposed = false
    let selected: HTMLElement | null = null

    const reveal = () => {
      if (disposed) return
      let hash: string
      try { hash = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
      selected?.removeAttribute('data-permalink-target')
      selected = null
      if (!hash) return
      const id = aliases[hash] ?? hash
      const target = document.getElementById(id)
      if (!target) {
        if (window.location.pathname === '/' && ['profile-foundations','research-record','engineering-projects','motorsports','activities-service','recognition','media'].includes(id)) {
          window.location.replace(`/collection/${id}`)
        }
        return
      }
      let parent: HTMLElement | null = target
      while (parent) {
        if (parent instanceof HTMLDetailsElement) parent.open = true
        parent = parent.parentElement
      }
      // Legacy anchors belong to the same presentation, so highlight its record too.
      selected = target.closest<HTMLElement>('[data-presentation-id]') ?? target
      selected.setAttribute('data-permalink-target', 'true')
      selected.focus({ preventScroll: true })
      selected.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      // Browser fragment/history restoration runs alongside page activation.
      // Reveal the current React node after those layout frames, not the removed SSR node.
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(reveal) })
    }
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const url = new URL(link.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return
      let id: string
      try { id = decodeURIComponent(url.hash.slice(1)) } catch { return }
      if (!document.getElementById(aliases[id] ?? id)) return
      event.preventDefault()
      if (url.hash !== location.hash) history.pushState(null, '', url)
      // Re-clicking the same fragment does not emit hashchange.
      schedule()
    }
    schedule()
    void document.fonts.ready.then(schedule)
    window.addEventListener('load', schedule)
    window.addEventListener('pageshow', schedule)
    window.addEventListener('popstate', schedule)
    window.addEventListener('hashchange', schedule)
    document.addEventListener('click', onClick)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      selected?.removeAttribute('data-permalink-target')
      window.removeEventListener('load', schedule)
      window.removeEventListener('pageshow', schedule)
      window.removeEventListener('popstate', schedule)
      window.removeEventListener('hashchange', schedule)
      document.removeEventListener('click', onClick)
    }
  }, [aliases])
}
