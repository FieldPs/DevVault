import { useEffect, useRef } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'

interface RunPreviewOnDemandProps {
  enabled: boolean
}

/**
 * Triggers Sandpack preview to run on-demand when enabled.
 * Uses a retry mechanism with increasing delays to handle timing issues.
 */
export default function RunPreviewOnDemand({ enabled }: RunPreviewOnDemandProps) {
  const { sandpack } = useSandpack()
  const attemptsRef = useRef(0)

  useEffect(() => {
    if (!enabled) return
    if (sandpack.status === 'running') return
    if (attemptsRef.current >= 2) return

    const delay = attemptsRef.current === 0 ? 75 : 1500
    const timer = window.setTimeout(() => {
      attemptsRef.current += 1
      sandpack.runSandpack()
    }, delay)

    return () => window.clearTimeout(timer)
  }, [enabled, sandpack, sandpack.status])

  return null
}
