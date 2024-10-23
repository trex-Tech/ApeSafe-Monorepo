import { useState } from "react"
import CustomText from "@components/CustomText"
import moment from "moment"
import { api, handleApiError } from "@utils/axiosProvider"
import toast from "react-hot-toast"
import AvatarImage from "@components/AvatarImage"
import { TableRowType } from "@interfaces"
import { useRouter } from "@router"
import { renderTable } from "@components/Table"
import { SELLER_STATUS } from "@utils/enum"

interface Props {
	data: IUser[]
	count?: number
	className: string
	showActions?: boolean
	filter?: { key: string; value: string; type?: "exclude" | "include" }
}

const UsersTable = ({ className = "", data, count, filter, showActions = true }: Props) => {
	const router = useRouter()
	const [showDeleteMemberDialog, setShowDeleteMemberDialog] = useState({
		show: false,
		memberInfo: {
			invite_id: "",
			email: "",
		},
	})

	function statusColor(status: IUser["status"], text?: boolean) {
		switch (status.toLowerCase()) {
			case "active":
				return !text ? "bg-green-500/20" : "text-green-700 dark:text-green-400"
			case "pending":
				return !text ? "bg-primary/20" : "text-primary dark:text-primary"
			case "flagged":
				return !text ? "bg-red-500/20" : "text-red-700 dark:text-red-400"
			default:
				return !text ? "bg-gray-500/20" : "text-gray-700 dark:text-gray-400"
		}
	}

	function sellerStatusColor(status: IUser["seller_status"], text?: boolean) {
		switch (status.toLowerCase()) {
			case "approved":
				return !text ? "bg-green-500/20" : "text-green-700 dark:text-green-400"
			case "review":
				return !text ? "bg-status-warning/20" : "text-status-warning dark:text-status-warning"
			case "disabled":
				return !text ? "bg-red-500/20" : "text-red-700 dark:text-red-400"
			default:
				return !text ? "bg-gray-500/20" : "text-gray-700 dark:text-gray-400"
		}
	}

	const table_rows: TableRowType<IUser>[] = [
		{
			label: "Name",
			visible: true,
			view: (row) => (
				<div className="flex cursor-pointer items-center gap-4">
					<AvatarImage
						className="aspect-square w-10"
						src={row?.profile_details.photo}
					/>
					<div className="flex flex-col">
						<CustomText className="text-md capitalize">
							{row?.first_name} {row?.last_name}
						</CustomText>
						<CustomText className="lowercase text-gray-500">{row?.email}</CustomText>
					</div>
				</div>
			),
		},
		{
			label: "Username",
			value: "username",
			visible: true,
		},
		{
			label: "Status",
			visible: true,
			view: (row) => (
				<div className={`${statusColor(row?.status)} w-[70%] rounded-xl px-2 py-1 text-center`}>
					<p className={`${statusColor(row?.status, true)} capitalize`}>{row?.status}</p>
				</div>
			),
		},
		{
			label: "Seller Status",
			visible: true,
			view: (row) => (
				<div
					onClick={() => router.push(`/users/${row?.id}`)}
					className={`${sellerStatusColor(row?.seller_status)} w-[70%] cursor-pointer rounded-xl px-2 py-1 text-center`}>
					<p className={`${sellerStatusColor(row?.seller_status, true)} capitalize`}>
						{SELLER_STATUS[row?.seller_status]}
					</p>
				</div>
			),
		},
		{
			format: (row: IUser) => moment(row?.date_created).format("MMM Do, YYYY"),
			visible: true,
			label: "Date Joined",
		},
	]

	const confirmAction = ({ message = "Are you sure?", action = () => {} }) => {
		const confirm = window.confirm(message)

		if (confirm) return action()
	}

	const deleteUser = (data: { email: string }) => {
		api.post(`/company/personnel/remove/${data.email}`, {})
			.then(() => {
				toast.success("User removed from company successfully")
			})
			.catch(handleApiError)
	}

	return (
		<div className={`${className}`}>
			{renderTable<IUser>({
				rows: table_rows,
				data,
				count,
				filter,
				onRowClick: (row) => router.push(`/users/${row?.id}`),
			})}
		</div>
	)
}

export default UsersTable
