import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import React from 'react'

function ModalRankInfo({ isOpen, onClose, currentAwardData, conditionFirstTier, getMedals }) {
    console.log(conditionFirstTier[0])
    return (
        <Modal isOpen={isOpen} onClose={onClose} size='xl'>
            <ModalContent>
                <ModalHeader className='text-slate-600'>เงื่อนไขการได้รับแรงค์</ModalHeader>
                <ModalBody>
                    <div>
                        {getMedals &&
                            getMedals.map((medal, index) => (
                                <div key={index} className="flex flex-row items-center space-x-3">
                                    <span>{medal.name}</span>
                                    {(() => {
                                        const test = conditionFirstTier[0].map((item, index) => {
                                            const firstTierData = item.amount
                                            const tier = item.tier
                                            let data = {
                                                amount: firstTierData ,
                                                tier : tier
                                            }
                                            return data
                                        })

                                        return (
                                            <>
                                                {test.map((data, idx) => (
                                                    <div key={idx}>
                                                        {console.log(data)}
                                                        ถ้าทำยอดขายได้{' '}
                                                        {medal === 'Silver' && data.tier.some(0) ? (
                                                            <span>{data.amount} for Silver</span>
                                                        ) : (
                                                            <span>{data.amount} for Other Medals</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </>
                                        )
                                    })()}
                                </div>
                            ))}
                    </div>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalRankInfo
