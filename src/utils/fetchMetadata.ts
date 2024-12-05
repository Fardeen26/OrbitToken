/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

class IPFSMetadataService {
    // Pinata's public IPFS gateway
    private static IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

    /**
     * Fetch metadata from an IPFS URI
     * @param ipfsUri IPFS URI (e.g., 'ipfs://QmceeVNFVgtmGWvyULRvRk1cg5ywCvheMXxe6LgHqDSxub')
     * @returns Parsed metadata object
     */
    static async fetchMetadata(ipfsUri: string): Promise<any> {
        try {
            // Remove 'ipfs://' prefix if present
            const cid = ipfsUri.replace('ipfs://', '');

            // Construct full IPFS gateway URL
            const gatewayUrl = `${this.IPFS_GATEWAY}${cid}`;

            // Fetch metadata
            const response = await axios.get(gatewayUrl);

            return response.data;
        } catch (error) {
            console.error('Failed to fetch IPFS metadata:', error);
            throw error;
        }
    }

    /**
     * Alternative method with multiple gateway fallbacks
     */
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
                // Continue to next gateway
            }
        }

        throw new Error('Unable to fetch metadata from any gateway');
    }
}

export default IPFSMetadataService;