import { Card as TCard, CardHeader, CardBody, Image } from "@nextui-org/react";

export default function Card({ title }) {
    return (

        <TCard className="py-4 mt-5">
            <CardHeader className="pb-0 pt-2 px-4 flex-col">
                <p className="text-tiny uppercase font-bold">{title}</p>
                {/* <small className="text-default-500">12 Tracks</small>
                <h4 className="font-bold text-large">Frontend Radio</h4> */}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src="https://nextui.org/images/hero-card-complete.jpeg"
                    width={270}
                />
            </CardBody>
        </TCard>
    );
}