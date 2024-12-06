import React, { useState, useEffect } from 'react';
import { SigningStargateClient } from '@cosmjs/stargate';
import { Window as KeplrWindow } from '@keplr-wallet/types';
import { formatDistance } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { CHAIN_CONFIGS, ChainConfig } from '../config/chains';
import { useTranslation } from 'react-i18next';
import ChainSelector from './ChainSelector';

declare global {
  interface Window extends KeplrWindow {}
}

interface Proposal {
  id: string;
  title: string;
  voting_start_time: string;
  voting_end_time: string;
  status: string;
  messages: any[];
  final_tally_result?: {
    yes_count: string;
    no_count: string;
    abstain_count: string;
    no_with_veto_count: string;
  };
}

interface VoteInfo {
  options: Array<{
    option: string;
    weight: string;
  }>;
}

interface ChainAddresses {
  [chainId: string]: string;
}

// 添加一个扇形图组件
const PieChart: React.FC<{
  percentages: {
    yes: number;
    no: number;
    abstain: number;
    noWithVeto: number;
  };
  size?: number;
}> = ({ percentages, size = 40 }) => {
  const total = 100;
  const radius = size / 2;
  const center = size / 2;
  
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  let currentPercent = 0;
  const segments: JSX.Element[] = [];
  const colors = ['#22C55E', '#EF4444', '#EAB308', '#F97316']; // green, red, yellow, orange
  const data = [
    percentages.yes,
    percentages.no,
    percentages.abstain,
    percentages.noWithVeto
  ];

  data.forEach((percent, i) => {
    if (percent === 0) return;
    
    const [startX, startY] = getCoordinatesForPercent(currentPercent);
    currentPercent += percent / total;
    const [endX, endY] = getCoordinatesForPercent(currentPercent);
    
    const largeArcFlag = percent / total > 0.5 ? 1 : 0;
    
    segments.push(
      <path
        key={i}
        d={`M ${center} ${center}
            L ${center + radius * startX} ${center + radius * startY}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${center + radius * endX} ${center + radius * endY}
            L ${center} ${center}`}
        fill={colors[i]}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments}
    </svg>
  );
};

const ProposalList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedChain, setSelectedChain] = useState<ChainConfig>(CHAIN_CONFIGS[0]);
  const [chainAddresses, setChainAddresses] = useState<ChainAddresses>({});
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<Record<string, VoteInfo | null>>({});

  useEffect(() => {
    fetchProposals(selectedChain);
  }, [selectedChain]);

  useEffect(() => {
    if (chainAddresses[selectedChain.chainId] && proposals.length > 0) {
      proposals.forEach(proposal => {
        fetchVoteInfo(proposal.id, selectedChain);
      });
    }
  }, [chainAddresses, selectedChain, proposals]);

  const connectKeplr = async () => {
    if (!window.keplr) {
      alert("请安装 Keplr 钱包！");
      return;
    }

    try {
      // 直接连接所有链
      await Promise.all(CHAIN_CONFIGS.map(async (chain) => {
        try {
          await window.keplr!.enable(chain.chainId);
          const offlineSigner = window.keplr!.getOfflineSigner(chain.chainId);
          const accounts = await offlineSigner.getAccounts();
          setChainAddresses(prev => ({
            ...prev,
            [chain.chainId]: accounts[0].address
          }));
        } catch (error) {
          console.error(`连接 ${chain.displayName} 失败:`, error);
        }
      }));
    } catch (error) {
      console.error("连接钱包错误:", error);
      alert("连接钱包失败，请查看控制台了解详情");
    }
  };

  const fetchProposals = async (chain: ChainConfig) => {
    try {
      setLoading(true);
      const response = await fetch(`${chain.restEndpoint}/cosmos/gov/v1/proposals?proposal_status=2`);
      const data = await response.json();
      
      const proposalsWithTally = await Promise.all(
        (data.proposals || []).map(async (proposal: Proposal) => {
          try {
            const tallyResponse = await fetch(
              `${chain.restEndpoint}/cosmos/gov/v1/proposals/${proposal.id}/tally`
            );
            const tallyData = await tallyResponse.json();
            return {
              ...proposal,
              final_tally_result: tallyData.tally
            };
          } catch (error) {
            console.error(`获取提案 ${proposal.id} 的投票统计失败:`, error);
            return proposal;
          }
        })
      );
      
      setProposals(proposalsWithTally);
    } catch (error) {
      console.error("获取提案失败:", error);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteInfo = async (proposalId: string, chain: ChainConfig) => {
    const address = chainAddresses[chain.chainId];
    if (!address) return;
    
    try {
      const response = await fetch(
        `${chain.restEndpoint}/cosmos/gov/v1/proposals/${proposalId}/votes/${address}`
      );
      if (response.ok) {
        const data = await response.json();
        setVotes(prev => ({
          ...prev,
          [proposalId]: data.vote
        }));
      } else if (response.status === 400) {
        // 400 状态码表示未投票，这是正常情况
        setVotes(prev => ({
          ...prev,
          [proposalId]: null
        }));
      } else {
        console.error(`获取提案 ${proposalId} 的投票信息失败: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`获取提案 ${proposalId} 的投票信息失败:`, error);
      setVotes(prev => ({
        ...prev,
        [proposalId]: null
      }));
    }
  };

  const getVoteText = (vote: VoteInfo) => {
    if (!vote.options || vote.options.length === 0) return t('voteStatus.notVoted');
    
    const option = vote.options[0].option;
    switch (option) {
      case "VOTE_OPTION_YES": return t('voteStatus.votedYes');
      case "VOTE_OPTION_ABSTAIN": return t('voteStatus.votedAbstain');
      case "VOTE_OPTION_NO": return t('voteStatus.votedNo');
      case "VOTE_OPTION_NO_WITH_VETO": return t('voteStatus.votedVeto');
      default: return t('voteStatus.notVoted');
    }
  };

  const getVoteOption = (opt: number) => {
    switch (opt) {
      case 1: return 1; // VOTE_OPTION_YES
      case 2: return 2; // VOTE_OPTION_ABSTAIN (弃权)
      case 3: return 3; // VOTE_OPTION_NO
      case 4: return 4; // VOTE_OPTION_NO_WITH_VETO (坚决反对)
      default: return 0; // VOTE_OPTION_UNSPECIFIED
    };
  };

  const getVoteOptionString = (opt: number) => {
    switch (opt) {
      case 1: return "VOTE_OPTION_YES";
      case 2: return "VOTE_OPTION_ABSTAIN";
      case 3: return "VOTE_OPTION_NO";
      case 4: return "VOTE_OPTION_NO_WITH_VETO";
      default: return "VOTE_OPTION_UNSPECIFIED";
    }
  };

  const vote = async (proposalId: string, option: number) => {
    try {
      const address = chainAddresses[selectedChain.chainId];
      if (!window.keplr || !address) {
        alert("请先连接钱包！");
        return;
      }

      const offlineSigner = window.keplr.getOfflineSigner(selectedChain.chainId);
      const client = await SigningStargateClient.connectWithSigner(
        selectedChain.rpcEndpoint,
        offlineSigner
      );

      const msg = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: {
          proposalId: proposalId,
          voter: address,
          option: getVoteOption(option)  // 发送交易时使用数字
        }
      };

      const fee = {
        amount: [{
          denom: selectedChain.denom,
          amount: "1000"
        }],
        gas: "200000"
      };

      const result = await client.signAndBroadcast(address, [msg], fee);
      if (result.code === 0) {
        alert("投票成功！");
        setVotes(prev => ({
          ...prev,
          [proposalId]: {
            options: [{
              option: getVoteOptionString(option),  // 更新状态时使用字符串
              weight: "1.000000000000000000"
            }]
          }
        }));
      } else {
        alert("投票失败：" + result.rawLog);
      }
    } catch (error) {
      console.error("投票错误:", error);
      alert("投票失败，请查看控制台了解详情");
    }
  };

  const calculateVotePercentages = (tally: Proposal['final_tally_result']) => {
    if (!tally) return null;
    
    const total = BigInt(tally.yes_count) + 
                 BigInt(tally.no_count) + 
                 BigInt(tally.abstain_count) + 
                 BigInt(tally.no_with_veto_count);
    
    if (total === 0n) return null;
    
    return {
      yes: Number((BigInt(tally.yes_count) * 100n) / total),
      no: Number((BigInt(tally.no_count) * 100n) / total),
      abstain: Number((BigInt(tally.abstain_count) * 100n) / total),
      noWithVeto: Number((BigInt(tally.no_with_veto_count) * 100n) / total)
    };
  };

  const getCurrentVoteOption = (vote: VoteInfo | null) => {
    if (!vote || !vote.options || vote.options.length === 0) return null;
    switch (vote.options[0].option) {
      case "VOTE_OPTION_YES": return 1;
      case "VOTE_OPTION_ABSTAIN": return 2;
      case "VOTE_OPTION_NO": return 3;
      case "VOTE_OPTION_NO_WITH_VETO": return 4;
      default: return null;
    }
  };

  const getLocale = () => {
    return i18n.language === 'zh' ? zhCN : enUS;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 标题部分 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 relative inline-block">
            {t('title')}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
          </h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>

        {/* 添加链选择器和钱包连接按钮 */}
        <div className="mb-8 flex flex-col items-center space-y-4">
          {/* 链选择器 */}
          <ChainSelector
            chains={CHAIN_CONFIGS}
            selectedChain={selectedChain}
            onSelect={setSelectedChain}
            chainAddresses={chainAddresses}
          />

          {/* 钱包连接按钮 */}
          <button 
            onClick={connectKeplr}
            className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg
                     shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out 
                     flex items-center space-x-3 transform hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-lg">
              {Object.keys(chainAddresses).length > 0 
                ? t('connectedWallet')
                : t('connectWallet')}
            </span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-center text-gray-600">加载中...</div>
            </div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">{t('noProposals')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider w-24">
                    {t('table.proposalId')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider w-64">
                    {t('table.title')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider w-32">
                    {t('table.startTime')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider w-32">
                    {t('table.endTime')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider w-32">
                    {t('table.voteStatus')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider w-32">
                    {t('table.voteRatio')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {proposals.map((proposal) => {
                  const percentages = calculateVotePercentages(proposal.final_tally_result);
                  
                  return (
                    <tr key={proposal.id} className="hover:bg-indigo-50 transition-colors duration-150 ease-in-out">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          #{proposal.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="group relative">
                          <div className="text-sm text-gray-900 font-medium hover:text-indigo-600 transition-colors duration-150 truncate max-w-[200px]">
                            {proposal.title.length > 20 ? proposal.title.slice(0, 20) + '...' : proposal.title}
                          </div>
                          {proposal.title.length > 20 && (
                            <div className="invisible group-hover:visible absolute z-50 w-64 p-2 mt-1 
                                          text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-lg 
                                          left-0 transform -translate-y-1">
                              {proposal.title}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistance(new Date(proposal.voting_start_time), new Date(), { 
                          locale: getLocale(),
                          addSuffix: true 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistance(new Date(proposal.voting_end_time), new Date(), { 
                          locale: getLocale(),
                          addSuffix: true 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {chainAddresses[selectedChain.chainId] ? (
                          votes[proposal.id] ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                              <span className="w-2 h-2 mr-2 rounded-full bg-green-400"></span>
                              {getVoteText(votes[proposal.id]!)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                              <span className="w-2 h-2 mr-2 rounded-full bg-yellow-400"></span>
                              {t('voteStatus.notVoted')}
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
                            <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
                            {t('voteStatus.notConnected')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {percentages ? (
                          <div className="group relative">
                            <div className="flex items-center space-x-2">
                              <PieChart percentages={percentages} />
                              <span className="text-sm text-gray-500">{t('voteChart.details')}</span>
                            </div>
                            <div className="invisible group-hover:visible absolute z-50 p-3 mt-1 
                                          bg-white border border-gray-200 rounded-lg shadow-lg 
                                          left-0 transform -translate-y-1">
                              <div className="space-y-2 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <span className="text-sm">{t('voteChart.yes')}: {percentages.yes.toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <span className="text-sm">{t('voteChart.no')}: {percentages.no.toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                  <span className="text-sm">{t('voteChart.abstain')}: {percentages.abstain.toFixed(1)}%</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                  <span className="text-sm">{t('voteChart.veto')}: {percentages.noWithVeto.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">{t('voteChart.noVotes')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {chainAddresses[selectedChain.chainId] && (
                          <div className="flex space-x-2">
                            {getCurrentVoteOption(votes[proposal.id]) !== 1 && (
                              <button 
                                onClick={() => vote(proposal.id, 1)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg
                                         text-white bg-green-500 hover:bg-green-600 
                                         transition-colors duration-150 ease-in-out
                                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                {t('voteButtons.yes')}
                              </button>
                            )}
                            {getCurrentVoteOption(votes[proposal.id]) !== 2 && (
                              <button 
                                onClick={() => vote(proposal.id, 2)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg
                                         text-white bg-yellow-500 hover:bg-yellow-600
                                         transition-colors duration-150 ease-in-out
                                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                              >
                                {t('voteButtons.abstain')}
                              </button>
                            )}
                            {getCurrentVoteOption(votes[proposal.id]) !== 3 && (
                              <button 
                                onClick={() => vote(proposal.id, 3)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg
                                         text-white bg-red-500 hover:bg-red-600
                                         transition-colors duration-150 ease-in-out
                                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                {t('voteButtons.no')}
                              </button>
                            )}
                            {getCurrentVoteOption(votes[proposal.id]) !== 4 && (
                              <button 
                                onClick={() => vote(proposal.id, 4)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg
                                         text-white bg-orange-500 hover:bg-orange-600
                                         transition-colors duration-150 ease-in-out
                                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                              >
                                {t('voteButtons.veto')}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalList; 