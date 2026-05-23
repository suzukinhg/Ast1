const fs = require('fs');

const data = {
  zh: { title: '生态合作伙伴', desc: '与全球顶尖的科技企业与AI模型提供商建立深度融合，构建无缝衔接的智能生态。' },
  en: { title: 'Ecological Partners', desc: 'Establishing deep integration with top global tech enterprises and AI model providers to build a seamless intelligent ecosystem.' },
  ja: { title: 'エコシステムパートナー', desc: '世界トップのテクノロジー企業やAIモデルプロバイダーと深く統合し、シームレスなインテリジェントエコシステムを構築します。' },
  fr: { title: 'Partenaires Écologiques', desc: 'Établir une intégration profonde avec les meilleures entreprises technologiques mondiales et les fournisseurs de modèles d\'IA pour construire un écosystème intelligent sans faille.' },
  ko: { title: '생태 파트너', desc: '세계 최고 기술 기업 및 AI 모델 제공업체와 원활한 지능형 생태계를 구축하기 위해 깊이 있게 통합합니다.' },
  pt: { title: 'Parceiros Ecológicos', desc: 'Estabelecendo uma profunda integração com as principais empresas de tecnologia globais e provedores de modelos de IA para construir um ecossistema inteligente perfeito.' },
};

Object.entries(data).forEach(([lang, content]) => {
  const filePath = `src/locales/${lang}.json`;
  if (fs.existsSync(filePath)) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    json.partners = content;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  }
});

console.log("Done");
