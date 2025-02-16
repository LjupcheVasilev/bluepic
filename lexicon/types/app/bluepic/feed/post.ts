/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult } from "@atproto/lexicon"
import { lexicons } from "../../../../lexicons"
import { isObj, hasProp } from "../../../../util"

export interface Record {
  imageUrl: string
  caption: string
  createdAt: string
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, "$type") &&
    (v.$type === "app.bluepic.feed.post#main" || v.$type === "app.bluepic.feed.post")
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate("app.bluepic.feed.post#main", v)
}
