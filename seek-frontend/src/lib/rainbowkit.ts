import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Seek',
  projectId: '8d5df6a008897a241d22c381acfd93bb', // Get one at https://cloud.walletconnect.com
  chains: [polygon],
  ssr: false,
});
