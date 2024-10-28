import { baseSepolia, optimismSepolia } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type AppKitNetwork } from "@reown/appkit/networks";

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia, optimismSepolia];

export const queryClient = new QueryClient();

const projectId = 'af737594777c893e5ab82a7fef7e4f42';

const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'https://example.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }

export const wagmiAdapter = new WagmiAdapter({
	networks,
	projectId,
	ssr: true
  })

export const appkitCfg = {
    	adapters: [wagmiAdapter],
        networks,
        projectId,
        metadata,
        features: {
            analytics: true 
        }
}