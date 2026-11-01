import {configured,json,signAsset} from '../../lib/server.mjs';
const archiveTracks=[
  'Reinforcement Learning For Quantitative Trading.mp3',
  'How FinRL Meta simulates market chaos.mp3',
  'Predicting stocks with visibility graph geometry.mp3',
  'Pricing European calls with Quantum Fourier Transform.mp3',
  'The peak of doom in quantum computers.mp3'
];
export async function GET({url}){const index=Number(url.searchParams.get('index'));if(!Number.isInteger(index)||index<0||index>=archiveTracks.length)return json({error:'Unknown sample'},400);if(!configured())return json({available:false});try{return json({available:true,url:await signAsset(archiveTracks[index],'ab')});}catch{return json({available:false});}}
