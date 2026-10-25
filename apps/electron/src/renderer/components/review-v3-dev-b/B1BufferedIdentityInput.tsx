/**
 * B1 author-only identifier editing boundary. IME intermediate text is never a
 * source/field/target graph mutation. Parent-prop changes during a focused edit
 * must not be overwritten by a stale blur/Enter callback.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface B1BufferedIdentityInputProps {
  value: string
  className?: string
  onCommit: (nextId: string) => void
}

export type B1IdentityFinishResult =
  | {kind: 'commit'; nextId: string}
  | {kind: 'discard'; reason: 'cancelled' | 'composing' | 'stale-parent' | 'unchanged'}

/** Pure, fail-closed decision usable by deterministic non-DOM regression tests. */
export function resolveB1IdentityFinish(input: {
  startedWith: string
  latestValue: string
  buffer: string
  composing: boolean
  cancelled: boolean
  sawExternalChange: boolean
}): B1IdentityFinishResult {
  if (input.cancelled) return {kind:'discard',reason:'cancelled'}
  if (input.composing) return {kind:'discard',reason:'composing'}
  if (input.sawExternalChange || input.latestValue !== input.startedWith)
    return {kind:'discard',reason:'stale-parent'}
  if (input.buffer === input.startedWith)
    return {kind:'discard',reason:'unchanged'}
  // Final ID syntax, collisions and reference graph remain the author's
  // immutable renameB1AuthorIdentity responsibility. No early normalization.
  return {kind:'commit',nextId:input.buffer}
}

export function B1BufferedIdentityInput({
  value, className, onCommit,
}: B1BufferedIdentityInputProps): ReactNode {
  const [editing,setEditing]=useState(false)
  const [buffer,setBuffer]=useState(value)
  const composing=useRef(false)
  const cancelled=useRef(false)
  const editStart=useRef(value)
  const lastValue=useRef(value)
  const sawExternalChange=useRef(false)
  const justComposed=useRef(false)
  lastValue.current=value

  useEffect(()=>{
    if (editing && value!==editStart.current) sawExternalChange.current=true
    if (!editing) setBuffer(value)
  },[value,editing])

  const finish=():void=>{
    const result=resolveB1IdentityFinish({
      startedWith:editStart.current,latestValue:lastValue.current,
      buffer,composing:composing.current,cancelled:cancelled.current,
      sawExternalChange:sawExternalChange.current,
    })
    composing.current=false
    cancelled.current=false
    justComposed.current=false
    sawExternalChange.current=false
    setEditing(false)
    setBuffer(lastValue.current)
    if (result.kind==='commit') onCommit(result.nextId)
  }
  return <input className={className} value={editing?buffer:value}
    onFocus={()=>{
      editStart.current=value
      sawExternalChange.current=false
      composing.current=false
      justComposed.current=false
      cancelled.current=false
      setBuffer(value)
      setEditing(true)
    }}
    onChange={event=>setBuffer(event.target.value)}
    onCompositionStart={()=>{composing.current=true;justComposed.current=true}}
    onCompositionEnd={()=>{composing.current=false;justComposed.current=true}}
    onBlur={finish}
    onKeyDown={event=>{
      if(event.key==='Escape'){
        // Escape while composing belongs to the IME, not the author editor.
        if(composing.current || event.nativeEvent.isComposing) return
        cancelled.current=true
        event.currentTarget.blur()
      }else if(event.key==='Enter'){
        // In some IMEs compositionEnd precedes the matching Enter keydown.
        // Requiring a separate Enter press prevents accidental commit.
        if(composing.current || event.nativeEvent.isComposing || justComposed.current)
          return
        event.preventDefault()
        event.currentTarget.blur()
      }
    }}
    onKeyUp={event=>{
      if(event.key==='Enter' && !composing.current) justComposed.current=false
    }}
  />
}
