import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FunctionComponent } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router'
import { DatabaseProvider } from './Components/DatabaseProvider'
import { Home } from './Components/Home'
import { Layout } from './Components/Layout'
import { Level } from './Components/Level'
import { NotFound } from './Components/NotFound'
import './index.css'
import { levelLinkPattern } from './utilities/levelLink'

const theme = createTheme({
	colorSchemes: {
		dark: true,
		light: true,
	},
})

export const App: FunctionComponent = () => {
	return (
		<Router>
			<ThemeProvider theme={theme} noSsr>
				<CssBaseline enableColorScheme />
				<DatabaseProvider>
					<Layout>
						<Routes>
							<Route index element={<Home />} />
							<Route path={levelLinkPattern} element={<Level />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Layout>
				</DatabaseProvider>
			</ThemeProvider>
		</Router>
	)
}
