type EntryOf<o> = {
	[k in keyof o]-?: [k, o[k]]
}[o extends readonly unknown[] ? keyof o & number : keyof o] &
	unknown

type EntriesOf<o extends object> = EntryOf<o>[] & unknown

export const entriesOf = <o extends object>(j: o) =>
	Object.entries(j) as EntriesOf<o>
