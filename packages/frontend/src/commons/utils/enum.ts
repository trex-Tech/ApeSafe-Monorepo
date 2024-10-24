export enum ADMIN_ACCESS_LEVELS {
	VIEWER = "viewer",
	ADMIN = "admin",
	SUPER_ADMIN = "super_admin",
}

export enum PRODUCT_TYPES {
	animal_food = "Animal Food",
	pet_sale = "Pet Sale",
	mating = "Mating",
	adoption = "Adoption",
}

export enum SELLER_STATUS {
	Approved = "Verified",
	Review = "In Review",
	InActive = "InActive",
}

//['completed', 'cancelled', 'in-delivery', 'delivered', 'awaiting-pickup']

export enum ORDER_STATUS {
	"pending" = "Pending",
	"completed" = "Completed",
	"cancelled" = "Cancelled",
	"in-delivery" = "In Delivery",
	"delivered" = "Delivered",
	"awaiting-pickup" = "Awaiting Pickup",
}
