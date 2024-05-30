'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import knetImg from '@/public/assets/svgs/images/knet.png';
import mastercardImg from '@/public/assets/svgs/images/Mastercard.png';
import {
	DropdownArrowSvg,
	EcomLogoSvg,
	ExitSvg,
	MasterCardSvg,
} from '@/public/assets/svgs/ecomLogoSvg';
import '@/app/payment/style.css';
import { reorderApi } from '@/app/my-orders/my-order.container';

interface ReOrderPaymentMenuProps {
	onClose: () => void;
	orderId: string;
	orderTotal: number;
	shippingCharge: number;
}

export const ReOrderPaymentMenu: React.FC<ReOrderPaymentMenuProps> = ({
	onClose,
	orderId,
	orderTotal,
	shippingCharge,
}) => {
	const { t } = useTranslation();
	const { logo, storeName, enableKnetPayment, enableCreditPayment } =
		useSelector((state: RootState) => state.StoreReducer.customerDetails);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [isError, setIsError] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);

	const handlePay = async () => {
		if (paymentMethod === '') {
			setErrorMsg('please select payment method');
			setIsError(true);
		} else {
			try {
				const resPay = await reorderApi(
					orderId,
					orderTotal,
					paymentMethod,
					shippingCharge
				);

				window.open(resPay.reorder.paymentLink, '_self');
			} catch (error) {
				setErrorMsg('An error occured while trying to reorder.');
				setIsError(true);
				console.log(error);
			}
		}
	};

	return (
		<div className='order-layout'>
			<div className='order-container'>
				<div
					className={`absolute top-[-15px] ${
						t('local') === 'ar' ? 'left-[-10px]' : 'right-[-10px]'
					} cursor-pointer`}
					onClick={onClose}>
					<ExitSvg />
				</div>
				<div
					className={`flex items-center gap-2.5 mb-[7px] ${
						t('local') === 'ar' ? 'mr-[30px]' : 'ml-[30px]'
					}`}>
					<p className='order-powered'>{t('Powered by')}</p>
					<EcomLogoSvg />
				</div>

				<div className='order-details-container'>
					<div className='order-details-line'></div>

					<div className='order-details-data'>
						<div className='flex flex-col items-center'>
							<img
								src={logo}
								alt='store-logo'
								className='w-[63px] h-[63px] rounded-[63px] mb-3'
							/>
							<p className='order-store-name'>{t('PAYMENT FOR')}</p>
							<p className='order-store-name' style={{ fontWeight: 700 }}>
								{storeName}
							</p>
						</div>

						<div className='order-details-menu'>
							<p className='order-details-menu-text'>{t('Order details')}</p>
							<div
								style={{ cursor: 'pointer' }}
								onClick={() => setOpenMenu(!openMenu)}>
								<DropdownArrowSvg />
							</div>

							{openMenu && (
								<div className='order-details-dropdown'>
									{shippingCharge !== 0 && (
										<div className='order-details-dropdown-con'>
											<p className='order-details-dropdown-text'>{t('Delivery fees')}</p>
											<p className='order-details-dropdown-text'>
												{shippingCharge} {t('KD')}
											</p>
										</div>
									)}
									<div className='order-details-dropdown-con'>
										<p className='order-details-dropdown-text'>{t('Total')}</p>
										<p className='order-details-dropdown-text'>
											{orderTotal + shippingCharge} {t('KD')}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className='order-payment-container'>
						<div className='flex justify-center items-center w-full gap-7 my-[21px] mx-0'>
							{enableKnetPayment && (
								<img
									alt='knet'
									className={`w-[74px] h-[52px] ${
										paymentMethod === 'knet' && 'border-[3px] border-[#57AD13]'
									}`}
									src={knetImg.src}
									onClick={() => setPaymentMethod('knet')}
								/>
							)}
							{enableCreditPayment && (
								<div
									className={`order-payment-image ${
										paymentMethod === 'credit'
											? 'border-[3px] border-[#57AD13]'
											: 'border border-[#c4c4c4]'
									}`}
									onClick={() => setPaymentMethod('credit')}>
									<MasterCardSvg />
								</div>
							)}
						</div>
						<div className='order-payment-button' onClick={handlePay}>
							<p className='order-payment-button-text'>{t('Pay with')}</p>
							{(enableKnetPayment || enableCreditPayment) && paymentMethod !== '' && (
								<img
									alt='knet'
									style={{ width: 33, height: 23 }}
									src={paymentMethod === 'knet' ? knetImg.src : mastercardImg.src}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
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
		</div>
	);
};
