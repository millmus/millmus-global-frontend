import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Router from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Clock from '@public/home/Clock.png';
import UserWatch from '@public/home/UserWatch.png';
import Firework from '@public/home/Firework.png';
import Mail from '@public/home/Mail.png';

export default function TopBanner() {
	const [topBanner, setTopBanner] = useState<boolean | null>(null);
	const settings = {
		speed: 800,
		fade: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
	};

	useEffect(() => {
		let existedTopBanner = true;
		if (localStorage) {
			const tempExistedTopBanner = localStorage.getItem(`topBanner`) ?? '0';
			existedTopBanner = parseInt(tempExistedTopBanner) < new Date().getTime();
		}
		setTopBanner(existedTopBanner);
	}, []);

	const closePopup = (e: any) => {
		e.stopPropagation();
		let date = new Date(),
			dateNumber = date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
		localStorage.setItem(`topBanner`, String(dateNumber));
		setTopBanner(false);
	}
	const contents = [
		{
			text1: "유료급 알찬!", text2: "초고퀄 무료라이브 참여하기",
			icon1: { src: Clock, },
			icon2: { src: UserWatch, classes: "h-[60px] w-[60px]" },
			href: "/lecture/coin/1",
		},
	];

	return (topBanner && contents.length ?
		<Slider {...settings} className="topbanner bg-[#00E7FF] h-[70px] w-screen text-black shadow-md md:h-[40px]">
			{contents.map((d, index) =>
				<div key={index} className="h-[70px] md:h-[40px]" onClick={() => {
					if (d.href) Router.push(d.href);
				}}>
					<div className="flex relative h-full max-w-[1180px] mx-auto pr-[50px] justify-center md:max-w-[330px] md:pr-0 md:justify-between">
						<div className='relative h-[60px] w-[60px] my-auto md:h-[40px] md:w-[40px]'>
							<Image
								src={d.icon1.src}
								alt='Left Icon'
								layout='fill'
								objectFit='cover'
								quality={100}
							/>
						</div>
						<div className="flex flex-col w-[500px] justify-center text-center font-bold md:w-auto">
							<div className="text-sm md:text-xs">{d.text1}</div>
							<div className="text-xl md:text-xs">{d.text2}</div>
						</div>
						<div className={`relative my-auto md:hidden ${d.icon2.classes ?? ""}`}>
							<Image
								src={d.icon2.src}
								alt='Right Icon'
								layout='fill'
								objectFit='cover'
								quality={100}
							/>
						</div>
						<div
							className='absolute h-full top-0 right-6 items-center flex justify-end cursor-pointer z-10 md:relative md:right-0'
							onClick={closePopup}>
							<span className="md:hidden">오늘 하루 보지 않기</span>
							<svg
								className='w-[22px] h-[22px] md:w-[20px] md:h-full'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='black'
								strokeWidth={1}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</div>
					</div>
				</div>
			)}
		</Slider>
		: null
	)
}