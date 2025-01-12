import { Brand } from 'effect'

export type EditorXml = string & Brand.Brand<'EditorXml'>
export const makeEditorXml = Brand.nominal<EditorXml>()
