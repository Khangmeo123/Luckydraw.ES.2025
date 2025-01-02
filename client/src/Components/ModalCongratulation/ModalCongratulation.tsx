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

    const [Ten, Ho, ...Dem] = React.useMemo(() => {
        return currentLuckyUser?.FullName?.split(' ') || [];
    }, [currentLuckyUser]);

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
                        <div className='wish-for-es'>Lời chúc: {currentLuckyUser?.WishForES}</div>

                        <Row>
                            <Col span={8} className='info-field'>
                                Chúc mừng:
                            </Col>
                            <Col span={16} className='info-user'>
                                {Ho + " " + Dem + " " + Ten}
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
                        </Row>
                        <div className='lucky-prize'>{currentLuckyUser?.Giai || "Giải khuyến khích"}</div>
                    </div>
                </div>

            </Modal>
        </>
    );
};

export default ModalCongratulation;