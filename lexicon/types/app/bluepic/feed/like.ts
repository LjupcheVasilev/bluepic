import { ValidationResult } from "@atproto/lexicon"
import { lexicons } from "../../../../lexicons"
import { isObj, hasProp } from "../../../../util"

export interface Record {
    subject: {
        uri: string
    }
    createdAt: string
    [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
    return (
        isObj(v) &&
        hasProp(v, "$type") &&
        (v.$type === "app.bluepic.feed.like#main" || v.$type === "app.bluepic.feed.like")
    )
}

export function validateRecord(v: unknown): ValidationResult {
    return lexicons.validate("app.bluepic.feed.like#main", v)
}
