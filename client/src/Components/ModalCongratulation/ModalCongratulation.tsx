import { Modal } from 'antd';
import React from 'react';
import { DataUser } from '../../App';

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

    return (
        <>

            <Modal title="Congratulations!" visible={isOpen} onOk={handleSave} onCancel={handleCancel}>
                <p>Congratulations on your lucky!</p>
                {currentLuckyUser?.FullName}
            </Modal>
        </>
    );
};

export default ModalCongratulation;