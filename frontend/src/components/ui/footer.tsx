const Footer: React.FC = () => {
	return (
		<footer className="px-5 py-4 mb-10 text-center border-t-2">
			<div className="flex flex-col sm:flex-row justify-center items-center gap-6">
				<div className="flex flex-col items-center w-full sm:max-w-[50%] md:max-w-[30%]">
					<img
						src="/Logo-3000.png"
						alt="logo"
						className="w-full max-h-24 md:max-h-32 object-contain"
					/>
					<p className="font-bold text-xl pt-4">A CPS831/CP8202 Project</p>
				</div>
				<div className="flex justify-center gap-2">
					<div className="flex justify-center gap-1 flex-col">
						<p className="text-md">Maisha Labiba</p>
						<p className="text-md">Brandon Ly</p>
						<p className="text-md">Ankit Sodhi</p>
						<p className="text-md">James Williamson</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
