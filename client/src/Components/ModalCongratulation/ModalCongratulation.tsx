/* eslint-disable @typescript-eslint/no-require-imports */
import { Col, Modal, Row } from 'antd';
import React from 'react';
import { DataUser } from '../../App';
import "./ModalCongratulation.scss";
interface ModalCongratulationProps {
    isOpen?: boolean;
    setIsOpen?: (data: boolean) => void;
    currentLuckyUser?: DataUser;
    handleSave?: () => void;
    handleCancel?: () => void;
}

function ModalCongratulation(props: ModalCongratulationProps) {
    const {
        isOpen,
        // setIsOpen,
        currentLuckyUser,
        handleSave,
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
            case 'best':
                return 'Giải đặc biệt';
            case '1st':
                return 'Giải nhất';
            case '2nd':
                return 'Giải nhì';
            case '3rd':
                return 'Giải ba';
            case '4th':
                return 'Giải khuyến khích';
            default:
                return 'Giải khuyến khích';
        }
    }, []);



    return (
        <>
            <Modal width={800}
                // title="Congratulations!"
                open={isOpen}
                onOk={handleSave}
                onCancel={handleCancel}
                className='modal-congratulation'
                cancelText='Không nhận giải'
                okText='Nhận giải'
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
                                {"Chúc cho ES một năm 2025 thành công rực rỡ trên mọi mặt trận, chúc cho các ESer được thưởng thật nhiều <3"}
                            </Col>
                        </Row>


                    </div>
                </div>

            </Modal>
        </>
    );
};

export default ModalCongratulation;