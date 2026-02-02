/* eslint-disable @typescript-eslint/no-require-imports */
import { Col, Modal, Row } from 'antd';
import React from 'react';
import { DataUser } from '../../App';
import "./ModalCongratulation.scss";
interface ModalViewCongratulationProps {
    isOpen?: boolean;
    setIsOpen?: (data: boolean) => void;
    currentLuckyUser?: DataUser;
    handleCancel?: () => void;
}

function ModalViewCongratulation(props: ModalViewCongratulationProps) {
    const {
        isOpen,
        // setIsOpen,
        currentLuckyUser,
        handleCancel,
    } = props;


    function excelDateToJSDate(excelDate: number) {
        // Kiểm tra xem có phải là số hay không
        if (typeof excelDate !== 'number') {
            return "Dữ liệu không hợp lệ. Vui lòng nhập một số.";
        }
        // Hệ thống ngày 1900
        const excelEpoch = new Date(1899, 11, 31); // 0/1/1900
        const excelEpochMilliseconds = excelEpoch.getTime();

        // Excel đôi khi tính sai ngày nhuận, cần trừ đi 1 ngày nếu sau ngày 28/2/1900
        if (excelDate > 60) {
            excelDate -= 1;
        }

        const milliseconds = (excelDate - 1) * 24 * 60 * 60 * 1000;
        const jsDate = new Date(excelEpochMilliseconds + milliseconds);

        return jsDate;
    }

    const formatFullName = React.useCallback((fullName?: string) => {
        if (fullName?.length) {
            const [Ten, Ho, ...Dem] = fullName?.split(' ') || [];
            return Ho + " " + `${Dem?.length > 1 ? Dem.join(' ') : Dem}` + " " + Ten;
        }
    }, []);

    const formatPrize = React.useCallback((prize?: string) => {
        switch (prize) {
            case '5M':
                return 'Giải 5M';
            case '2M':
                return 'Giải 2M';
            case '1M':
                return 'Giải 1M';
            case '500k':
                return 'Giải 500k';
            default:
                return prize;
        }
    }, []);



    return (
        <>
            <Modal width={1000}
                // title="Congratulations!"
                open={isOpen}
                onCancel={handleCancel}
                className='modal-congratulation modal-congratulation-view'
                cancelText='Đóng'
                // footer={null}
                closeIcon={null}

            >
                <div className='modal-congratulation__content'>
                    <div className='avatar-block'>
                        <img src={`./Data2025/${currentLuckyUser?.Avatar}`} alt='avatar' className='avatar' />
                    </div>
                    <div className='information-block'>
                        <div className='lucky-prize'>{formatPrize(currentLuckyUser?.Giai)}</div>

                        <Row>
                            <Col span={8} className='info-field'>
                                Chúc mừng:
                            </Col>
                            <Col span={16} className='info-user'>
                                {formatFullName(currentLuckyUser?.FullName)}
                            </Col>
                            <Col span={8} className='info-field'>
                                Email:
                            </Col>
                            <Col span={16} className='info-user'>
                                {currentLuckyUser?.Email}
                            </Col>
                            <Col span={8} className='info-field'>
                                Thời gian checkin:
                            </Col>
                            <Col span={16} className='info-user'>
                                {excelDateToJSDate(currentLuckyUser?.Checkin || 0)?.toLocaleString()}
                            </Col>
                            <Col span={8} className='info-field'>
                                Lời chúc:
                            </Col>
                            <Col span={16} className='info-user'>
                                {currentLuckyUser?.WishForES}
                            </Col>
                        </Row>


                    </div>
                </div>

            </Modal>
        </>
    );
};

export default ModalViewCongratulation;