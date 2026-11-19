import * as React from 'react'

export function LazyViewFallback({ label = '正在加载视图...' }: { label?: string }): React.ReactElement {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background/50 text-xs text-muted-foreground">
      <div className="flex flex-col items-center gap-2.5">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/60 border-t-transparent" />
        <span>{label}</span>
      </div>
    </div>
  )
}
