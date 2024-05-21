'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTranslation } from 'react-i18next';

import { useDelivery } from './new-delivery.hooks';
import { getStateIdToLocationIdApi } from './new-delivery.container';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { BackSvg, SearchIconSvg } from '@/public/assets/svgs/searchSvg';
import {
	DeliverySvg,
	DeliveryTipSvg,
	PickupSvg,
} from '@/public/assets/svgs/deliverySvg';
import './style.css';

const NewDelivery = () => {
	const { locationList, cityList } = useDelivery();
	const router = useRouter();
	const params = useSearchParams();
	const { t } = useTranslation();
	const { primaryThemeColourCode, secondrythemeColourCode } = useSelector(
		(state: RootState) => state.StoreReducer.customerDetails
	);
	const tab = params.get('tab');
	const [active, setActive] = useState(tab);
	const [searchInput, setSearchInput] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [addressError, setAddressError] = useState('');
	const [isAddressError, setIsAddressError] = useState(false);
	const [isError, setIsError] = useState(false);

	const filteredData = cityList.filter((item) =>
		t('local') === 'ar'
			? item.nameInArabic.toLowerCase().includes(searchInput.toLowerCase())
			: item.name.toLowerCase().includes(searchInput.toLowerCase())
	);

	const handlePickup = (locationId: string) => {
		global?.localStorage?.setItem('locationId', locationId);
		global?.localStorage?.setItem('orderType', 'pickup');
		router.push('/');
	};

	const handleDelivery = async (id: string) => {
		try {
			const res = await getStateIdToLocationIdApi(
				global?.localStorage?.getItem('StoreId') ?? '',
				id
			);
			if (res) {
				global?.localStorage?.setItem('locationId', res);
				global?.localStorage?.setItem('orderType', 'normal');
				router.push('/');
			}
		} catch (e) {
			setIsAddressError(true);
			setAddressError(t("We don't cover this area."));
			console.log('Error happened selecting country: ', e);
		}
	};

	const handleBack = () => {
		if (global?.localStorage?.getItem('locationId')) {
			router.push('/');
		} else {
			setIsError(true);
			setErrorMsg(t('pick location first'));
		}
	};

	return (
		<div className={`delivery-layout`} style={{ color: secondrythemeColourCode }}>
			<div className='delivery-header' onClick={handleBack}>
				<BackSvg />
			</div>

			<div className='delivery-container'>
				<p className='delivery-text'>{t('Method')}</p>
			</div>

			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'start',
					alignItems: 'center',
					gap: 36,
					margin: '14px 25px',
				}}>
				<div
					className='delivery-button'
					style={{
						border:
							active === 'delivery' ? `1px solid ${primaryThemeColourCode}` : '',
					}}
					onClick={() => setActive('delivery')}>
					<DeliverySvg
						color={active === 'delivery' ? primaryThemeColourCode : '#C4C4C4'}
					/>
					<p
						className='delivery-button-text'
						style={{
							color: active === 'delivery' ? primaryThemeColourCode : '#C4C4C4',
						}}>
						{t('Delivery')}
					</p>
				</div>
				<div
					className='delivery-button'
					style={{
						border: active === 'pickup' ? `1px solid ${primaryThemeColourCode}` : '',
					}}
					onClick={() => setActive('pickup')}>
					<PickupSvg
						color={active === 'pickup' ? primaryThemeColourCode : '#C4C4C4'}
					/>
					<p
						className='delivery-button-text'
						style={{
							color: active === 'pickup' ? primaryThemeColourCode : '#C4C4C4',
						}}>
						{t('Pick up')}
					</p>
				</div>
			</div>

			<div className='delivery-container'>
				<p className='delivery-text'>
					{active === 'pickup' ? t('Choose a store') : t('Location')}
				</p>
			</div>

			{active === 'pickup' ? (
				locationList.map((location) => (
					<div
						className='location-container'
						key={location._id}
						onClick={() => handlePickup(location._id)}>
						<p className='location-name'>{location.storeName}</p>
						<DeliveryTipSvg />
					</div>
				))
			) : (
				<>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 13,
							padding: '10px 25px',
							borderBottom: '1px solid #C4C4C4',
						}}>
						<SearchIconSvg />
						<input
							type='text'
							placeholder={t('Search...')}
							className='delivery-search-container'
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>
					<div
						style={{
							padding: '17px 35px',
							display: 'flex',
							flexDirection: 'column',
							gap: 22,
						}}>
						{filteredData?.map((city) => (
							<select
								key={city._id}
								value={t('local') === 'ar' ? city?.nameInArabic : city?.name}
								className='delivery-select'
								onChange={(e) => handleDelivery(e.target.value)}>
								<option>{t('local') === 'ar' ? city?.nameInArabic : city?.name}</option>
								{city?.stateInfo?.map((state) => (
									<option key={state._id} value={state._id}>
										{t('local') === 'ar' ? state?.nameInArabic : state?.name}
									</option>
								))}
							</select>
						))}
					</div>
				</>
			)}
			<Snackbar
				open={isError}
				autoHideDuration={3000}
				onClose={() => {
					setErrorMsg('');
					setIsError(false);
				}}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
				<Alert
					severity='error'
					onClose={() => {
						setErrorMsg('');
						setIsError(false);
					}}>
					{errorMsg}
				</Alert>
			</Snackbar>
			<Snackbar
				open={isAddressError}
				autoHideDuration={3000}
				onClose={() => {
					setAddressError('');
					setIsAddressError(false);
				}}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
				<Alert
					severity='error'
					onClose={() => {
						setAddressError('');
						setIsAddressError(false);
					}}>
					{addressError}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default NewDelivery;
