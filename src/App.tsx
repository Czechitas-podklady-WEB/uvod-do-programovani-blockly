import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FunctionComponent, useState } from 'react'
import { NavLink, Route, HashRouter as Router, Routes } from 'react-router'
import './App.css'
import reactLogo from './assets/react.svg'
import { Home } from './Components/Home'
import { Level } from './Components/Level'
import { NotFound } from './Components/NotFound'
import { Experiment } from './Experiment'
import './index.css'
import viteLogo from '/vite.svg'

const theme = createTheme({
	colorSchemes: {
		dark: true,
		light: true,
	},
})

export const App: FunctionComponent = () => {
	const [count, setCount] = useState(0)

	return (
		<Router>
			<ThemeProvider theme={theme} noSsr>
				<CssBaseline enableColorScheme />
				<Routes>
					<Route index element={<Home />} />
					<Route path="level">
						<Route path=":level" element={<Level />} />
					</Route>
					<Route
						path="*"
						element={<NotFound />} /* @TODO: match /level too. */
					/>
				</Routes>
				<div>
					<a href="https://vite.dev" target="_blank">
						<img src={viteLogo} className="logo" alt="Vite logo" />
					</a>
					<a href="https://react.dev" target="_blank">
						<img src={reactLogo} className="logo react" alt="React logo" />
					</a>
				</div>
				<h1>Vite + React</h1>
				<div className="card">
					<button onClick={() => setCount((count) => count + 1)}>
						count is {count}
					</button>
					<p>
						Edit <code>src/App.tsx</code> and save to test HMR
					</p>
				</div>
				<p className="read-the-docs">
					Click on the Vite and React logos to learn more
				</p>
				<Experiment />
				<NavLink to="/" end>
					Home
				</NavLink>{' '}
				<NavLink to="/level/7" end>
					Level 7
				</NavLink>
			</ThemeProvider>
		</Router>
	)
}
