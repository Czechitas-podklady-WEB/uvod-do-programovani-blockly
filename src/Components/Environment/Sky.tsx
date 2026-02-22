import type { FunctionComponent } from 'react'
import sky from '../../assets/environment/sky.svg'
import styles from './Sky.module.css'

export const Sky: FunctionComponent = () => {
	return <img src={sky} className={styles.wrapper} />
}
