import type { FunctionComponent } from 'react'
import soil from '../../assets/environment/soil.svg'
import styles from './Soil.module.css'

export const Soil: FunctionComponent = () => {
	return <img src={soil} className={styles.wrapper} />
}
