import React, {useState} from "react";
import {Button, FormItem, FormLayout, FormLayoutGroup, Input} from "@vkontakte/vkui";

const Calc = () => {
    const [ipString, setIpString] = useState('');
    const [mask, setMask] = useState('');
    const [maskResult, setMaskResult] = useState('');
    const [hosts, setHosts] = useState(0);
    const [broadcast, setBroadcast] = useState('');
    const [address, setAddress] = useState('');

    const [showResult, setShowResult] = useState(false)

    const isCanCalc = !(ipString.length !== 0 && mask && mask >= 0 && mask <=
        32 && ipString.split('.').every(e => e <= 255 && e >= 0))

    const calcAddresses = (mask, ipString) => {
        const maskBitLength = [0, 128, 192, 224, 240, 248, 252, 254, 255]
        let maskResult = [];
        let ip = ipString.split('.');
        //Расчёт количества адресов
        setHosts(Math.pow(2, 32 - mask));
        //Расчёт маски
        const calcMaskResult = () => {
            let notFullOct = mask % 8;
            let fullOct = (mask - notFullOct) / 8;
            for (let i = 0; i < 4; i++) {
                if (fullOct !== 0) {
                    maskResult[i] = 255;
                    fullOct -= 1;
                } else {
                    maskResult[i] = maskBitLength[notFullOct];
                    notFullOct = 0;
                }
            }
            setMaskResult(maskResult.join('.'));
        };
        calcMaskResult();
        //Адрес сети и широковещательный адрес
        let magicNumber;
        let octMagicNumber;
        for (let i = 0; i < maskResult.length; i++) {
            if (maskResult[i] !== 255 && maskResult[i] !== 0) {
                magicNumber = 256 - maskResult[i];
                octMagicNumber = i;
            } else if (!magicNumber) {
                magicNumber = 0;
                octMagicNumber = -1;
            }
        }
        if (magicNumber !== 0 && octMagicNumber !== -1) {
            const octMagicIP = ip[octMagicNumber];
            let addressOct;
            let broadcastOct;
            for (let i = 0; i <= 255; i += magicNumber) {
                if (octMagicIP >= i
                    && octMagicIP < (i + magicNumber)
                    && (i + magicNumber < 256)
                ) {
                    addressOct = i;
                    broadcastOct = i;
                }
            }
            //Нахождение адреса сети
            let address = [];
            for (let i = 0; i < ip.length; i++) {
                if (maskResult[i] === 255) {
                    address[i] = ip[i];
                } else {
                    address[i] = addressOct;
                    addressOct = 0;
                }
            }
            setAddress(address.join('.'));
            //Нахождение широковещательного адреса
            let broadcast = [];
            for (let i = 0; i < ip.length; i++) {
                if (maskResult[i] === 255) {
                    broadcast[i] = ip[i];
                } else {
                    if (broadcastOct + magicNumber < 256) {
                        broadcast[i] = broadcastOct + magicNumber - 1;
                        broadcastOct = 255;
                    } else {
                        broadcast[i] = 255;
                    }
                }
            }
            setBroadcast(broadcast.join('.'))
        } else {
            //Адрес сети
            let address = [];
            for (let i = 0; i < ip.length; i++) {
                if (maskResult[i] === 255) {
                    address[i] = ip[i];
                } else {
                    address[i] = 0;
                }
            }
            setAddress(address.join('.'));
            //Широковещательный адрес
            let broadcast = [];
            for (let i = 0; i < ip.length; i++) {
                if (maskResult[i] === 255) {
                    broadcast[i] = ip[i];
                } else {
                    broadcast[i] = 255;
                }
            }
            setBroadcast(broadcast.join('.'))
        }
        setShowResult(true)
    };
    const clearInputs = () => {
        setIpString('');
        setMask('');
        setMaskResult('');
        setHosts(0);
        setBroadcast('');
        setAddress('');
        setShowResult(false)
    }

    return (
        <>
            <FormLayout>
                <FormLayoutGroup mode={'horizontal'}>
                    <FormItem top={'IP-адрес'}>
                        <Input
                            type="text"
                            placeholder={'192.212.23.76'}
                            value={ipString}
                            onChange={(e) => setIpString(e.target.value)}
                        />
                    </FormItem>
                    <FormItem top={'Маска'}>
                        <Input
                            type="text"
                            placeholder={'25'}
                            value={mask}
                            onChange={(e) => setMask(e.target.value)}
                        />
                    </FormItem>
                </FormLayoutGroup>
                {
                    showResult ? <>
                        <FormLayoutGroup mode={'horizontal'}>
                            <FormItem top={'Маска'}>
                                <Input
                                    type="text"
                                    placeholder={'255.255.255.255'}
                                    value={maskResult}
                                    readOnly
                                />
                            </FormItem>
                            <FormItem top={'Колличество адресов'}>
                                <Input
                                    type="text"
                                    placeholder={'928'}
                                    value={hosts}
                                    readOnly
                                />
                            </FormItem>
                        </FormLayoutGroup>
                        <FormLayoutGroup mode={'horizontal'}>
                            <FormItem top={'Адрес сети'}>
                                <Input
                                    type="text"
                                    placeholder={'255.255.255.255'}
                                    value={address}
                                    readOnly
                                />
                            </FormItem>
                            <FormItem top={'Широковещательный адрес'}>
                                <Input
                                    type="text"
                                    placeholder={'255.255.255.255'}
                                    value={broadcast}
                                    readOnly
                                />
                            </FormItem>
                        </FormLayoutGroup>
                    </> : null
                }
                <FormItem>
                    <Button
                        disabled={isCanCalc}
                        size={'l'}
                        onClick={() => {
                            if (showResult) {
                                clearInputs()
                            } else {
                                calcAddresses(mask, ipString);
                            }
                        }}
                    >
                        {showResult ? "Очистить" : "Рассчитать"}
                    </Button>
                </FormItem>
            </FormLayout>
        </>
    );
}

export default Calc;
