import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ThemeProvider,
	useMediaQuery,
} from "@mui/material"
import { getNestedProperty, MuiTheme, sortArrayByDate } from "@utils"
import { TableRowType } from "@interfaces"

interface Props<T = any> {
	data: T[]
	count?: number
	rows: TableRowType<T>[]
	filter?: { key: string; value: string; type?: "exclude" | "include" }
	onRowClick?: (row: T) => void
	tHeadBorder?: boolean
}

export const renderTable = <T,>({ rows, data, filter, count, onRowClick, tHeadBorder = true }: Props<T>) => {
	const isMobile = useMediaQuery("(max-width:768px)")
	return (
		<ThemeProvider theme={MuiTheme}>
			<TableContainer>
				<Table
					className="text-gray-200 "
					aria-label="simple table">
					<TableHead>
						<TableRow className="">
							{rows
								?.filter(({ visible }) => visible)
								.map((field: any, index: number) => (
									<TableCell
										className="font-bold capitalize text-gray-300 dark:text-gray-500"
										sx={{
											borderTop: tHeadBorder ? 1 : 0,
											borderBottom: tHeadBorder ? 1 : 0,
											borderColor: "rgba(141,141,141,0.28)",
											// width: field.value === "date" && isMobile ? "150px" : "auto",
										}}
										key={index}>
										{field.label}
									</TableCell>
								))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data
							?.filter((row) => {
								if (filter) {
									if (filter?.type == "exclude") {
										return (
											getNestedProperty(row, filter?.key).toLowerCase() !=
											filter?.value?.toLowerCase()
										)
									} else {
										return (
											getNestedProperty(row, filter?.key).toLowerCase() ==
											filter?.value?.toLowerCase()
										)
									}
								}
								return true
							})
							.slice(0, count ?? data?.length)
							.map((row, index) => (
								<TableRow
									key={index}
									onClick={onRowClick ? () => onRowClick(row) : undefined}
									className={`font-base border-0 ${onRowClick ? "cursor-pointer hover:bg-black/5 dark:hover:bg-white/5" : ""}`}
									sx={{
										/*'&:last-child td, &:last-child th': { border: 0 },*/
										border: 0,
										borderColor: "red",
									}}>
									{rows
										?.filter(({ visible }) => visible)
										.map((field: any, index: number) => (
											<TableCell
												className={`dark:text-white`}
												sx={{
													borderTop: 0,
													borderColor: "rgba(141,141,141,0)",
												}}
												key={index}>
												{field?.view
													? field?.view(row)
													: field?.format
														? field?.format(row)
														: getNestedProperty(row, field.value)}
											</TableCell>
										))}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</ThemeProvider>
	)
}
