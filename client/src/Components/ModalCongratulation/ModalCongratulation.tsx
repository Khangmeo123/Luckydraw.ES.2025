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

    console.log("curreentLuckyUser", currentLuckyUser)


    return (
        <>
            <Modal width={1000}
                // title="Congratulations!"
                open={isOpen}
                onOk={handleSave}
                onCancel={handleCancel}
                className='modal-congratulation'
                cancelText='Không nhận giải'
                okText='Nhận giải'
                closeIcon={null}
                maskClosable={false}
            >
                <div className='modal-congratulation__content'>
                    <div className='avatar-block'>
                        <img src={`https://checkin-es.yep.io.vn${currentLuckyUser?.Avatar}`} alt='avatar' className='avatar' />
                    </div>
                    <div className='information-block'>
                        <div className='lucky-prize'>{formatPrize(currentLuckyUser?.Giai)}</div>

                        <Row>
                            <Col span={8} className='info-field'>
                                Chúc mừng:
                            </Col>
                            <Col span={16} className='info-user'>
                                {currentLuckyUser?.FullName}
                            </Col>
                            <Col span={8} className='info-field'>
                                Email:
                            </Col>
                            <Col span={16} className='info-user'>
                                {currentLuckyUser?.Email}
                            </Col>
                            <Col span={8} className='info-field'>
                                Phòng:
                            </Col>
                            <Col span={16} className='info-user'>
                                {currentLuckyUser?.Department}
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

export default ModalCongratulation;