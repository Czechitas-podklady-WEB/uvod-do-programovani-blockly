import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FunctionComponent } from 'react'
import { Outlet, Route, HashRouter as Router, Routes } from 'react-router'
import {
	LoadingSuspense,
	SharedLoadingIndicatorContextProvider,
	SharedProgressLoadingIndicator,
} from 'shared-loading-indicator'
import { DatabaseProvider } from './Components/DatabaseProvider'
import { Group } from './Components/Group'
import { Home } from './Components/Home'
import { Layout } from './Components/Layout'
import { Level } from './Components/Level'
import { LevelEditor } from './Components/LevelEditor'
import { NotFound } from './Components/NotFound'
import { Reset } from './Components/Reset'
import { ScrollToTop } from './Components/ScrollToTop'
import { Thumbnails } from './Components/Thumbnails'
import { Unlock } from './Components/Unlock'
import './index.css'
import { isDevelopmentMode } from './utilities/isDevelopmentMode'
import { groupLinkPattern, levelLinkPattern } from './utilities/levelLink'

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
					<ScrollToTop />
					<ThemeProvider theme={theme} noSsr>
						<CssBaseline enableColorScheme />
						<Layout>
							<SharedProgressLoadingIndicator />
							<Routes>
								{isDevelopmentMode && (
									<>
										<Route path="/editor" element={<LevelEditor />} />
										<Route path="/thumbnails" element={<Thumbnails />} />
									</>
								)}
								<Route
									element={
										<DatabaseProvider>
											<Outlet />
										</DatabaseProvider>
									}
								>
									<Route index element={<Home />} />
									<Route path="/reset" element={<Reset />} />
									{isDevelopmentMode && (
										<Route path="/unlock" element={<Unlock />} />
									)}
									<Route path={groupLinkPattern} element={<Group />} />
									<Route path={levelLinkPattern} element={<Level />} />
									<Route path="*" element={<NotFound />} />
								</Route>
							</Routes>
						</Layout>
					</ThemeProvider>
				</Router>
			</LoadingSuspense>
		</SharedLoadingIndicatorContextProvider>
	)
}
