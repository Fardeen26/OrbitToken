/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

class IPFSMetadataService {
    private static IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

    static async fetchMetadata(ipfsUri: string): Promise<any> {
        try {
            const cid = ipfsUri.replace('ipfs://', '');

            const gatewayUrl = `${this.IPFS_GATEWAY}${cid}`;

            const response = await axios.get(gatewayUrl);

            return response.data;
        } catch (error) {
            console.error('Failed to fetch IPFS metadata:', error);
            throw error;
        }
    }

    static async fetchMetadataWithFallback(ipfsUri: string): Promise<any> {
        const gateways = [
            'https://gateway.pinata.cloud/ipfs/',
            'https://ipfs.io/ipfs/',
            'https://cloudflare-ipfs.com/ipfs/'
        ];

        for (const gateway of gateways) {
            try {
                const cid = ipfsUri.replace('ipfs://', '');
                const gatewayUrl = `${gateway}${cid}`;

                const response = await axios.get(gatewayUrl);
                return response.data;
            } catch (error) {
                console.warn(`Failed to fetch from ${gateway}`, error);
            }
        }

        throw new Error('Unable to fetch metadata from any gateway');
    }
}

export default IPFSMetadataService;