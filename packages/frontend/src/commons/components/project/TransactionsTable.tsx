import CustomText from "@components/CustomText"
import moment from "moment"
import AvatarImage from "@components/AvatarImage"
import { TableRowType } from "@interfaces"
import { useRouter } from "@router"
import parseCurrencySymbol from "@utils/parseCurrencySymbol.utils"
import { renderTable } from "@components/Table"
import { ArrowDataTransferHorizontalIcon } from "hugeicons-react"
import { PRODUCT_TYPES } from "@utils/enum"
import { orderStatusColor } from "@utils/project"

interface Props {
	data: ITransaction[]
	count?: number
	className: string
	showActions?: boolean
	filter?: { key: string; value: string; type?: "exclude" | "include" }
}

const TransactionsTable = ({ className = "", data, count, filter, showActions = true }: Props) => {
	const router = useRouter()

	const table_rows: TableRowType<ITransaction>[] = [
		{
			label: "Users",
			visible: true,
			view: ({ buyer, seller, ref_id }) => (
				<div
					onClick={() => router.push(`/transactions/${ref_id}`)}
					className="flex items-center justify-between gap-x-3">
					<div className="flex w-[40%] cursor-pointer items-center gap-4">
						<AvatarImage
							className="aspect-square w-10"
							src={buyer?.profile_details.photo}
						/>
						<div className="flex flex-col">
							<CustomText className="text-md capitalize">
								{buyer?.first_name} {buyer?.last_name}
							</CustomText>
							<CustomText className="lowercase text-gray-500">@{buyer?.username}</CustomText>
						</div>
					</div>

					<div className="w-[10%]">
						<ArrowDataTransferHorizontalIcon className="h-6 w-6" />
					</div>

					<div className="flex w-[45%] cursor-pointer items-center gap-4">
						<AvatarImage
							className="aspect-square w-10"
							src={seller?.profile_details.photo}
						/>
						<div className="flex flex-col">
							<CustomText className="text-md capitalize">
								{seller?.first_name} {seller?.last_name}
							</CustomText>
							<CustomText className="lowercase text-gray-500">@{seller?.username}</CustomText>
						</div>
					</div>
				</div>
			),
		},
		{
			label: "Amount",
			format: (row) =>
				`${parseCurrencySymbol("NGN")}${Number(row?.amount).toLocaleString("en", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`,
			visible: true,
		},
		{
			label: "Order Status",
			visible: true,
			view: (row) => (
				<div className={`${orderStatusColor(row?.order_status)} rounded-xl px-2 py-1 text-center`}>
					<p className={`${orderStatusColor(row?.order_status, true)} capitalize`}>{row?.order_status}</p>
				</div>
			),
		},
		{
			format: (row: ITransaction) => PRODUCT_TYPES[row?.product?.type],
			visible: true,
			label: "Type",
		},
		{
			format: (row: ITransaction) => moment(row?.date).format("MMM Do, YYYY"),
			visible: true,
			label: "Date",
		},
	]

	return (
		<div className={`${className}`}>
			{renderTable<ITransaction>({
				rows: table_rows,
				data,
				count,
				filter,
				onRowClick: (row) => router.push(`/transactions/${row?.ref_id}`),
			})}
		</div>
	)
}

export default TransactionsTable
