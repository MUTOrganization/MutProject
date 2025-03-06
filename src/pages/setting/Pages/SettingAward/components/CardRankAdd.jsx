import { Button, Card, CardBody } from "@nextui-org/react";
import { AddStreamlineUltimateWhiteIcon } from "../../../../../component/Icons";


function CardRankAdd({ onPress }) {
    return (
        <Card shadow="none" aria-label="Card-Rank-Info" className="w-56 h-[300px] hover:bg-black/20" onPress={onPress} isPressable>
            <CardBody className="flex items-center justify-center bg-gray-200/50">
                <AddStreamlineUltimateWhiteIcon size={30} />
            </CardBody>
        </Card>
    )
}

export default CardRankAdd;