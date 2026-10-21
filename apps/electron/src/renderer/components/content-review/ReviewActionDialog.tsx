import * as React from 'react'

export interface ReviewActionDialogField {
  key: string
  label: string
  placeholder?: string
  defaultValue?: string
  multiline?: boolean
  required?: boolean
}

export function ReviewActionDialog({
  title,
  description,
  fields,
  onClose,
  onSubmit,
}: {
  title: string
  description?: string
  fields: ReviewActionDialogField[]
  onClose(): void
  onSubmit(values: Record<string, string>): Promise<void>
}): React.ReactElement {
  const [values, setValues] = React.useState<Record<string, string>>(() => Object.fromEntries(fields.map((field) => [field.key, field.defaultValue ?? ''])))
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    if (busy) return
    for (const field of fields) {
      if (field.required !== false && !values[field.key]?.trim()) {
        setError(`请填写${field.label}`)
        return
      }
    }
    setBusy(true)
    setError(null)
    try {
      await onSubmit(values)
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose() }}>
      <form role="dialog" aria-modal="true" aria-label={title} onSubmit={(event) => void submit(event)} className="w-full max-w-md space-y-3 rounded-xl border bg-card p-4 shadow-xl">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="mt-1 whitespace-pre-line text-xs leading-5 text-muted-foreground">{description}</p>}
        </div>
        {fields.map((field) => (
          <label key={field.key} className="block text-xs font-medium">
            {field.label}{field.required !== false && <span className="ml-1 text-destructive">*</span>}
            {field.multiline
              ? <textarea autoFocus={fields[0]?.key === field.key} value={values[field.key] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} className="mt-1.5 min-h-20 w-full resize-y rounded-md border bg-background px-2.5 py-2 text-xs font-normal" />
              : <input autoFocus={fields[0]?.key === field.key} value={values[field.key] ?? ''} onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} className="mt-1.5 h-9 w-full rounded-md border bg-background px-2.5 text-xs font-normal" />}
          </label>
        ))}
        {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" disabled={busy} onClick={onClose} className="rounded-md border px-3 py-1.5 text-xs disabled:opacity-50">取消</button>
          <button type="submit" disabled={busy} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">{busy ? '保存中…' : '保存'}</button>
        </div>
      </form>
    </div>
  )
}
