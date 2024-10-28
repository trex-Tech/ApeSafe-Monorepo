import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import { ReactNode, useState } from "react"
import { twMerge } from "tailwind-merge"
import { ThemeProvider } from "@mui/material"
import { MuiTheme } from "@utils"

function TabPanel(props: { children: ReactNode; index: number; value: number }) {
	const { children, value, index, ...other } = props

	return (
		<div
			key={index}
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && children}
		</div>
	)
}

const defaultTabList = [
	{
		name: "Tab Apple",
		component: <div className="h-[30vh] w-full bg-green-500">For apple</div>,
	},
	{
		name: "Tab Banana",
		component: <div className="h-[30vh] w-full bg-red-800">For banana</div>,
	},
	{
		name: "Tab Cherry",
		component: <div className="h-[30vh] w-full bg-amber-800">For cherry</div>,
	},
]

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	}
}

type TabViewProps = {
	className?: string
	center?: boolean
	tabs: { name: string; component: ReactNode }[]
	sticky?: boolean
	stickyOffset?: string | number
	currentTab?: string
	onChange?: (index: number) => void
	uppercaseLabels?: boolean
}

function TabView(props: TabViewProps) {
	const {
		className,
		center = false,
		tabs: tabList = defaultTabList,
		sticky,
		stickyOffset = "0",
		currentTab,
		onChange,
		uppercaseLabels = false,
	} = props

	const findCurrentTab = currentTab
		? tabList.findIndex((object) => {
				return object.name.toLowerCase() === currentTab.toLowerCase()
			})
		: 0

	const [value, setValue] = useState(findCurrentTab)

	const handleChange = (event, newValue) => {
		setValue(newValue)
		onChange && onChange(newValue)
	}

	return (
		<ThemeProvider theme={MuiTheme}>
			{" "}
			{/*MUI Theme */}
			<div className={twMerge(`w-full ${className}`)}>
				<div
					className={`${
						sticky && `sticky top-0`
					} z-[1000] flex border-b border-outline capitalize dark:border-outline-dark ${
						center && "justify-center"
					}`}
					style={{ top: stickyOffset }}>
					<Tabs
						variant={`scrollable`}
						scrollButtons="auto"
						value={value}
						onChange={handleChange}
						aria-label="custom tab"
						textColor="primary"
						indicatorColor="primary">
						{tabList.map((tab, index) => {
							return (
								<Tab
									key={index}
									className={`dark:text-gray-600 ${!uppercaseLabels && "text-md  capitalize"}`}
									sx={{ color: "#4b5563", textTransform: "capitalize" }}
									label={tab.name}
									{...a11yProps(index)}
								/>
							)
						})}
					</Tabs>
				</div>

				{tabList.map((tab, index) => {
					return (
						<TabPanel
							key={index}
							value={value}
							index={index}>
							{tab.component}
						</TabPanel>
					)
				})}
			</div>
		</ThemeProvider>
	)
}

export default TabView
