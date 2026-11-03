const I = {
  workflow:'<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v3a3 3 0 0 0 3 3h3"/>',
  analytics:'<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-4"/><path d="M13 16V8"/><path d="M18 16v-7"/>',
  leads:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  bolt:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/>'
};
export const features = [
  ['workflow','Clever workflows','Automate every hand-off with visual, branching pipelines that move deals forward while you sleep.'],
  ['analytics','Live analytics','Real-time dashboards turn raw funnel data into the one number that tells you what to do next.'],
  ['leads','Seamless leads','Capture, score, and route every lead automatically — no spreadsheet, no leak, no lag.'],
  ['bolt','Instant triggers','Fire actions across your stack the moment intent appears, in milliseconds not minutes.'],
  ['shield','Enterprise-grade','SOC 2, SSO, and granular roles baked in — security that scales quietly with your team.'],
  ['globe','Global by default','Multi-region, multi-currency, and low-latency everywhere your customers happen to be.']
].map(([k,t,d])=>({icon:`<svg viewBox="0 0 24 24">${I[k]}</svg>`,t,d}));
export const bars=[62,88,47,95,71,80,58];
export const rows=[['New leads',90],['Qualified',72],['In negotiation',48],['Closed won',34]];
export const stats=[['3.4×','Faster pipeline velocity'],['92%','Lead capture accuracy'],['11k+','Teams scaling on Ascend'],['$2.1B','Revenue influenced']];
export const plans=[
  {n:'Launch',p:'$0',t:'For solo operators testing the air.',f:['1 workflow pipeline','500 leads / month','Basic analytics'],c:'Start free'},
  {n:'Orbit',p:'$49',t:'For teams ready to compound.',f:['Unlimited workflows','50k leads / month','Live dashboards','Instant triggers'],c:'Choose Orbit',hot:true},
  {n:'Escape velocity',p:'Custom',t:'For revenue orgs at global scale.',f:['SSO & granular roles','Multi-region routing','Dedicated success lead'],c:'Talk to Sales'}
];