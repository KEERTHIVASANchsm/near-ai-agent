import { Wallet } from '../near';

export async function callContractMethod(
  method: string,
  args: Record<string, any> = {},
  gas?: string,
  deposit?: string
) {
  const contract = Wallet.getContract();
  return contract[method]({
    args,
    gas: gas || '300000000000000',
    amount: deposit || '0',
  });
}

export function handleContractError(error: any): string {
  if (error?.kind?.ExecutionError?.includes('ContractError')) {
    return error.kind.ExecutionError.split('ContractError: ')[1];
  }
  return error?.message || 'Unknown error occurred';
}