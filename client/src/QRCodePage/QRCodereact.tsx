import "./style.scss"
import { useCallback } from "react";
import QrScanner from 'qr-scanner';
import ButtonIcon from '../component/IconButton/IconButton'
import { calculateNewValue } from "@testing-library/user-event/dist/utils";

function QRcode() {
    
    function data(result: QrScanner.ScanResult){

        if ((localStorage.getItem('sauvegarde'))===null){
            localStorage.setItem('sauvegarde',result.data)
        }
        else if (localStorage.getItem('sauvegarde')!==result.data){
            console.log(result)
            localStorage.setItem('sauvegarde',result.data)
        }
        else if (localStorage.getItem('sauvegarde')===result.data){
            
        }
    }
    
    const onRefChange = useCallback((node: HTMLVideoElement) => {
        if (node === null) {
        } else {
            const scanner = new QrScanner(
                node,
                result => data(result),
                {
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                    calculateScanRegion: (video) => {
                        const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
                        const scanRegionSize = 200
                        return {
                            x: Math.round((video.videoWidth - scanRegionSize) / 2),
                            y: Math.round((video.videoHeight - scanRegionSize) / 2),
                            width: scanRegionSize,
                            height: scanRegionSize,
                            downScaledWidth: 400,
                            downScaledHeight: 400,
                        }
                    }
                });

            scanner.start().then(() => {});
        }
        //window.scanner = scanner;
    }, []);

    return (
        <div className="qr__page">
            <div id="video__container">
                <ButtonIcon icon="arrow"/>
                <video id="video__qr" ref={onRefChange}>
                </video>
            </div>
        </div>
    );
}

export default QRcode;