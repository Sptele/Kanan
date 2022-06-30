export default function ProfilePicture({ name, className }) {
	const allInitials = name.split(' ').map((word) => word.charAt(0).toUpperCase());
	return <div className={"open-card-profile-picture ml-4" + (className ? " " + className : "")}>{allInitials.join('')}</div>
}