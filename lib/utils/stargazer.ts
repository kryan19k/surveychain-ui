/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// utils/stargazer.ts

type JSONScalarValue = null | string | number | boolean;
type StargazerDagSignatureRequest = {
  content: string;
  metadata: Record<string, JSONScalarValue>;
};

export const activateStargazerProviders = async () => {
  const walletProvider = window.stargazer;
  if (!walletProvider) {
    throw new Error('Stargazer wallet is not installed');
  }
  if (!('getProvider' in walletProvider)) {
    throw new Error('This is an outdated version of Stargazer');
  }

  const ethProvider = walletProvider.getProvider('ethereum');
  await ethProvider.activate();

  const dagProvider = walletProvider.getProvider('constellation');
  try {
    await dagProvider.activate();
    const accounts = await getDAGAccounts(dagProvider);
    if (!accounts || accounts.length === 0) {
      throw new Error('No Constellation accounts found. Please create an account in your Stargazer wallet.');
    }
  } catch (error) {
    console.error('Failed to activate Constellation network:', error);
    throw new Error('Unable to activate Stargazer wallet for Constellation network. Please ensure you have a Constellation account set up in your Stargazer wallet.');
  }

  return {
    ethProvider,
    dagProvider
  };
};
export const getDAGAccounts = async (dagProvider: any) => {
  return await dagProvider.request({ method: 'dag_accounts', params: [] });
};

export const signDAGMessage = async (dagProvider: any, userAddress: string, message: any) => {
  const signatureRequest: StargazerDagSignatureRequest = {
    content: 'Sign this message to create a survey.',
    metadata: message
  };
  const signatureRequestEncoded = window.btoa(JSON.stringify(signatureRequest));
  
  try {
    return await dagProvider.request({
      method: 'dag_signMessage',
      params: [userAddress, signatureRequestEncoded]
    });
  } catch (error) {
    console.error('Error signing DAG message:', error);
    throw new Error('Failed to sign message with Stargazer wallet');
  }
};

export const getDAGPublicKey = async (dagProvider: any, userAddress: string) => {
  return await dagProvider.request({
    method: 'dag_getPublicKey',
    params: [userAddress]
  });
};