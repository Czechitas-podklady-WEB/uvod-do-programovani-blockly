import type { FunctionComponent } from 'react'
import grass from '../../assets/environment/grass.svg'
import styles from './Grass.module.css'

export const Grass: FunctionComponent = () => {
	return <img src={grass} className={styles.wrapper} />
}
