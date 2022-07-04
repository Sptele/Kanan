import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Comment() {
	return (
		<div className='flex flex-row gap-2'>
			<Skeleton circle />
			<div className='flex flex-col mt-2'>
				<h6>
					<Skeleton
						height={"1.25rem"}
						width={"50%"}
					/>
				</h6>
				<p className='text-xs text-slate-500'>
					<Skeleton height={"0.75rem"} />
				</p>
			</div>
		</div>
	);
}

export default function CardSkeleton() {
	return (
		<SkeletonTheme
			baseColor='#ccc'
			highlightColor='#999'>
			<div className='bg-white rounded-[2.5rem] fixed z-40 top-[2vh] left-[2vh] min-w-[98vw] min-h-[96vh] p-4 flex flex-row gap-4 text-left'>
				<div className='w-[75%]'>
					<div>
						<Skeleton
							height={"3.75rem"}
							width={"30%"}
							style={{ float: "left", margin: 0 }}
							inline
						/>
						<h1 className='float-left mx-4'> &#9679; </h1>
						<Skeleton
							height={"3.75rem"}
							width={"60%"}
							style={{ float: "left", margin: 0 }}
							inline
						/>
					</div>
					<Skeleton
						height={"1.875rem"}
						width={"80%"}
						style={{ marginBottom: "0.5rem" }}
					/>
					<div className='border-4 border-black p-1'>
						<strong>Description:</strong>
						<Skeleton count={5} />
					</div>
					<Skeleton
						height={"2.75rem"}
						width={"15%"}
					/>
					<div className='flex flex-row gap-2'>
						<Skeleton circle height={"3rem"} width="3rem" />
						<div className='flex flex-col mt-2'>
							<Skeleton
								height={"1.25rem"}
								width={"50%"}
							/>
							<Skeleton height={"0.75rem"} />
						</div>
					</div>
				</div>
			</div>
		</SkeletonTheme>
	);
}
