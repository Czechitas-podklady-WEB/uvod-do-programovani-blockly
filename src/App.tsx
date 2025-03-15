import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FunctionComponent } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router'
import {
	LoadingSuspense,
	SharedLoadingIndicatorContextProvider,
	SharedProgressLoadingIndicator,
} from 'shared-loading-indicator'
import { DatabaseProvider } from './Components/DatabaseProvider'
import { Home } from './Components/Home'
import { Layout } from './Components/Layout'
import { Level } from './Components/Level'
import { LevelEditor } from './Components/LevelEditor'
import { NotFound } from './Components/NotFound'
import { Reset } from './Components/Reset'
import { Thumbnails } from './Components/Thumbnails'
import { Unlock } from './Components/Unlock'
import './index.css'
import { isDevelopmentMode } from './utilities/isDevelopmentMode'
import { levelLinkPattern } from './utilities/levelLink'

const theme = createTheme({
	colorSchemes: {
		dark: true,
		light: true,
	},
})

export const App: FunctionComponent = () => {
	return (
		<SharedLoadingIndicatorContextProvider>
			<LoadingSuspense>
				<Router>
					<ThemeProvider theme={theme} noSsr>
						<CssBaseline enableColorScheme />
						<DatabaseProvider>
							<Layout>
								<SharedProgressLoadingIndicator />
								<Routes>
									<Route index element={<Home />} />
									<Route path="/reset" element={<Reset />} />
									{isDevelopmentMode && (
										<>
											<Route path="/unlock" element={<Unlock />} />
											<Route path="/editor" element={<LevelEditor />} />
											<Route path="/thumbnails" element={<Thumbnails />} />
										</>
									)}
									<Route path={levelLinkPattern} element={<Level />} />
									<Route path="*" element={<NotFound />} />
								</Routes>
							</Layout>
						</DatabaseProvider>
					</ThemeProvider>
				</Router>
			</LoadingSuspense>
		</SharedLoadingIndicatorContextProvider>
	)
}
