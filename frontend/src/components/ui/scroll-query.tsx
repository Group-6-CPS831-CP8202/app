export default function scrollQuery(name: string) {
	return (
		<div>
			<h3>Dashboard page</h3>
			<p>Hi {auth.user}!</p>
			<p>If you can see this, that means you are authenticated.</p>
		</div>
	);
}
