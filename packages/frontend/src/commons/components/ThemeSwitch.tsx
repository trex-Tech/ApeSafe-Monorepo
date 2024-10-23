import { MoonIcon, SunIcon } from "@heroicons/react/20/solid"
import { twMerge } from "tailwind-merge"
import Toggle from "@components/Toggle"
import { useSettingsStore } from "@store/settingsStore"

const ThemeSwitch = ({ className = "", icon = false }) => {
	const { darkMode, setDarkMode } = useSettingsStore()

	return (
		<div className={twMerge(`w-fit`, className)}>
			{icon ? (
				<span className="flex w-full items-center gap-5">
					<SunIcon className="w-5 text-gray-600" />
					<Toggle checked={darkMode} onClick={setDarkMode} />
					<MoonIcon className="w-5 text-gray-600" />
				</span>
			) : (
				<span className="flex w-full justify-between">
					<p className="">Dark Theme</p>
					<Toggle checked={darkMode} onClick={setDarkMode} />
				</span>
			)}
		</div>
	)
}

export default ThemeSwitch
