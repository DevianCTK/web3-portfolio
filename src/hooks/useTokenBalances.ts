import { useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { useWalletStore } from '../store/useWalletStore';
import { TOKEN_CONTRACTS, ERC20_ABI } from '../config/tokenContracts';

// Poll interval in ms
const DEFAULT_POLL = 30_000;

export function useTokenBalances(pollInterval = DEFAULT_POLL) {
    const address = useWalletStore((s) => s.address);
    const mode = useWalletStore((s) => s.mode);
    const setTokenBalances = useWalletStore((s) => s.setTokenBalances);

    const publicClient = usePublicClient();

    useEffect(() => {
        let mounted = true;
        let timer: ReturnType<typeof setInterval> | null = null;

        async function fetchBalances() {
            if (!address || mode !== 'wallet') {
                if (mounted) setTokenBalances({});
                return;
            }

            const result: Record<string, string> = {};

            if (!publicClient) {
                // If there's no public client yet, keep store empty to avoid runtime errors
                if (mounted) setTokenBalances({});
                return;
            }

            const client = publicClient;
            const infos = Object.values(TOKEN_CONTRACTS);
            for (const info of infos) {
                try {
                    const raw = await client.readContract({
                        address: info.address as `0x${string}`,
                        abi: ERC20_ABI,
                        functionName: 'balanceOf',
                        args: [address],
                    });

                    // raw may be bigint
                    const balanceStr = formatUnits(raw as bigint, info.decimals);
                    result[info.symbol] = Number(balanceStr).toString();
                } catch {
                    // on error, set 0 so UI remains consistent
                    result[info.symbol] = '0';
                }
            }

            if (mounted) setTokenBalances(result);
        }

        // initial fetch
        fetchBalances().catch(() => { });

        // poll
        timer = setInterval(() => void fetchBalances(), pollInterval);

        return () => {
            mounted = false;
            if (timer) clearInterval(timer);
        };
    }, [address, mode, publicClient, pollInterval, setTokenBalances]);
}
