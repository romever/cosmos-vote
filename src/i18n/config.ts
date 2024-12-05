import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'Cosmos Governance',
      subtitle: 'Participate in Cosmos Hub decentralized governance, shape the future of blockchain',
      connectWallet: 'Connect Keplr Wallet',
      connectedWallet: 'Connected All Wallets',
      loading: 'Loading...',
      noProposals: 'No Active Proposals',
      table: {
        proposalId: 'Proposal ID',
        title: 'Title',
        startTime: 'Started',
        endTime: 'Ends in',
        voteStatus: 'Vote Status',
        voteRatio: 'Vote Ratio',
        actions: 'Actions'
      },
      voteStatus: {
        notConnected: 'Please Connect Wallet',
        notVoted: 'Not Voted',
        votedYes: 'Voted Yes',
        votedNo: 'Voted No',
        votedAbstain: 'Voted Abstain',
        votedVeto: 'Voted Veto'
      },
      voteButtons: {
        yes: 'Yes',
        no: 'No',
        abstain: 'Abstain',
        veto: 'Veto'
      },
      voteChart: {
        details: 'View Details',
        yes: 'Yes',
        no: 'No',
        abstain: 'Abstain',
        veto: 'Veto',
        noVotes: 'No votes yet'
      },
      messages: {
        installKeplr: 'Please install Keplr wallet!',
        voteSuccess: 'Vote successful!',
        voteFailed: 'Vote failed: ',
        error: 'Error, please check console for details'
      }
    }
  },
  zh: {
    translation: {
      title: 'Cosmos 治理提案',
      subtitle: '参与 Cosmos Hub 的去中心化治理，塑造区块链的未来',
      connectWallet: '连接 Keplr 钱包',
      connectedWallet: '已连接全部钱包',
      loading: '加载中...',
      noProposals: '暂无活跃提案',
      table: {
        proposalId: '提案ID',
        title: '标题',
        startTime: '开始时间',
        endTime: '结束时间',
        voteStatus: '投票状态',
        voteRatio: '投票比例',
        actions: '操作'
      },
      voteStatus: {
        notConnected: '请先连接钱包',
        notVoted: '未投票',
        votedYes: '已投赞成',
        votedNo: '已投反对',
        votedAbstain: '已投弃权',
        votedVeto: '已投否决'
      },
      voteButtons: {
        yes: '赞成',
        no: '反对',
        abstain: '弃权',
        veto: '否决'
      },
      voteChart: {
        details: '查看详情',
        yes: '赞成',
        no: '反对',
        abstain: '弃权',
        veto: '否决',
        noVotes: '暂无投票'
      },
      messages: {
        installKeplr: '请安装 Keplr 钱包！',
        voteSuccess: '投票成功！',
        voteFailed: '投票失败：',
        error: '投票失败，请查看控制台了解详情'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 