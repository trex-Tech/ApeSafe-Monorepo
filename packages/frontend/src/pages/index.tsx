import DashboardLayout from "@src/pages/(dashboard)/_layout"
import HomePage from "@src/pages/(dashboard)/dashboard"

function BasePage({}) {
	return (
		<DashboardLayout>
			<HomePage />
		</DashboardLayout>
	)
}

export default BasePage
