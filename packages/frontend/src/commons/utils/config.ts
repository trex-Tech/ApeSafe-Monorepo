import { UseFormProps } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ObjectSchema } from "yup"

interface Config {
	useForm: (props: UseFormProps, schema: ObjectSchema<any>) => UseFormProps
}

const CONFIG: Config = {
	useForm: (props = {}, schema) => ({
		mode: "all",
		resolver: schema ? yupResolver(schema) : null,
		...props,
	}),
}

export default CONFIG
