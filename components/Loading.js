import Image from "next/image";

export default function Loading({ text }) {
	return (
		<div className='absolute flex w-full h-full justify-center items-center bg-[#00000028] z-50'>
			<div className='flex flex-row gap-2 bg-white text-black p-2 min-w-[28rem] fixed'>
				<Image
					src='/loading.svg'
					width='128'
					height='128'
					alt={"A gear spinning to signify loading."}
				/>
				<h1 className='text-red my-auto'>{text}</h1>
			</div>
		</div>
	);
}
