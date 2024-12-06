import axios from "axios";

type TokenMetadata = {
    tokenName: string,
    tokenSymbol: string,
    description: string,
    tokenImage: string
}

class PinataService {
    static API_KEY = import.meta.env.VITE_PINATA_API_KEY as string;
    static SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY as string;

    static async uploadMetadata(metadata: TokenMetadata): Promise<string> {
        try {
            const response = await axios.post(
                'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                metadata,
                {
                    headers: {
                        'pinata_api_key': this.API_KEY,
                        'pinata_secret_api_key': this.SECRET_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return `ipfs://${response.data.IpfsHash}`;
        } catch (error) {
            console.error('Failed to upload to IPFS:', error);
            throw error;
        }
    }
}

export default PinataService;