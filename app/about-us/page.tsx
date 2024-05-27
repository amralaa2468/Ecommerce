'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { BackSvg } from '@/public/assets/svgs/searchSvg';

import './style.css';

const NewMyOrder = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const {
		primaryThemeColourCode,
		secondrythemeColourCode,
		aboutUs,
		aboutUsInArabic,
	} = useSelector((state: RootState) => state.StoreReducer.customerDetails);

	return (
		<div className={`about-layout`} style={{ color: secondrythemeColourCode }}>
			<div className='about-header-container'>
				<div className='cursor-pointer' onClick={() => router.replace('/')}>
					<BackSvg />
				</div>
				<p className='about-header-text'>{t('About Us')}</p>
			</div>

			<div className='w-full h-fit overflow-y-auto p-5'>
				<p
					className='tracking-wide leading-relaxed'
					style={{ color: primaryThemeColourCode }}>
					{t('local') === 'ar' ? aboutUsInArabic : aboutUs}
				</p>
			</div>
		</div>
	);
};

export default NewMyOrder;
