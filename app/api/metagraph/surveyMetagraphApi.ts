/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// app/api/metagraph/surveyMetagraphApi.ts

import axios from 'axios';
import { dag4 } from '@stardust-collective/dag4';
import { activateStargazerProviders, getDAGAccounts, signDAGMessage, getDAGPublicKey } from '@/lib/utils/stargazer';
import { sha256 } from 'ethers/lib/utils';

const METAGRAPH_L1_DATA_URL = `https://cors-anywhere.herokuapp.com/${process.env.NEXT_PUBLIC_METAGRAPH_L1_DATA_URL || 'http://localhost:9400'}`;

const getEncoded = (value: any): string => {
  return JSON.stringify(value);
};

const serialize = (msg: string): string => {
  return Buffer.from(msg, 'utf8').toString('hex');
};

const generateProof = async (message: any, walletPrivateKey: string, account: any) => {
  const encoded = getEncoded(message);
  const serializedTx = serialize(encoded);
  const hash = sha256(Buffer.from(serializedTx, 'hex'));
  const signature = await dag4.keyStore.sign(walletPrivateKey, hash);

  const publicKey = account.publicKey;
  const uncompressedPublicKey = publicKey.length === 128 ? '04' + publicKey : publicKey;

  return {
    id: uncompressedPublicKey.substring(2),
    signature
  };
};

const sendDataTransaction = async (message: any) => {
  try {
    const { dagProvider } = await activateStargazerProviders();
    const dagAccounts = await getDAGAccounts(dagProvider);
    const userAddress = dagAccounts[0];

    console.log('Sending survey data:', JSON.stringify(message, null, 2));

    let signature;
    try {
      signature = await signDAGMessage(dagProvider, userAddress, message);
    } catch (signError) {
      console.error('Signature error:', signError);
      throw new Error('Failed to sign message with Stargazer wallet');
    }

    const publicKey = await getDAGPublicKey(dagProvider, userAddress);

    const signatureRequestEncoded = window.btoa(JSON.stringify({
      content: 'Sign this message to create a survey.',
      metadata: message
    }));

    const body = {
      value: message,
      proofs: [
        {
          signature,
          id: publicKey
        }
      ],
      signatureRequest: signatureRequestEncoded
    };

    console.log("Full request body:", JSON.stringify(body, null, 2));

    const response = await axios.post(`${METAGRAPH_L1_DATA_URL}/data`, body);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending transaction", error);
    throw error;
  }
};

export const createSurvey = async (surveyData: any) => {
  console.log("Creating survey:", JSON.stringify(surveyData, null, 2));
  return sendDataTransaction(surveyData);
};

export const submitSurveyResponse = async (responseData: any) => {
  const message = {
    SubmitResponse: responseData
  };
  return sendDataTransaction(message);
};

export const getAllSurveys = async () => {
  try {
    const response = await axios.get(`${METAGRAPH_L1_DATA_URL}/surveys`);
    return response.data;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    throw error;
  }
};

export const getSurveyById = async (surveyId: string) => {
  try {
    const response = await axios.get(`${METAGRAPH_L1_DATA_URL}/surveys/${surveyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching survey:", error);
    throw error;
  }
};

export const getSurveyResponses = async (surveyId: string) => {
  try {
    const response = await axios.get(`${METAGRAPH_L1_DATA_URL}/surveys/${surveyId}/responses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    throw error;
  }
};