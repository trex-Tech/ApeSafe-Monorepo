import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from "@mui/material"
import { useState } from "react"
import CustomText from "@components/CustomText"
import { getNestedProperty, MuiTheme, sortArrayByDate } from "@utils"
import moment from "moment"
import { api, handleApiError } from "@utils/axiosProvider"
import toast from "react-hot-toast"
import AvatarImage from "@components/AvatarImage"
import { TableRowType } from "@interfaces"
import { useRouter } from "@router"
import { renderTable } from "@components/Table"

interface Props {
	data: IPost[]
	count?: number
	className: string
	showActions?: boolean
	filter?: { key: string; value: string; type?: "exclude" | "include" }
}

const PostsTable = ({ className = "", data, count, filter, showActions = true }: Props) => {
	const router = useRouter()
	const [showDeleteMemberDialog, setShowDeleteMemberDialog] = useState({
		show: false,
		memberInfo: {
			invite_id: "",
			email: "",
		},
	})

	function statusColor(status: IPost["status"], text?: boolean) {
		switch (status) {
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

	const table_rows: TableRowType<IPost>[] = [
		{
			label: "Title",
			visible: true,
			view: (row) => (
				<div onClick={() => router.push(`/posts`)} className="flex cursor-pointer items-center gap-4">
					<AvatarImage className="aspect-square w-10" />
					<div className="flex flex-col">
						<CustomText className="text-md capitalize">jjff</CustomText>
						<CustomText className="lowercase text-gray-500">idkd</CustomText>
					</div>
				</div>
			),
		},
		{
			label: "Post Type",
			value: "type",
			visible: true,
		},
		{
			label: "Status",
			visible: true,
			view: (row) => (
				<div className={`${statusColor(row.status)} w-[70%] rounded-xl py-1 text-center`}>
					<p className={`${statusColor(row.status, true)} capitalize`}>{row.status}</p>
				</div>
			),
		},
		{
			format: (row: IPost) => moment(row.created_at).format("MMM Do, YYYY"),
			visible: true,
			label: "Date Joined",
		},
	]

	const confirmAction = ({ message = "Are you sure?", action = () => {} }) => {
		const confirm = window.confirm(message)

		if (confirm) return action()
	}

	const deletePost = (data: { email: string }) => {
		api.post(`/company/personnel/remove/${data.email}`, {})
			.then(() => {
				toast.success("Post removed from company successfully")
			})
			.catch(handleApiError)
	}

	return (
		<div className={`${className}`}>
			{renderTable<IPost>({
				rows: table_rows,
				data,
				count,
				filter,
			})}
		</div>
	)
}

export default PostsTable
