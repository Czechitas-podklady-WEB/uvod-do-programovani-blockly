import { Rating as Stars } from '@mui/material'
import type { ComponentProps, FunctionComponent } from 'react'

export const Rating: FunctionComponent<{
	value: 0 | 1 | 2 | 3
	size?: ComponentProps<typeof Stars>['size']
}> = ({ value, size }) => {
	return <Stars value={value} readOnly max={3} size={size} />
}
